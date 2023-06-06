import { checkConnection } from '@ng2react/core';
import * as vscode from 'vscode';
import Config from '../Config';

export default async function checkConnectionCmd() {
    const apiKey = Config.get('openai.apiKey');
    if (!apiKey) {
        vscode.window.showErrorMessage('No OpenAI API key set');
        return;
    }
    await vscode.window.withProgress(
        { cancellable: false, location: vscode.ProgressLocation.Window, title: 'Checking connection to OpenAI...' },
        async () => {
            try {
                const response = await checkConnection({ apiKey });
                console.info(`GPT Response: "${response}"`);
                vscode.window.showInformationMessage('Connection to OpenAI API successful!');
            } catch (e) {
                console.error(e);
                vscode.window.showErrorMessage(`Error connecting to OpenAI API`, {
                    detail: (e as Error).message,
                    modal: true,
                });
            }
        }
    );
}
