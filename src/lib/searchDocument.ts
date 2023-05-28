import { search } from '@ng2react/core';
import * as fs from 'fs';
import { startCase } from 'lodash';
import * as path from 'path';
import * as vscode from 'vscode';
import Config, { getSourceRoot } from '../Config';
import { assertJs } from './validation';
export default function searchDocument(document: vscode.TextDocument) {
    assertJs(document);
    return search(document.getText(), { file: document.fileName });
}

/**
 * Looks for tsx/jsx file in the same directory as the component file.
 * If it exists, returns the path to the tsx file.
 *
 * Expects the tsx/jsx file name to be in the format: PascalCaseComponentName.tsx
 *
 * @param componentFile path to the component file
 * @param componentName name of angular component
 */
export function findExistingConversions(componentFile: vscode.Uri, componentName: string) {
    const componentFileDir = getFolder(componentFile, 'react');
    const reactElementName = startCase(componentName).replace(/ /g, '');
    const convertedComponentFiles = ['jsx', 'tsx', 'jsx.md', 'tsx.md'].map((ext) => ({
        name: `${reactElementName}.${ext}`,
        uri: vscode.Uri.file(path.join(componentFileDir, `${reactElementName}.${ext}`)),
        type: 'react' as const,
    }));

    return convertedComponentFiles.filter(({ uri }) => fs.existsSync(uri.fsPath));
}

export function findExistingTests(componentFile: vscode.Uri, componentName: string) {
    const componentFileDir = getFolder(componentFile, 'test');
    const reactElementName = startCase(componentName).replace(/ /g, '');
    const testSuffix = Config.get('source.testSuffix');
    const testFiles = ['jsx', 'tsx', 'jsx.md', 'tsx.md'].map((ext) => {
        const name = `${reactElementName}${testSuffix}.${ext}`;
        return { name, uri: vscode.Uri.file(path.join(componentFileDir, name)), type: 'test' as const };
    });

    return testFiles.filter(({ uri }) => fs.existsSync(uri.fsPath));
}

function getFolder(angularFile: vscode.Uri, folderName: 'react' | 'test') {
    const angularRoot = getSourceRoot('angular');
    const folderRoot = getSourceRoot(folderName);

    const angularFileDir = path.dirname(angularFile.path);

    if (angularRoot === folderRoot) {
        return angularFileDir;
    }

    if (!angularFileDir.includes(angularRoot)) {
        return angularFileDir;
    }

    return angularFileDir.replace(angularRoot, folderRoot);
}
