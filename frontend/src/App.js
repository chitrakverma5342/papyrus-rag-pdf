
import { useState , useRef } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LINKEDIN_URL = "https://www.linkedin.com/in/chitrak-verma-babb76421/"; 
const GITHUB_URL   = "https://github.com/chitrakverma5342/papyrus-rag-pdf";         



export default function App() {
  const answerRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [question, setQuestion]         = useState("");
  const [answer, setAnswer]             = useState("");
  const [loading, setLoading]           = useState(false);
  const [pdfReady, setPdfReady]         = useState(false);

  function handleFileChange(e) {
    setSelectedFile(e.target.files[0]);
    setUploadStatus("");
    setPdfReady(false);
  }

  async function handleUpload() {
    if (!selectedFile) { setUploadStatus("Please select a PDF first."); return; }
    setUploadStatus("Uploading and indexing… this may take a moment.");
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const res  = await fetch("https://rag-backend-53bt.onrender.com/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) { setUploadStatus("PDF indexed! You can now ask questions."); setPdfReady(true); }
      else        { setUploadStatus("Error: " + data.error); }
    } catch { setUploadStatus("Could not connect to Flask. Is it running?"); }
  }

  async function handleAsk() {
    if (!question.trim()) { setAnswer("Please type a question first."); return; }
    setLoading(true); setAnswer("");
    try {
      const res  = await fetch("https://rag-backend-53bt.onrender.com/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAnswer(data.answer);
      setTimeout(() => {
      answerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
            });
      }, 100);
    } catch { setAnswer("Could not connect to Flask. Is it running?"); }
    setLoading(false);
  }

  return (
    <div style={s.page}>

      
      <header style={s.header}>

        
        <div style={s.socialIcons}>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" style={s.iconLink} title="LinkedIn">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#215338c2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="4"/>
              <line x1="8" y1="10" x2="8" y2="17"/>
              <circle cx="8" cy="6.5" r="0.8" fill="#45C481"/>
              <path d="M12 10v7M12 13a3 3 0 0 1 6 0v4"/>
            </svg>
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" style={s.iconLink} title="GitHub">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#215338c2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
          </a>
        </div>

        
        <div style={s.logoWrap}>
          <img
            src="/papyrus.png"
            alt="Papyrus"
            style={s.logo}
          />
        </div>

      </header>

      
      <div style={s.body}>

        {/* ── LEFT COLUMN ── */}
        <div style={s.leftCol}>

          <div style={s.card}>
            <img src="/step1-doodle.png" alt="Step 1 — Upload your PDF" style={s.doodle1} />
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              style={s.fileInput}
            />
            {selectedFile && (
              <p style={s.fileName}>📄 {selectedFile.name}</p>
            )}
            <button onClick={handleUpload} style={s.btn}>
              Upload and Index PDF
            </button>
            {uploadStatus && (
              <p style={pdfReady ? s.success : s.status}>{uploadStatus}</p>
            )}
          </div>

          <div style={{ ...s.card, opacity: pdfReady ? 1 : 1 }}>
            <img src="/step2-doodle.png" alt="Step 2 — Ask a question" style={s.doodle2} />
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What is the main topic of this document?"
              style={s.textarea}
              disabled={!pdfReady}
            />
            <button
              onClick={handleAsk}
              style={{ ...s.btn, backgroundColor: "#45C481" }}
              disabled={!pdfReady || loading}
            >
              {loading ? "Thinking…" : "Ask Question"}
            </button>
          </div>

        </div>

        
        <div style={s.rightCol}>

          
          <img
            src="/flowchart.png"
            alt="RAG flowchart"
            style={s.flowchart}
          />

          
          <div style={s.lottieOverlay}>
            <DotLottieReact
              src="/animation.lottie"
              loop
              autoplay
              style={{ width: "100%", height: "100%" }}
            />
          </div>

        </div>
      </div>

      
      {answer && (
        <div ref={answerRef} style={s.answerCard}>
          <h2 style={s.answerTitle}>Answer</h2>
          <p style={s.answerText}>{answer}</p>
        </div>
      )}


    </div>
  );
}


const s = {
  crop: {
    width: "300px",
    height: "200px",
    overflow: "hidden",
  },

  
  page: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #99dfbd 0%, #c9f8e1 8%, #ffffff 45%, #ffffff 80%, #d0f6e3 100%)",
    padding: "16px 16px 16px",
    boxSizing: "border-box",
    fontFamily: "'Public Sans', Arial, sans-serif",
  },

  
  header: {
    position: "relative",          
    display: "flex",
    alignItems: "center",
    justifyContent: "center",      
    marginBottom: "32px",
    minHeight: "80px",
  },

 
  socialIcons: {
    position: "absolute",
    left: 0,
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginLeft: "20px",
    marginTop: "-60px"
  },

  iconLink: {
    display: "flex",
    alignItems: "center",
    opacity: 0.85,
    transition: "opacity 0.2s",
  },

  
  logoWrap: {
    display: "flex",
    justifyContent: "center",
  },

  
  logo: {
    maxHeight: "110px",
    width: "auto",
    objectFit: "contain",
    marginLeft: "30px",
  },

  /* ── TWO COLUMN BODY ── */
  body: {
    display: "flex",
    gap: "36px",
    alignItems: "flex-start",
    flexWrap: "wrap",
    margin: 0,
    padding: 0,              
  },

  leftCol: {
    flex: "0 0 600px",
    display: "flex",
    flexDirection: "column",
    gap: "100px",
  },

  /* white card container */
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    width : "500px",
    padding: "16px 20px 20px",
    boxShadow: "4px 4px 14px rgba(0,0,0,0.14)",
    display: "flex",
    flexDirection: "column",
    marginTop: "-80px",
    gap : "0px"
  },

  /* doodle PNG label at top of each card */
  doodle1: {
    width: "80%",
    height: "auto",
    maxHeight: "140px",
    objectFit: "contain",
    objectPosition: "right",
    marginBottom: "0px",
  },

  doodle2: {
    width: "100%",
    height: "auto",
    maxHeight: "110px",
    objectFit: "contain",
    objectPosition: "right",
    marginBottom: "1px",
  },

  fileInput: {
    marginBottom: "10px",
    fontSize: "0.95rem",
  },

  fileName: {
    color: "#444",
    fontSize: "0.88rem",
    margin: "0 0 10px",
  },

  /* dark green button */
  btn: {
    backgroundColor: "#45C481",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "13px 0",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
    width: "100%",
    marginTop: "8px",
    letterSpacing: "0.01em",
  },

  status:  { color: "#666",    fontSize: "0.88rem", marginTop: "10px" },
  success: { color: "#1a6e1a", fontSize: "0.88rem", marginTop: "10px" },

  textarea: {
    width: "100%",
    height: "90px",
    padding: "12px",
    borderRadius: "8px",
    border: "1.5px solid rgba(34,87,42,0.40)",
    backgroundColor: "#F8F8F8",
    fontSize: "0.95rem",
    resize: "vertical",
    boxSizing: "border-box",
    marginBottom: "4px",
    outline: "none",
  },

  
  rightCol: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  /* my hand-drawn flowchart JPEG — fills the right column */
  flowchart: {
    width: "60%",
    height: "20%",
    right : "5%",
    objectFit: "contain",
    borderRadius: "16px",
    display: "block",
    bottom:"60px",
    marginRight: "15px",
    marginTop: "-150px",
    alignSelf: "flex-start"
  },

  
  lottieOverlay: {
    position: "absolute",          
    bottom: "20px",                 
    right: "22%",
    transform: "translateX(-50px)",                   
    width: "700px",                
    height: "700px",
    pointerEvents: "none", 
    overflow: "hidden",
    opacity: 0.8     
  },


  answerCard: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: "14px",
    padding: "24px 28px",
    borderLeft: "5px solid #20591B",
    marginTop: "28px",
    boxShadow: "2px 2px 10px rgba(0,0,0,0.09)",
  },

  answerTitle: {
    color: "#17613E",
    fontSize: "1.1rem",
    fontWeight: "700",
    marginBottom: "10px",
    marginTop: 0,
  },

  answerText: {
    color: "#222",
    lineHeight: "1.75",
    margin: 0,
    fontSize: "0.97rem",
  },


};
