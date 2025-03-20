from fastapi import FastAPI, Form, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
import requests
from bs4 import BeautifulSoup
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import os
from dotenv import load_dotenv

load_dotenv()
app = FastAPI(title="Web Content Q&A Tool")
app.mount("/static", StaticFiles(directory="static"), name="static")

vector_store = None

@app.get("/", response_class=HTMLResponse)
async def get_root():
    """Serve the UI."""
    with open("static/index.html", "r") as f:
        return f.read()

@app.post("/ingest")
async def ingest_urls(urls: str = Form(...)):
    """Ingest URLs and build vector store."""
    global vector_store
    urls_list = [url.strip() for url in urls.split(",") if url.strip()]
    if not urls_list:
        raise HTTPException(status_code=400, detail="No valid URLs provided")
    
    all_text = ""
    for url in urls_list:
        try:
            response = requests.get(url, timeout=5)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, "html.parser")
            for unwanted in soup(['script', 'style', 'header', 'footer', 'nav']):
                unwanted.decompose()
            paragraphs = soup.find_all("p")
            all_text += " ".join(p.get_text() for p in paragraphs) + " "
        except requests.RequestException as e:
            all_text += f"Error scraping {url}: {str(e)} "

    if not all_text.strip():
        raise HTTPException(status_code=400, detail="No content scraped")

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_text(all_text)
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vector_store = FAISS.from_texts(chunks, embeddings)
    return {"message": "Content ingested successfully", "content": all_text[:500] + "..."}

@app.post("/query")
async def query_content(question: str = Form(...)):
    """Answer question strictly from ingested content."""
    global vector_store
    if not vector_store:
        raise HTTPException(status_code=400, detail="Please ingest URLs first")
    if not question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")

    # Retrieve relevant chunks
    docs = vector_store.similarity_search(question, k=5)
    if not docs:
        return {"answer": "No relevant answer found"}
    
    context = " ".join(doc.page_content for doc in docs)

    # Custom prompt to enforce context-only answers
    prompt_template = PromptTemplate(
        input_variables=["context", "question"],
        template="""
        Answer the question based ONLY on the provided context. Do not use external knowledge.
        If the answer isn't in the context, say "No relevant answer found".
        Context: {context}
        Question: {question}
        Answer:
        """
    )
    
    llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0, openai_api_key=api_key)
    qa_chain = LLMChain(llm=llm, prompt=prompt_template)
    result = qa_chain({"context": context, "question": question})
    return {"answer": result["text"].strip()}