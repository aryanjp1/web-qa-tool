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
# Web Content Q&A Tool

A web-based tool that allows users to ingest content from URLs and ask questions about that content. The tool provides concise, accurate answers based solely on the information from the provided URLs.

## Features

- URL content ingestion
- Question answering based on ingested content
- Clean, responsive UI
- Source attribution for answers


## Setup Instructions

### Prerequisites

- Python 3.8+
- OpenAI API key

### Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/web-qa-tool.git
   cd web-qa-tool
   ```

2. Create a virtual environment:
   ```bash
   # Using conda
   conda create -n web-qa-env python=3.9
   conda activate web-qa-env
   
   # Or using venv
   python -m venv web-qa-env
   source web-qa-env/bin/activate  # On Windows: web-qa-env\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the project root and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. Run the application:
   ```bash
   uvicorn main:app --reload
   ```

6. Open your browser and navigate to [http://localhost:8000](http://localhost:8000)

## Usage

1. **Add URLs**: Enter URLs in the input field and click "Add"
2. **Ingest Content**: Click "Ingest URLs" to process the content
3. **Ask Questions**: Enter a question about the content and click "Get Answer"
4. **View Answer**: See the answer and its sources below

## Project Structure

```
web-qa-tool/
├── main.py              # FastAPI application
├── static/              # Frontend files
│   ├── index.html       # Main HTML template
│   ├── style.css        # CSS styling
│   └── script.js        # Frontend JavaScript
├── requirements.txt     # Python dependencies
├── Procfile             # For deployment
└── README.md            # Project documentation
```

## Deployment

The application can be deployed to platforms like Heroku, Render, or Fly.io. The included Procfile is configured for these platforms.

## Note for Assessment

This project was created as part of the AI Developer assessment for AiSensy. The application focuses on providing a user-friendly interface for content-based question answering without relying on general knowledge.

## License

MIT





   cd web-qa-tool
