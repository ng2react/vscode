import { convert, search } from "@ng2react/core";
import * as MarkdownIt from 'markdown-it';
import * as vscode from 'vscode';
import writeToFile from "./writeToFile";
import displayMarkdownResult from "./displayMarkdownResult";
export type AngularComponent = ReturnType<typeof search>[0];

let currentConversion = '';

export default async function convertToReact(ngComponent: AngularComponent, context: vscode.ExtensionContext) {
    if (currentConversion) {
        vscode.window.showWarningMessage(`Already converting ${currentConversion}. Please stand by...`);
        return false;
    }
    currentConversion = ngComponent.name;
    vscode.window.showInformationMessage(`Converting ${ngComponent.name}. This could take some time...`);
    const results = await vscode.window.withProgress(
        { cancellable: false, location: vscode.ProgressLocation.Window, title: `Converting ${currentConversion}` },
        async (progress, cancellationToken) => {
            try {
                return await doConversion(ngComponent, progress, cancellationToken);
            } finally {
                currentConversion = '';
            }
        });

    results.forEach(({ markdown, jsx }, index) => {
        displayMarkdownResult(markdown, index, ngComponent)
            .webview.onDidReceiveMessage((message) => {
                if (message.command === 'writeToFile') {
                    writeToFile(jsx, ngComponent);
                }
            }, undefined, context.subscriptions);
    });
    return true;
}

async function doConversion(ngComponent: AngularComponent, progress: vscode.Progress<{ message?: string; increment?: number }>, cancellationToken: vscode.CancellationToken) {
    const { apiKey, model, organisation, temperature } = vscode.workspace.getConfiguration('ng2react.openai');
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
        organization: organisation || undefined,
        temperature
    });
}
