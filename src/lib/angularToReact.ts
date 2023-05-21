import { convert, search } from '@ng2react/core';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import Config from '../Config';
import displayMarkdownResult, { displayPrompt } from './displayMarkdownResult';
import { getDummyResponse, isSandbox } from './sandboxMode';
import { writeJsx, writeMarkdown } from './writeToFile';
export type AngularComponent = ReturnType<typeof search>[0];
let currentConversion = '';

export default async function convertToReact(uri: vscode.Uri, componentName: string, context: vscode.ExtensionContext) {
    if (currentConversion) {
        vscode.window.showWarningMessage(`Already converting ${currentConversion}. Please stand by...`);
        return false;
    }
    currentConversion = componentName;
    vscode.window.showInformationMessage(`Converting ${componentName}. This could take some time...`);
    const { prompt, results } = await vscode.window.withProgress(
        { cancellable: false, location: vscode.ProgressLocation.Window, title: `Converting ${currentConversion}` },
        async (progress, cancellationToken) => {
            try {
                return await doConversion(uri, componentName, progress, cancellationToken);
            } finally {
                currentConversion = '';
            }
        }
    );

    results.forEach(({ markdown, jsx }, index) => {
        displayMarkdownResult(markdown, index, componentName).webview.onDidReceiveMessage(
            (message: { command: string }) => {
                if (message.command === 'writeJsx') {
                    return writeJsx(jsx, componentName, uri);
                }
                if (message.command === 'writeMarkdown') {
                    return writeMarkdown(markdown, componentName, uri);
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

async function doConversion(
    uri: vscode.Uri,
    componentName: string,
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
    const customPrompt = getCustomPrompt();
    progress.report({ message: `Querying ${model}`, increment: 10 });
    return convert(content, {
        // TODO: way to get updates from this
        file: uri.fsPath,
        componentName,
        apiKey,
        model,
        organization: organisation || undefined,
        temperature,
        sourceRoot: getSourceRout(),
        customPrompt,
    });
}

function getSourceRout() {
    const sourceRoot = Config.get('source.angularRoot');
    if (!sourceRoot) {
        return undefined;
    }
    const absoluteSourceRoot = path.join(vscode.workspace.workspaceFolders![0].uri.fsPath, sourceRoot);
    if (!fs.existsSync(absoluteSourceRoot)) {
        vscode.window.showWarningMessage(`Source root ${sourceRoot} does not exist`);
        return undefined;
    }
    return absoluteSourceRoot;
}

function getCustomPrompt() {
    if (!Config.get('customPrompt.enabled')) {
        return undefined;
    }
    const customPromptPath = Config.get('customPrompt.location');
    if (!customPromptPath) {
        return undefined;
    }
    const absoluteCustomPromptPath = path.join(
        vscode.workspace.workspaceFolders![0].uri.fsPath,
        customPromptPath,
        'patterns.ng2r.md'
    );
    if (!fs.existsSync(absoluteCustomPromptPath)) {
        vscode.window.showInformationMessage(`Custom prompt ${customPromptPath} does not exist`);
        return undefined;
    }
    return fs.readFileSync(absoluteCustomPromptPath, 'utf8');
}
