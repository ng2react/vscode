import { search } from '@ng2react/core';
import * as fs from 'fs';
import { startCase } from 'lodash';
import * as path from 'path';
import * as vscode from 'vscode';
import { getSourceRoot } from '../Config';
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
    const componentFileName = componentFile.path.split('/').pop()!;
    const ext = componentFileName.split('.').pop()! === 'ts' ? 'tsx' : 'jsx';
    const componentFileDir = getReactFolder(componentFile);
    const reactElementName = startCase(componentName).replace(/ /g, '');
    const convertedComponentFileName = `${reactElementName}.${ext}`;
    const convertedComponentFilePath = path.join(componentFileDir, convertedComponentFileName);

    if (!fs.existsSync(convertedComponentFilePath)) {
        return [];
    }
    return [{ name: reactElementName, uri: vscode.Uri.file(convertedComponentFilePath), type: 'react' as const }];
}

function getReactFolder(angularFile: vscode.Uri) {
    const angularRoot = getSourceRoot('angular');
    const reactRoot = getSourceRoot('react');

    const angularFileDir = path.dirname(angularFile.path);

    if (!(angularRoot && reactRoot) || angularRoot === reactRoot) {
        return angularFileDir;
    }

    if (!angularFileDir.includes(angularRoot)) {
        return angularFileDir;
    }

    return angularFileDir.replace(angularRoot, reactRoot);
}
