import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import mammoth from "mammoth";
import groq from "../config/groq.js";
// import FileModel from "../models/FileModel.js";
 import FileModel from "../models/FIleModel.js";

// Helper: Break long text into smaller chunks
const chunkText = (text, chunkSize = 1000) => {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push({
      text: text.slice(i, i + chunkSize),
      chunkIndex: chunks.length,
    });
  }
  return chunks;
};

// 1. UPLOAD & EXTRACT TEXT
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const filePath = req.file.path;
    const fileType = req.file.mimetype;
    let extractedText = "";

    // -- Handle PDF --
    if (fileType === "application/pdf") {
      const data = new Uint8Array(fs.readFileSync(filePath));
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item) => item.str);
        text += strings.join(" ");
      }
      extractedText = text;
    } 
    // -- Handle DOCX --
    else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const result = await mammoth.extractRawText({ path: filePath });
      extractedText = result.value;
    } else {
      return res.status(400).json({ success: false, message: "Only PDF and DOCX supported" });
    }

    const chunks = chunkText(extractedText);

    // Save to MongoDB as a File
    const fileRecord = await FileModel.create({
      userId: req.body.userId,
      title: req.body.title || req.file.originalname, 
      fileUrl: filePath,
      fileType,
      extractedText,
      chunks,
    });

    return res.status(201).json({ success: true, message: "File uploaded", file: fileRecord });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. ASK QUESTIONS
export const askFile = async (req, res) => {
  try {
    const { fileId, question } = req.body;
    const fileRecord = await FileModel.findById(fileId);

    if (!fileRecord) return res.status(404).json({ success: false, message: "File not found" });

    const questionWords = question.toLowerCase().replace(/[^\w\s]/gi, "").split(" ").filter((w) => w.length > 2);
    
    const matchedChunks = fileRecord.chunks
      .map((chunk) => {
        const chunkText = chunk.text.toLowerCase();
        let score = 0;
        questionWords.forEach((word) => { if (chunkText.includes(word)) score++; });
        return { ...chunk.toObject(), score };
      })
      .filter((chunk) => chunk.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); 

    const context = matchedChunks.map((chunk) => chunk.text).join("\n");

    const prompt = `
      You are an AI assistant. Answer using the provided file context.
      If the answer exists in the file, answer clearly and concisely.
      If the answer is not found, say: "I could not find this information in the file."

      FILE CONTEXT:
      ${context}

      QUESTION:
      ${question}
    `;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are an adaptive AI tutor." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    return res.status(200).json({
      success: true,
      response: completion.choices[0]?.message?.content,
      retrievedChunks: matchedChunks.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. GET USER'S FILES
export const getFiles = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ success: false, message: "userId is required" });

    const files = await FileModel.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, files });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

 





