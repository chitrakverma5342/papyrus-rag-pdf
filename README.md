# 📄 Smart PDF Question-Answering System (RAG)

An end-to-end Retrieval-Augmented Generation (RAG) web application that allows users to upload PDF documents and ask context-aware questions based on their contents.

![Python](https://img.shields.io/badge/Backend-Flask%20%7C%20LangChain-blue)
![React](https://img.shields.io/badge/Frontend-React%20%7C%20Vercel-black)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🚀 Live Demo

* **Frontend App:** [https://papyrus-wheat.vercel.app]
* **Backend API:** [https://rag-backend-53bt.onrender.com]

The application will take some time(~40sec) to start Render due to cold start as the backend is running on free tier.

---

## ✨ Features

* **PDF Document Ingestion:** Upload single PDF documents for instant text extraction and chunking.
* **Vector Search:** Embeds chunks using HuggingFace (`sentence-transformers/all-MiniLM-L6-v2`) and stores vectors in ChromaDB.
* **Context-Aware Q&A:** Queries OpenRouter / LLM endpoints using retrieved context to deliver precise, hallucination-free answers.
* **Modern Interface:** Clean, responsive web frontend.

---

## 🛠️ Tech Stack

### **Frontend**
* Framework: React / HTML / CSS
* Deployment: Vercel

### **Backend**
* Server: Flask + Gunicorn
* RAG Framework: LangChain
* Vector Store: ChromaDB
* Embeddings: HuggingFace Inference API
* LLM Provider: OpenRouter API
* Deployment: Render

---

## 📁 Project Structure

```text
├── frontend/          # React frontend interface
└── backend/           # Flask API, ChromaDB vector store, and LangChain logic