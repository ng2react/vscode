import { search } from '@ng2react/core';
import * as fs from 'fs';
import { startCase } from 'lodash';
import path from 'path';
import * as vscode from 'vscode';
import { getSourceRoot, getTargetLanguage } from '../Config';
export type AngularComponent = ReturnType<typeof search>[0];

export function writeJsx(jsx: string, angularName: string, uri: vscode.Uri) {
    const { newFilePath } = getNewFilePath(uri, angularName);
    const newUri = vscode.Uri.file(newFilePath);
    return writeToFile(newUri, jsx);
}

export function writeMarkdown(markdown: string, angularName: string, uri: vscode.Uri) {
    const { newFilePath } = getNewFilePath(uri, angularName);
    const newUri = vscode.Uri.file(newFilePath + '.md');
    return writeToFile(newUri, markdown);
}

export default async function writeToFile(uri: vscode.Uri, content: string) {
    const filename = uri.path.split('/').pop();
    if (fs.existsSync(uri.fsPath)) {
        const answer = await vscode.window.showWarningMessage(
            `File ${filename} already exists. Overwrite?`,
            'Yes',
            'No'
        );
        if (answer !== 'Yes') {
            return;
        }
    }

    // Create dir if it doesn't exist
    const dir = path.resolve(uri.path.split('/').slice(0, -1).join('/'));
    if (!fs.existsSync(dir)) {
        console.log('Creating dir', dir);
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(uri.fsPath, '', 'utf8');
    const newFile = await vscode.workspace.openTextDocument(uri);
    const newEditor = await vscode.window.showTextDocument(newFile);
    newEditor.edit((edit) => {
        edit.replace(new vscode.Range(0, 0, newFile.lineCount, 0), content);
    });
}

export function toPascalCase(name: string) {
    return startCase(name).replace(/ /g, '');
}

function getNewFilePath(sourceFile: vscode.Uri, angularName: string) {
    const reactName = toPascalCase(angularName);
    const language = getTargetLanguage(sourceFile);
    const fileExtension = language === 'typescript' ? '.tsx' : '.jsx';
    const newFileName = reactName + fileExtension;

    const angularRoot = getSourceRoot('angular');
    const reactRoot = getSourceRoot('react');

    const newFilePath = sourceFile.path.replace(/[^\/]+$/, newFileName);

    if (angularRoot === reactRoot) {
        return { newFileName, newFilePath };
    }
    if (!newFilePath.includes(angularRoot)) {
        return { newFileName, newFilePath };
    }
    if (!fs.existsSync(reactRoot)) {
        fs.mkdirSync(reactRoot, { recursive: true });
    }
    return { newFileName, newFilePath: newFilePath.replace(angularRoot, reactRoot) };
}
