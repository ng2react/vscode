import { convert, search } from "@ng2react/core";
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as MarkdownIt from 'markdown-it';
import { startCase } from 'lodash';
export type AngularComponent = ReturnType<typeof search>[0];

let currentConversion = '';

export default function convertToReact(ngComponent: AngularComponent, context: vscode.ExtensionContext) {
    if (currentConversion) {
        vscode.window.showWarningMessage(`Already converting ${currentConversion}. Please stand by...`);
        return Promise.resolve(false);
    }
    currentConversion = ngComponent.name;
    return vscode.window.withProgress(
        { cancellable: true, location: vscode.ProgressLocation.Window, title: `Converting ${currentConversion}` },
        async (progress, cancellationToken) => {
            try {
                vscode.window.showInformationMessage(`Converting ${ngComponent.name}. This could take some time...`);
                const results = await doConversion(ngComponent, progress, cancellationToken);
                results.forEach((result, index) => {
                    displayMarkdownResult({ ...result, index }, ngComponent, context);
                });
                return true;
            } finally {
                currentConversion = '';
            }
        });
}

async function doConversion(ngComponent: AngularComponent, progress: vscode.Progress<{ message?: string; increment?: number }>, cancellationToken: vscode.CancellationToken) {
    const { apiKey, model, organisation } = vscode.workspace.getConfiguration('ng2react.openai');
    if (typeof apiKey !== 'string') {
        throw Error('Conversion failed: OpenAI API key is not set');
    }
    if (cancellationToken.isCancellationRequested) {
        return [];
    }
    progress.report({ message: `Querying ${model}`, increment: 10 });
    return convert(ngComponent, { // TODO: way to get updates from this
        apiKey,
        model,
        organization: organisation || undefined
    });
}


function displayMarkdownResult({ markdown, jsx, index }: { markdown: string, jsx: string, index: number }, ngComponent: AngularComponent, context: vscode.ExtensionContext) {

    const panel = vscode.window.createWebviewPanel(
        `ng2react`,
        `ng2react: ${ngComponent.name}`,
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    // Set the webview content to the rendered Markdown
    panel.webview.html = getHtml(`${ngComponent.name} - Option ${index + 1}`, markdown);

    panel.webview.onDidReceiveMessage((message) => {
        if (message.command === 'writeToFile') {
            writeToFile(jsx, ngComponent);
        }
    },
        undefined,
        context.subscriptions);
}


async function writeToFile(jsx: string, ngComponent: AngularComponent) {
    const { fileName } = ngComponent.node.getSourceFile();
    const componentName = toPascalCase(ngComponent.name);
    const fileExtension = fileName.endsWith('.ts') ? '.tsx' : '.jsx';
    const newFileName = componentName + fileExtension;
    const newFilePath = fileName.replace(/[^\/]+$/, newFileName);

    fs.writeFileSync(newFilePath, '', 'utf8');
    const newFile = await vscode.workspace.openTextDocument(newFilePath);
    const newEditor = await vscode.window.showTextDocument(newFile);
    const newContent = jsx;
    newEditor.edit(edit => {
        edit.replace(new vscode.Range(0, 0, newFile.lineCount, 0), newContent);
    });
}

function toPascalCase(name: string) {
    return startCase(name).replace(/ /g, '');
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
<button class="write-to-file-button">Write to file</button>
<h1>${title}</h1>
<article class="markdown-body">
${renderedMarkdown}
</article>
<button class="write-to-file-button">Write to file</button>
<script>
(() => {
    const vscode = acquireVsCodeApi();
    for (const btn of document.querySelectorAll('.write-to-file-button')) {
        btn.addEventListener('click', () => vscode.postMessage({
            command: 'writeToFile'
        }));
    }
})();
</script>
</body>
</html>
  `;
}