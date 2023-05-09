import { search } from '@ng2react/core';
import * as fs from 'fs';
import { startCase } from 'lodash';
import * as vscode from 'vscode';
import { getSourceRoot } from '../Config';
export type AngularComponent = ReturnType<typeof search>[0];

export default async function writeToFile(jsx: string, angularName: string, uri: vscode.Uri) {
    const { newFileName, newFilePath } = getNewFilePath(uri, angularName);

    if (fs.existsSync(newFilePath)) {
        const answer = await vscode.window.showWarningMessage(
            `File ${newFileName} already exists. Overwrite?`,
            'Yes',
            'No'
        );
        if (answer !== 'Yes') {
            return;
        }
    }

    fs.writeFileSync(newFilePath, '', 'utf8');
    const newFile = await vscode.workspace.openTextDocument(newFilePath);
    const newEditor = await vscode.window.showTextDocument(newFile);
    const newContent = jsx;
    newEditor.edit((edit) => {
        edit.replace(new vscode.Range(0, 0, newFile.lineCount, 0), newContent);
    });
}

export function toPascalCase(name: string) {
    return startCase(name).replace(/ /g, '');
}

function getNewFilePath(sourceFile: vscode.Uri, angularName: string) {
    const reactName = toPascalCase(angularName);
    const fileExtension = sourceFile.path.endsWith('.ts') ? '.tsx' : '.jsx';
    const newFileName = reactName + fileExtension;

    const angularRoot = getSourceRoot('angular');
    const reactRoot = getSourceRoot('react');

    const newFilePath = sourceFile.path.replace(/[^\/]+$/, newFileName);

    if (!(angularRoot && reactRoot) || angularRoot === reactRoot) {
        return { newFileName, newFilePath };
    }
    if (!newFilePath.includes(angularRoot)) {
        return { newFileName, newFilePath };
    }
    return { newFileName, newFilePath: newFilePath.replace(angularRoot, reactRoot) };
}
