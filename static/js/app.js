const API_BASE = window.location.origin;

const shortenForm = document.getElementById('shorten-form');
const urlInput = document.getElementById('url-input');
const shortenBtn = document.getElementById('shorten-btn');
const resultContainer = document.getElementById('result-container');
const shortUrlInput = document.getElementById('short-url');
const copyBtn = document.getElementById('copy-btn');
const errorMessage = document.getElementById('error-message');
const urlsContainer = document.getElementById('urls-container');
const urlsTable = document.getElementById('urls-table');
const urlsTbody = document.getElementById('urls-tbody');
const loading = document.getElementById('loading');
const noUrls = document.getElementById('no-urls');

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 5000);
}

function hideError() {
    errorMessage.classList.add('hidden');
}

async function shortenUrl(url) {
    try {
        const response = await fetch(`${API_BASE}/api/shorten`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ original_url: url }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to shorten URL');
        }

        const data = await response.json();
        const shortUrl = `${API_BASE}/${data.short_code}`;
        
        shortUrlInput.value = shortUrl;
        resultContainer.classList.remove('hidden');
        hideError();
        
        urlInput.value = '';
        loadUrls();
        
        return data;
    } catch (error) {
        showError(error.message);
        throw error;
    }
}

async function loadUrls() {
    try {
        loading.classList.remove('hidden');
        urlsTable.classList.add('hidden');
        noUrls.classList.add('hidden');

        const response = await fetch(`${API_BASE}/api/urls`);
        if (!response.ok) {
            throw new Error('Failed to load URLs');
        }

        const data = await response.json();
        loading.classList.add('hidden');

        if (data.urls.length === 0) {
            noUrls.classList.remove('hidden');
        } else {
            displayUrls(data.urls);
        }
    } catch (error) {
        loading.classList.add('hidden');
        showError('Failed to load URLs. Please refresh the page.');
        console.error('Error loading URLs:', error);
    }
}

function displayUrls(urls) {
    urlsTbody.innerHTML = '';
    
    urls.forEach(url => {
        const row = document.createElement('tr');
        const shortUrl = `${API_BASE}/${url.short_code}`;
        const createdDate = new Date(url.created_at).toLocaleDateString();
        
        row.innerHTML = `
            <td title="${url.original_url}">${truncateUrl(url.original_url)}</td>
            <td><a href="${shortUrl}" target="_blank">${url.short_code}</a></td>
            <td>${url.view_count}</td>
            <td>${createdDate}</td>
        `;
        
        urlsTbody.appendChild(row);
    });
    
    urlsTable.classList.remove('hidden');
}

function truncateUrl(url) {
    if (url.length > 50) {
        return url.substring(0, 47) + '...';
    }
    return url;
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.background = '#10b981';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
        }, 2000);
    } catch (error) {
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    shortUrlInput.select();
    shortUrlInput.setSelectionRange(0, 99999);
    try {
        document.execCommand('copy');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.background = '#10b981';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
        }, 2000);
    } catch (error) {
        showError('Failed to copy to clipboard');
    }
}

shortenForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();
    
    const url = urlInput.value.trim();
    if (!url) {
        showError('Please enter a URL');
        return;
    }
    
    shortenBtn.disabled = true;
    shortenBtn.textContent = 'Shortening...';
    
    try {
        await shortenUrl(url);
    } catch (error) {
        console.error('Error shortening URL:', error);
    } finally {
        shortenBtn.disabled = false;
        shortenBtn.textContent = 'Shorten URL';
    }
});

copyBtn.addEventListener('click', () => {
    const shortUrl = shortUrlInput.value;
    if (shortUrl) {
        copyToClipboard(shortUrl);
    }
});

loadUrls();




