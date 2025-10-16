const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Rate limiting (in-memory, simple implementation)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // 5 exports per hour

// Allowed domains (security whitelist)
const ALLOWED_DOMAINS = [
    'chatgpt.com',
    'chat.openai.com',
    'claude.ai',
    'perplexity.ai'
];

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Export endpoint
app.post('/api/export', async (req, res) => {
    const { url, format } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress;

    // Rate limiting check
    const now = Date.now();
    const userRequests = rateLimitMap.get(clientIp) || [];
    const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);

    if (recentRequests.length >= RATE_LIMIT_MAX) {
        return res.status(429).json({
            error: 'Rate limit exceeded',
            message: `You can only export ${RATE_LIMIT_MAX} conversations per hour. Please try again later.`
        });
    }

    // Update rate limit
    recentRequests.push(now);
    rateLimitMap.set(clientIp, recentRequests);

    // Clean up old entries (prevent memory leak)
    if (rateLimitMap.size > 10000) {
        const entries = Array.from(rateLimitMap.entries());
        rateLimitMap.clear();
        entries.slice(-5000).forEach(([ip, times]) => rateLimitMap.set(ip, times));
    }

    // Validate URL presence
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL length
    if (url.length > 500) {
        return res.status(400).json({ error: 'URL too long' });
    }

    // Validate URL format (must be valid URL)
    let parsedUrl;
    try {
        parsedUrl = new URL(url);
    } catch (e) {
        return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Validate domain whitelist
    const isAllowed = ALLOWED_DOMAINS.some(domain => parsedUrl.hostname.includes(domain));
    if (!isAllowed) {
        return res.status(400).json({
            error: 'Unsupported platform',
            message: `Currently supported: ChatGPT, Claude, Perplexity. Domain: ${parsedUrl.hostname} is not supported.`
        });
    }

    let browser;
    try {
        console.log('Launching browser...');
        browser = await puppeteer.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        console.log('Navigating to ChatGPT conversation...');
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // Wait for conversation to load
        await page.waitForSelector('[data-testid^="conversation-turn-"]', { timeout: 30000 });

        // Give it extra time to fully render
        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log('Extracting conversation...');
        const conversation = await page.evaluate(() => {
            const turns = document.querySelectorAll('[data-testid^="conversation-turn-"]');
            const messages = [];

            turns.forEach(turn => {
                const role = turn.querySelector('[data-message-author-role]')?.getAttribute('data-message-author-role') || 'unknown';
                const contentEl = turn.querySelector('.markdown, [class*="prose"]') || turn;
                const text = contentEl.innerText || contentEl.textContent;

                messages.push({
                    role: role,
                    content: text.trim()
                });
            });

            return messages;
        });

        console.log(`Extracted ${conversation.length} messages`);

        if (conversation.length === 0) {
            return res.status(500).json({ error: 'No messages found in conversation' });
        }

        // Format conversation based on requested format
        let output = '';
        let contentType = 'text/plain';
        let filename = `chatgpt-export-${Date.now()}`;
        let pdfBuffer = null;

        if (format === 'pdf') {
            // PDF format - use Puppeteer to generate
            const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            line-height: 1.6;
            color: #1a1a1a;
        }
        h1 {
            font-size: 24px;
            margin-bottom: 20px;
            border-bottom: 2px solid #e5e5e5;
            padding-bottom: 10px;
        }
        .meta {
            font-size: 12px;
            color: #666;
            margin-bottom: 30px;
        }
        .message {
            margin-bottom: 30px;
            padding: 15px;
            border-radius: 8px;
        }
        .user {
            background: #f3f4f6;
        }
        .assistant {
            background: #ffffff;
            border: 1px solid #e5e5e5;
        }
        .speaker {
            font-weight: 600;
            margin-bottom: 10px;
            font-size: 14px;
        }
        .content {
            white-space: pre-wrap;
            font-size: 13px;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e5e5;
            text-align: center;
            font-size: 11px;
            color: #999;
        }
    </style>
</head>
<body>
    <h1>ChatGPT Conversation Export</h1>
    <div class="meta">
        <div>Exported: ${new Date().toISOString()}</div>
        <div>URL: ${url}</div>
        <div>Messages: ${conversation.length}</div>
    </div>
    ${conversation.map(msg => `
        <div class="message ${msg.role}">
            <div class="speaker">${msg.role === 'user' ? 'User' : 'Assistant'}</div>
            <div class="content">${msg.content}</div>
        </div>
    `).join('')}
    <div class="footer">
        Exported with SaveMyChat.com
    </div>
</body>
</html>`;

            const pdfPage = await browser.newPage();
            await pdfPage.setContent(htmlContent);
            pdfBuffer = await pdfPage.pdf({
                format: 'A4',
                margin: {
                    top: '20mm',
                    right: '15mm',
                    bottom: '20mm',
                    left: '15mm'
                },
                printBackground: true
            });
            await pdfPage.close();

            filename += '.pdf';
            contentType = 'application/pdf';

            // Send PDF as base64
            res.json({
                success: true,
                content: pdfBuffer.toString('base64'),
                filename: filename,
                messageCount: conversation.length,
                isPdf: true
            });
            return;

        } else if (format === 'txt') {
            // Plain text format
            output = `ChatGPT Conversation Export\n`;
            output += `Exported: ${new Date().toISOString()}\n`;
            output += `URL: ${url}\n`;
            output += `\n${'='.repeat(80)}\n\n`;

            conversation.forEach((msg) => {
                const speaker = msg.role === 'user' ? 'User' : 'Assistant';
                output += `${speaker}:\n\n${msg.content}\n\n${'-'.repeat(80)}\n\n`;
            });
            filename += '.txt';
        } else {
            // Markdown format (default)
            output = '# ChatGPT Conversation Export\n\n';
            output += `**Exported:** ${new Date().toISOString()}\n`;
            output += `**URL:** ${url}\n\n`;
            output += '---\n\n';

            conversation.forEach((msg) => {
                const speaker = msg.role === 'user' ? '**User:**' : '**Assistant:**';
                output += `${speaker}\n\n${msg.content}\n\n---\n\n`;
            });
            contentType = 'text/markdown';
            filename += '.md';
        }

        res.json({
            success: true,
            content: output,
            filename: filename,
            messageCount: conversation.length
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Failed to export conversation',
            details: error.message 
        });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`\n🚀 SaveMyChat running at http://localhost:${PORT}`);
    console.log(`   Export AI conversations to PDF, Markdown & TXT\n`);
});
