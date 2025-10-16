const puppeteer = require('puppeteer');
const fs = require('fs');

async function exportChatGPTConversation(url) {
    const browser = await puppeteer.launch({ headless: false });
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

    // Format as markdown
    let markdown = '# ChatGPT Conversation Export\n\n';
    markdown += `**Exported:** ${new Date().toISOString()}\n`;
    markdown += `**URL:** ${url}\n\n`;
    markdown += '---\n\n';

    conversation.forEach((msg, idx) => {
        const speaker = msg.role === 'user' ? '**User:**' : '**Assistant:**';
        markdown += `${speaker}\n\n${msg.content}\n\n---\n\n`;
    });

    const filename = `chatgpt-export-${Date.now()}.md`;
    fs.writeFileSync(filename, markdown);

    console.log(`Saved to: ${filename}`);

    await browser.close();
    return filename;
}

// Run the export
const url = 'https://chatgpt.com/share/68eea646-9ad0-8011-b3cd-6d75dc4967ae';
exportChatGPTConversation(url)
    .then(filename => console.log('Export complete!'))
    .catch(err => console.error('Error:', err));
