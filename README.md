# Web Content Q&A Tool

A web-based application that ingests content from URLs and answers questions based solely on that content, built for AiSensy's assessment. It uses FastAPI, OpenAI-powered RAG, and a modern UI to provide accurate, context-specific responses.

## Features
- **URL Ingestion**: Scrapes and processes content from user-provided URLs.
- **Question Answering**: Answers questions using only the ingested content, powered by OpenAI’s GPT-3.5-turbo with a custom prompt to prevent external knowledge use.
- **Advanced UI**: Responsive design with dynamic URL management and real-time feedback.
- **Vector Search**: Uses FAISS and sentence-transformers for efficient content retrieval.

## Tech Stack
- **Backend**: FastAPI (Python)
- **Frontend**: HTML, CSS, JavaScript
- **Content Processing**: BeautifulSoup4, LangChain
- **Embeddings**: HuggingFace `sentence-transformers/all-MiniLM-L6-v2`
- **LLM**: OpenAI `gpt-3.5-turbo`
- **Vector Store**: FAISS
- **Deployment**: Render

## Prerequisites
- Python 3.8+
- OpenAI API Key (from [platform.openai.com](https://platform.openai.com))
- Git

## Setup Instructions




### Local Development
1. **Clone the Repository**:


Install Dependencies:
bash

pip install -r requirements.txt

Set Environment Variables:
Create a .env file in the root directory:
txt

OPENAI_API_KEY=your-openai-api-key-here

Run the Application:
bash

uvicorn main:app --reload

Open http://127.0.0.1:8000 in your browser.


   ```bash
   git clone https://github.com/aryanjp1/web-qa-tool.git
   cd web-qa-tool
