document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('url-input');
    const addUrlBtn = document.getElementById('add-url-btn');
    const urlList = document.getElementById('url-list');
    const ingestUrlsBtn = document.getElementById('ingest-urls-btn');
    const ingestStatus = document.getElementById('ingest-status');
    const questionInput = document.getElementById('question-input');
    const askBtn = document.getElementById('ask-btn');
    const answerContainer = document.getElementById('answer-container');
    const answerContent = document.getElementById('answer-content');
    const questionStatus = document.getElementById('question-status');

    let urls = [];

    addUrlBtn.addEventListener('click', addUrl);
    urlInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addUrl(); });
    ingestUrlsBtn.addEventListener('click', ingestUrls);
    askBtn.addEventListener('click', askQuestion);

    function addUrl() {
        const url = urlInput.value.trim();
        if (!url) return showStatus(ingestStatus, 'Please enter a URL', 'status-error');
        if (!isValidURL(url)) return showStatus(ingestStatus, 'Invalid URL', 'status-error');
        if (urls.includes(url)) return showStatus(ingestStatus, 'URL already added', 'status-error');

        urls.push(url);
        const urlItem = document.createElement('div');
        urlItem.className = 'url-item';
        urlItem.innerHTML = `
            <span class="url-text">${url}</span>
            <button class="remove-url-btn" data-url="${url}">
                <i class="fas fa-times"></i>
            </button>
        `;
        urlList.appendChild(urlItem);
        urlInput.value = '';
        ingestUrlsBtn.disabled = false;
        ingestStatus.textContent = '';
    }

    urlList.addEventListener('click', (e) => {
        const btn = e.target.closest('.remove-url-btn');
        if (btn) {
            const url = btn.getAttribute('data-url');
            urls = urls.filter(u => u !== url);
            urlList.removeChild(btn.parentElement);
            if (urls.length === 0) ingestUrlsBtn.disabled = true;
        }
    });

    async function ingestUrls() {
        if (urls.length === 0) return showStatus(ingestStatus, 'Add at least one URL', 'status-error');
        ingestUrlsBtn.disabled = true;
        showStatus(ingestStatus, '<span class="loading"></span> Ingesting...', 'status-loading');

        try {
            const response = await fetch('/ingest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `urls=${encodeURIComponent(urls.join(','))}`
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || 'Ingestion failed');
            showStatus(ingestStatus, `Ingested ${urls.length} URLs`, 'status-success');
            questionInput.disabled = false;
            askBtn.disabled = false;
        } catch (error) {
            showStatus(ingestStatus, `Error: ${error.message}`, 'status-error');
        } finally {
            ingestUrlsBtn.disabled = false;
        }
    }

    async function askQuestion() {
        const question = questionInput.value.trim();
        if (!question) return showStatus(questionStatus, 'Enter a question', 'status-error');
        askBtn.disabled = true;
        showStatus(questionStatus, '<span class="loading"></span> Generating...', 'status-loading');
        answerContainer.classList.add('hidden');

        try {
            const response = await fetch('/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `question=${encodeURIComponent(question)}`
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || 'Query failed');
            answerContent.textContent = data.answer;
            answerContainer.classList.remove('hidden');
            questionStatus.textContent = '';
        } catch (error) {
            showStatus(questionStatus, `Error: ${error.message}`, 'status-error');
        } finally {
            askBtn.disabled = false;
        }
    }

    function showStatus(element, message, className) {
        element.innerHTML = message;
        element.className = 'status-message ' + (className || '');
    }

    function isValidURL(string) {
        try { new URL(string); return true; } catch (_) { return false; }
    }
});