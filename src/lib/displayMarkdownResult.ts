import { search } from '@ng2react/core';
import MarkdownIt from 'markdown-it';
import hljs from 'markdown-it-highlightjs';
import * as vscode from 'vscode';
export type AngularComponent = ReturnType<typeof search>[0];

export default function displayMarkdownResult(markdown: string, index: number, componentName: string) {
    const panel = vscode.window.createWebviewPanel(`ng2react`, `ng2react: ${componentName}`, vscode.ViewColumn.Beside, {
        enableScripts: true,
        retainContextWhenHidden: true,
    });

    // Set the webview content to the rendered Markdown
    panel.webview.html = getResultHtml(`${componentName} - Option ${index + 1}`, markdown);

    return panel;
}

export function displayPrompt(markdown: string) {
    const panel = vscode.window.createWebviewPanel(`ng2react`, `ng2react: Prompt`, vscode.ViewColumn.Beside, {
        enableScripts: false,
        retainContextWhenHidden: true,
    });

    // Set the webview content to the rendered Markdown
    panel.webview.html = gethtml(getMarkdownHtml(markdown), { title: 'Prompt' });

    return panel;
}

function getResultHtml(title: string, markdown: string) {
    return gethtml(
        `<button class="write-jsx-button">Save as JSX</button>
<button class="write-markdown-button">Save as Markdown</button>
<button class="show-prompt-button">Show prompt</button>
<h1>${title}</h1>
${getMarkdownHtml(markdown)}
<button class="write-to-file-button">Write to file</button>
<script>
(() => {
    const vscode = acquireVsCodeApi();
    for (const btn of document.querySelectorAll('.write-jsx-button')) {
        btn.addEventListener('click', () => vscode.postMessage({
            command: 'writeJsx'
        }));
    }

    for (const btn of document.querySelectorAll('.write-markdown-button')) {
        btn.addEventListener('click', () => vscode.postMessage({
            command: 'writeMarkdown'
        }));
    }

    for (const btn of document.querySelectorAll('.show-prompt-button')) {
        btn.addEventListener('click', () => vscode.postMessage({
            command: 'showPrompt'
        }));
    }
})();
</script>`,
        { title }
    );
}

function getMarkdownHtml(markdown: string) {
    const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
    }).use(hljs, { inline: true });

    // Parse the content and convert it to HTML
    const renderedMarkdown = md.render(markdown);
    return `<article class="markdown-body">${renderedMarkdown}</article>`;
}

function gethtml(html: string, { title = '' }) {
    return `<html lang="en">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/a11y-dark.min.css" integrity="sha512-Vj6gPCk8EZlqnoveEyuGyYaWZ1+jyjMPg8g4shwyyNlRQl6d3L9At02ZHQr5K6s5duZl/+YKMnM3/8pDhoUphg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
</head>
<body>
${html}
</body>
</html>
  `;
}
