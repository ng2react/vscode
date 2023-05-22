import { generateReactTest } from '@ng2react/core';
import * as vscode from 'vscode';
import Config, { getSourceRoot } from '../Config';
import displayMarkdownResult, { displayPrompt } from '../lib/displayMarkdownResult';
import { getDummyResponse, isSandbox } from '../lib/sandboxMode';
import { isJsx } from '../lib/validation';
import writeToFile from '../lib/writeToFile';
export default async function initCustomPrompt(uri: vscode.Uri | undefined, context: vscode.ExtensionContext) {
    if (!uri) {
        uri = vscode.window.activeTextEditor?.document.uri;
    }
    if (!uri) {
        vscode.window.showInformationMessage('No active text editor');
        return;
    }
    const document = await vscode.workspace.openTextDocument(uri);
    const shortFileName = document.fileName.split('/').pop()!;
    if (!isJsx(document)) {
        vscode.window.showInformationMessage(`File ${shortFileName} is not a JSX or TSX file`);
        return;
    }

    return generateTest(uri, context);
}

let currentTask: string | undefined;
async function generateTest(uri: vscode.Uri, context: vscode.ExtensionContext) {
    if (currentTask) {
        vscode.window.showWarningMessage(`Already converting ${currentTask}. Please stand by...`);
        return false;
    }
    const componentName = uri.path.split('/').pop()!.replace('.tsx', '').replace('.jsx', '');
    const targetLanguage =
        Config.get('targetLanguage') ?? uri.path.split('.').pop()! === 'tsx' ? 'typescript' : 'javascript';
    const ext = targetLanguage.startsWith('t') ? 'tsx' : 'jsx';
    const fileName = `${componentName}${Config.get('source.testSuffix')}.${ext}`;
    currentTask = componentName;
    vscode.window.showInformationMessage(`Generating test ${componentName}. This could take some time...`);
    const { prompt, results } = await vscode.window.withProgress(
        { cancellable: false, location: vscode.ProgressLocation.Window, title: `Generating test for ${currentTask}` },
        async (progress, cancellationToken) => {
            try {
                return await doApiCall(uri, componentName, targetLanguage, progress, cancellationToken);
            } finally {
                currentTask = '';
            }
        }
    );

    results.forEach(({ markdown, jsx }, index) => {
        displayMarkdownResult(markdown, index, componentName).webview.onDidReceiveMessage(
            (message: { command: string }) => {
                if (message.command === 'writeJsx') {
                    const newUri = getNewFilePath(uri, fileName);
                    return writeToFile(newUri, jsx);
                }
                if (message.command === 'writeMarkdown') {
                    const newUri = getNewFilePath(uri, `${fileName}.md`);
                    return writeToFile(newUri, markdown);
                }
                if (message.command === 'showPrompt') {
                    return void displayPrompt(prompt);
                }
                return undefined;
            },
            undefined,
            context.subscriptions
        );
    });
    return true;
}

async function doApiCall(
    uri: vscode.Uri,
    componentName: string,
    targetLanguage: 'typescript' | 'javascript',
    progress: vscode.Progress<{ message?: string; increment?: number }>,
    cancellationToken: vscode.CancellationToken
) {
    const { apiKey, model, organisation, temperature } = Config.get('openai');

    if (isSandbox()) {
        return getDummyResponse(componentName);
    }
    if (typeof apiKey !== 'string') {
        throw Error('Conversion failed: OpenAI API key is not set');
    }
    if (cancellationToken.isCancellationRequested) {
        return { results: [], prompt: '' };
    }

    const content = (await vscode.window.showTextDocument(uri)).document.getText();
    progress.report({ message: `Querying ${model}`, increment: 10 });
    return generateReactTest(content, {
        apiKey,
        model,
        organization: organisation || undefined,
        temperature,
        targetLanguage,
    });
}

function getNewFilePath(sourceFile: vscode.Uri, newFileName: string) {
    const newFilePath = vscode.Uri.file(sourceFile.path.replace(/[^\/]+$/, newFileName));
    const reactRoot = getSourceRoot('react');
    const testRoot = getSourceRoot('test');
    if (!(testRoot && reactRoot)) {
        return newFilePath;
    }
    if (reactRoot === testRoot) {
        return newFilePath;
    }

    const testFilePath = newFilePath.fsPath.replace(reactRoot, testRoot);
    return vscode.Uri.file(testFilePath);
}
