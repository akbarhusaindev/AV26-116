import fs from "fs";
import mammoth from "mammoth";
import axios from "axios";
import Document from "../models/Document.js";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

// Helper for breaking text into searchable chunks
const chunkText = (text, chunkSize = 1000) => {
  if (!text) return [];
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push({ text: text.slice(i, i + chunkSize), chunkIndex: chunks.length });
  }
  return chunks;
};

// 1. Upload and Parse
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const filePath = req.file.path;
    const fileType = req.file.mimetype;
    let extractedText = "";

    if (fileType === "application/pdf") {
      const data = new Uint8Array(fs.readFileSync(filePath));
      const pdf = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
      
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map(item => item.str);
        fullText += strings.join(" ") + "\n";
      }
      extractedText = fullText;
    } 
    else if (
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
      req.file.originalname.endsWith(".docx")
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      extractedText = result.value;
    }

    const chunks = chunkText(extractedText);
    const document = await Document.create({
      userId: req.user._id,
      title: req.file.originalname,
      fileUrl: filePath,
      fileType,
      extractedText,
      chunks
    });

    res.status(201).json({ success: true, document });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Server error during upload" });
  }
};

// 2. Ask Question (This was likely missing or misnamed!)
export const askDocument = async (req, res) => {
  try {
    const { documentId, question } = req.body;
    const document = await Document.findOne({ _id: documentId, userId: req.user._id });
    
    if (!document) return res.status(404).json({ message: "Document not found" });

    // RAG Retrieval: Find relevant chunks
    const qWords = question.toLowerCase().split(" ").filter(w => w.length > 3);
    const matched = document.chunks.map(c => {
      let score = 0;
      qWords.forEach(w => { if (c.text.toLowerCase().includes(w)) score++; });
      return { ...c.toObject(), score };
    }).filter(c => c.score > 0).sort((a, b) => b.score - a.score).slice(0, 5);

    const context = matched.length > 0 ? matched.map(m => m.text).join("\n") : document.extractedText.slice(0, 2000);
    
    const prompt = `Context from document:\n${context}\n\nQuestion: ${question}\n\nAnswer concisely based ONLY on the context above.`;

    const result = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );

    const answer = result.data.candidates[0].content.parts[0].text;
    res.json({ response: answer });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: "AI Analysis failed" });
  }
};

// 3. Get All Documents
export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ documents });
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
};