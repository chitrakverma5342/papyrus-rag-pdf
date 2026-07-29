import warnings
import logging
import os
import chromadb

warnings.filterwarnings("ignore")
logging.getLogger().setLevel(logging.ERROR)

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEndpointEmbeddings
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

CHROMA_DIR = os.getenv("CHROMA_DIR", "/tmp/chroma_db")
os.makedirs(CHROMA_DIR, exist_ok=True)

def get_embedding_model():
    return HuggingFaceEndpointEmbeddings(
        model="sentence-transformers/all-MiniLM-L6-v2",
        huggingfacehub_api_token=os.environ.get("HF_TOKEN")
    )

def index_document(pdf_path):
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(documents)

    if not chunks:
        return "Error: No text could be extracted from this PDF"

    # Using PersistentClient to safely handle SQLite connections
    client = chromadb.PersistentClient(path=CHROMA_DIR)

    try:
        client.delete_collection("pdf_rag")
    except Exception:
        pass  

    # Index new document chunks
    Chroma.from_documents(
        documents=chunks,
        embedding=get_embedding_model(),
        client=client,
        collection_name="pdf_rag"
    )
    return f"Indexed {len(chunks)} chunks successfully"


def ask_question(question):
    client = chromadb.PersistentClient(path=CHROMA_DIR)
    vectorstore = Chroma(
        client=client,
        collection_name="pdf_rag",
        embedding_function=get_embedding_model()
    )

    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
    docs = retriever.invoke(question)
    context = "\n\n".join([doc.page_content for doc in docs])

    prompt = f"""Use the following context to answer the question.

Context:
{context}

Question: {question}

Answer:"""

    llm = ChatOpenAI(
        model_name="nvidia/nemotron-3-super-120b-a12b:free",
        temperature=0,
        base_url="https://openrouter.ai/api/v1",
        default_headers={
            "HTTP-Referer": "http://localhost",
            "X-Title": "My RAG Project"
        }
    )
    response = llm.invoke(prompt)
    return response.content