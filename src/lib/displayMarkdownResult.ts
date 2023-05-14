import { search } from '@ng2react/core';
import MarkdownIt from 'markdown-it';
import * as vscode from 'vscode';
export type AngularComponent = ReturnType<typeof search>[0];

export default function displayMarkdownResult(markdown: string, index: number, componentName: string) {
    const panel = vscode.window.createWebviewPanel(`ng2react`, `ng2react: ${componentName}`, vscode.ViewColumn.Beside, {
        enableScripts: true,
        retainContextWhenHidden: true,
    });

    // Set the webview content to the rendered Markdown
    panel.webview.html = getHtml(`${componentName} - Option ${index + 1}`, markdown);

    return panel;
}

function getHtml(title: string, markdown: string) {
    // Initialize the markdown-it parser
    const md = new MarkdownIt();

    // Parse the content and convert it to HTML
    const renderedMarkdown = md.render(markdown);
    return `<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AngularJS to React Conversion</title>
</head>
<body>
<button class="write-jsx-button">Save as JSX</button>
<button class="write-markdown-button">Save as Markdown</button>
<h1>${title}</h1>
<article class="markdown-body">
${renderedMarkdown}
</article>
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
})();
</script>
</body>
</html>
  `;
}
