import * as vscode from 'vscode';
import convertToReact, { AngularComponent } from "../lib/angularToReact";
import { search } from '@ng2react/core';
export async function convertToReactCmd(filePath: vscode.Uri | undefined, componentName: string | undefined, context: vscode.ExtensionContext) {
    if (!(filePath && componentName)) {
        vscode.window.showErrorMessage('No component selected');
        return;
    }
    const shortFileName = filePath.path.split('/').pop()!;

    // Open the file if it's not already open
    await vscode.window.showTextDocument(filePath);

    // Ask the user if they wish to proceed
    const response = await vscode.window.showInformationMessage(
        `Convert ${shortFileName} > ${componentName} to React?`,
        'Yes', 'No'
    );

    if (response !== 'Yes') {
        return;
    }
    // Open the file if it's not already open
    const editor = await vscode.window.showTextDocument(filePath);
    const ngComponent = search(editor.document.getText(), { filename: filePath.fsPath })
        .find(c => c.name === componentName);

    if (!ngComponent) {
        vscode.window.showErrorMessage(`Could not find component ${componentName} in ${shortFileName}`);
        return;
    }
    try {
        await convertToReact(ngComponent, context);
    } catch (e) {
        vscode.window.showErrorMessage(
            `Error converting ${shortFileName} > ${ngComponent.name}`,
            { detail: (e as Error).message, modal: true }
        );
    }
}