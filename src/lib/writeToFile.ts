import { search } from "@ng2react/core";
import * as fs from 'fs';
import { startCase } from 'lodash';
import * as vscode from 'vscode';
export type AngularComponent = ReturnType<typeof search>[0];

export default async function writeToFile(jsx: string, ngComponent: AngularComponent) {
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