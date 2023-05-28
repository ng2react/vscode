import * as vscode from 'vscode';
import Config, { getSourceRoot } from '../Config';
import convertToReact from '../lib/angularToReact';
export async function convertToReactCmd(
    filePath: vscode.Uri | undefined,
    componentName: string | undefined,
    context: vscode.ExtensionContext
) {
    if (!(filePath && componentName)) {
        vscode.window.showErrorMessage('No component selected');
        return;
    }
    const shortFileName = filePath.path.split('/').pop()!;

    // Open the file if it's not already open
    await vscode.window.showTextDocument(filePath);

    // Ask the user if they wish to proceed
    const response = await vscode.window.showInformationMessage(`Convert ${componentName} to React?`, 'Yes', 'No');

    if (response !== 'Yes') {
        return;
    }

    if (!filePath.fsPath.includes(getSourceRoot('angular'))) {
        if (
            'Yes' !==
            (await vscode.window.showWarningMessage(
                `${shortFileName} was not found under ${Config.get(
                    'source.angularRoot'
                )}; ths may cause problems. Proceed anyway?`,
                { modal: true },
                'Yes',
                'No'
            ))
        ) {
            return;
        }
    }
    try {
        await convertToReact(filePath, componentName, context);
    } catch (e) {
        vscode.window.showErrorMessage(`Error converting ${componentName} in ${shortFileName}`, {
            detail: (e as Error).message,
            modal: true,
        });
    }
}
