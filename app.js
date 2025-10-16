const urlInput = document.getElementById('url-input');
const exportBtn = document.getElementById('export-btn');
const downloadBtn = document.getElementById('download-btn');
const statusDiv = document.getElementById('status');
const resultDiv = document.getElementById('result');
const messageCountSpan = document.getElementById('message-count');
const fileSizeSpan = document.getElementById('file-size');

let exportedData = null;

// Get selected format
function getSelectedFormat() {
    const selected = document.querySelector('input[name="format"]:checked');
    return selected ? selected.value : 'md';
}

// Show status message
function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
}

// Hide status message
function hideStatus() {
    statusDiv.textContent = '';
    statusDiv.className = 'status';
}

// Format file size
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Show result section
function showResult(messageCount, fileSize) {
    messageCountSpan.textContent = messageCount;
    if (fileSize) {
        fileSizeSpan.textContent = formatFileSize(fileSize);
    } else {
        fileSizeSpan.textContent = '-';
    }
    resultDiv.classList.remove('hidden');
}

// Hide result section
function hideResult() {
    resultDiv.classList.add('hidden');
}

// Export conversation
async function exportConversation() {
    const url = urlInput.value.trim();
    
    if (!url) {
        showStatus('Please enter a ChatGPT share URL', 'error');
        return;
    }

    const isValidUrl =
        url.includes('chatgpt.com/share/') ||
        url.includes('chat.openai.com/share/') ||
        url.includes('twitter.com') ||
        url.includes('x.com');

    if (!isValidUrl) {
        showStatus('Please enter a valid share URL (ChatGPT, Claude, Perplexity, or Twitter/X)', 'error');
        return;
    }

    const format = getSelectedFormat();
    
    // Update UI
    exportBtn.disabled = true;
    exportBtn.classList.add('loading');
    hideResult();
    const isTwitter = url.includes('twitter.com') || url.includes('x.com');
    const loadingMsg = isTwitter ? 'Extracting tweets... This may take 30-60 seconds' : 'Extracting conversation... This may take 30-60 seconds';
    showStatus(loadingMsg, 'loading');

    try {
        const response = await fetch('/api/export', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url, format })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Export failed');
        }

        if (data.success) {
            exportedData = {
                content: data.content,
                filename: data.filename,
                isPdf: data.isPdf || false
            };

            const fileSize = exportedData.isPdf 
                ? atob(exportedData.content).length 
                : new Blob([exportedData.content]).size;

            showStatus('Export successful!', 'success');
            showResult(data.messageCount, fileSize);
            
            setTimeout(() => {
                hideStatus();
            }, 3000);
        }

    } catch (error) {
        console.error('Export error:', error);
        showStatus(error.message || 'Failed to export conversation', 'error');
        hideResult();
    } finally {
        exportBtn.disabled = false;
        exportBtn.classList.remove('loading');
    }
}

// Download file
function downloadFile() {
    if (!exportedData) return;

    let blob;
    if (exportedData.isPdf) {
        // Convert base64 to blob for PDF
        const byteCharacters = atob(exportedData.content);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        blob = new Blob([byteArray], { type: 'application/pdf' });
    } else {
        // Text-based formats (MD/TXT)
        blob = new Blob([exportedData.content], {
            type: 'text/plain;charset=utf-8'
        });
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = exportedData.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Event listeners
exportBtn.addEventListener('click', exportConversation);
downloadBtn.addEventListener('click', downloadFile);

// Enter key to export
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        exportConversation();
    }
});

// Clear status when typing
urlInput.addEventListener('input', () => {
    if (statusDiv.classList.contains('error')) {
        hideStatus();
    }
});
