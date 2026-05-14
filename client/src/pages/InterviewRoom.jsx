import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import Button from "../components/Button";
import { 
  IoMicOutline, IoVideocamOutline, IoStopCircleOutline, 
  IoPlayOutline, IoBriefcaseOutline 
} from "react-icons/io5";

export default function InterviewRoom() {
  const videoRef = useRef(null);
  
  // New State for Role Selection
  const [isConfigured, setIsConfigured] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Software Engineer");
  const [customRole, setCustomRole] = useState("");

  const [hasStarted, setHasStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const commonRoles = ["Software Engineer", "Data Scientist", "Account Manager", "Product Manager", "UI/UX Designer"];

  // 1. Handle Role Setup
  const handleSetupComplete = () => {
    const finalRole = customRole || selectedRole;
    setSelectedRole(finalRole);
    // Dynamically set the first greeting based on the role!
    setAiResponse(`Hello! I am your AI hiring manager. Let's start your interview for the ${finalRole} position. Tell me a little bit about your background and why you are a good fit for this role.`);
    setIsConfigured(true);
  };

  // 2. Initialize Camera (Only runs AFTER setup is complete)
  useEffect(() => {
    if (!isConfigured) return;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera access denied", err);
      }
    }
    startCamera();

    return () => {
      const tracks = videoRef.current?.srcObject?.getTracks();
      tracks?.forEach(track => track.stop());
      window.speechSynthesis.cancel();
    };
  }, [isConfigured]);

  const speakAI = (text) => {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    speech.voice = voices.find(v => v.name.includes("Google") || v.name.includes("English")) || voices[0];
    speech.rate = 0.95;
    window.speechSynthesis.speak(speech);
  };

  const beginInterview = () => {
    setHasStarted(true);
    speakAI(aiResponse);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Your browser doesn't support Voice APIs. Please use Google Chrome.");

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      window.speechSynthesis.cancel();
      setIsListening(true);
    };
    
    recognition.onresult = async (event) => {
      const userSpokenAnswer = event.results[0][0].transcript;
      setTranscript(userSpokenAnswer);
      setIsListening(false);
      submitAnswerToAI(userSpokenAnswer);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  const submitAnswerToAI = async (answer) => {
    setIsLoading(true);
    setAiResponse("Analyzing your answer...");
    
    try {
      // Pass the selected role to the backend!
      const res = await api.post("/ai/mock-interview", { 
        answer, 
        questionNumber,
        role: selectedRole 
      });
      
      setAiResponse(res.data.feedback);
      speakAI(res.data.feedback);
      setQuestionNumber(prev => prev + 1);
    } catch (err) {
      const errorMsg = "Sorry, my connection dropped. Can you repeat that?";
      setAiResponse(errorMsg);
      speakAI(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // --- UI: Configuration Screen ---
  if (!isConfigured) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-10">
        <div className="glass-card p-8 border dark:border-slate-800 rounded-3xl shadow-xl bg-white dark:bg-slate-900 text-center">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
            <IoBriefcaseOutline size={32} />
          </div>
          <h1 className="text-3xl font-bold dark:text-white mb-2">Configure Interview</h1>
          <p className="text-slate-500 mb-8">What role are you interviewing for today?</p>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            {commonRoles.map(r => (
              <button 
                key={r}
                onClick={() => { setSelectedRole(r); setCustomRole(""); }}
                className={`p-4 rounded-xl border-2 transition-all font-semibold ${
                  selectedRole === r && !customRole 
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400" 
                    : "border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-300"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t dark:border-slate-800"></div></div>
            <div className="relative flex justify-center"><span className="bg-white dark:bg-slate-900 px-4 text-sm text-slate-400">OR ENTER CUSTOM ROLE</span></div>
          </div>

          <input 
            type="text" 
            placeholder="e.g. Senior DevOps Engineer"
            value={customRole}
            onChange={(e) => setCustomRole(e.target.value)}
            className="w-full p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-transparent dark:text-white mb-8 focus:border-indigo-600 outline-none transition-all"
          />

          <Button onClick={handleSetupComplete} className="w-full py-4 text-lg font-bold rounded-xl shadow-lg shadow-indigo-600/30">
            Enter Interview Room
          </Button>
        </div>
      </div>
    );
  }

  // --- UI: The Interview Room ---
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold dark:text-white flex items-center gap-3">
            <IoVideocamOutline className="text-indigo-500" /> Live Mock Interview
          </h1>
          <p className="text-slate-500 font-medium mt-1">Role: <span className="text-indigo-500">{selectedRole}</span></p>
        </div>
        {hasStarted && (
          <div className="px-4 py-2 bg-red-100 text-red-600 rounded-full font-bold animate-pulse text-sm flex items-center gap-2 border border-red-200">
            <div className="w-2 h-2 rounded-full bg-red-600"></div> RECORDING
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT: Camera View */}
        <div className="col-span-2 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-black aspect-video border-4 border-slate-200 dark:border-slate-800 shadow-2xl">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
            
            {!hasStarted && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <Button onClick={beginInterview} className="px-8 py-4 text-lg flex items-center gap-3">
                  <IoPlayOutline size={24} /> Start {selectedRole} Interview
                </Button>
              </div>
            )}
            {isListening && (
              <div className="absolute top-6 right-6 px-4 py-2 bg-black/70 backdrop-blur text-white rounded-full flex items-center gap-2 border border-white/20">
                <IoMicOutline className="animate-pulse text-red-500" /> Listening...
              </div>
            )}
          </div>

          <div className="flex justify-center pt-2">
            <Button 
              onClick={startListening} 
              disabled={!hasStarted || isListening || isLoading || questionNumber > 4}
              className={`rounded-full px-10 py-4 flex items-center gap-3 text-lg transition-all ${
                isListening ? 'bg-red-500 shadow-red-500/50' : 'bg-indigo-600 shadow-indigo-600/30'
              } shadow-xl`}
            >
              {isListening ? <IoStopCircleOutline size={26} /> : <IoMicOutline size={26} />}
              {isListening ? "Release to Send" : "Click to Speak Answer"}
            </Button>
          </div>
        </div>

        {/* RIGHT: Chat Transcript */}
        <div className="glass-card p-6 rounded-3xl flex flex-col h-[500px] border dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
          <div className="flex justify-between items-center border-b dark:border-slate-800 pb-4 mb-4">
            <h3 className="text-lg font-bold dark:text-white">AI Hiring Manager</h3>
            <span className="text-sm font-mono text-indigo-500 font-bold bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
              Q: {questionNumber > 3 ? "Done" : questionNumber}/3
            </span>
          </div>
          
          <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-500/20 p-4 rounded-2xl">
              <p className="text-xs font-bold text-indigo-600 mb-2 uppercase tracking-wider">Interviewer</p>
              <p className="dark:text-slate-300 leading-relaxed">{isLoading ? "Typing..." : aiResponse}</p>
            </div>

            {transcript && (
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 p-4 rounded-2xl ml-8">
                <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">You</p>
                <p className="dark:text-slate-300 leading-relaxed">{transcript}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}