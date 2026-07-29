import warnings
import logging
warnings.filterwarnings("ignore")
logging.getLogger().setLevel(logging.ERROR)

from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os

load_dotenv()

# Load ChromaDB
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vectorstore = Chroma(
    persist_directory="./chroma_db",
    embedding_function=embedding_model
)

# Set up retriever
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# Set up LLM (OpenRouter)
llm = ChatOpenAI(
    model_name="nvidia/nemotron-3-super-120b-a12b:free",
    temperature=0,
    base_url="https://openrouter.ai/api/v1",
    default_headers={
        "HTTP-Referer": "http://localhost",
        "X-Title": "My RAG Project"
    }
)

# Ask a question
query = input("Ask anything about the pdf...")

# Retrieve relevant chunks
docs = retriever.invoke(query)

result = []
for doc in docs:
    result.append(doc.page_content)

context = "\n\n".join(result)
# Build prompt manually
prompt = f"""Use the following context to answer the question.

Context:
{context}

Question: {query}

Answer:"""

# Get answer from LLM
response = llm.invoke(prompt)
print("\nQuestion: ",query)
print("Answer:", response.content)
