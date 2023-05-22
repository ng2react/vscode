import * as vscode from 'vscode';

/**
 * Is the document a TypeScript or JavaScript file?
 */
export function isJavaScript(document: vscode.TextDocument) {
    const shortFileName = document.fileName.split('/').pop()!;
    return shortFileName.endsWith('.js') || shortFileName.endsWith('.ts');
}

export function assertJs(document: vscode.TextDocument) {
    if (!isJavaScript(document)) {
        throw new Error(`File ${document.fileName} is not a TypeScript or JavaScript file`);
    }
}

export function isJsx(document: vscode.TextDocument) {
    const shortFileName = document.fileName.split('/').pop()!;
    return shortFileName.endsWith('.jsx') || shortFileName.endsWith('.tsx');
}
