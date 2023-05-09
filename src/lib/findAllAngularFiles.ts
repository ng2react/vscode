import { search } from '@ng2react/core';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { getSourceRoot } from '../Config';

export default async function findAllAngularFiles() {
    const workspaceRoot = getSourceRoot('angular') ?? vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    if (!workspaceRoot) {
        return [];
    }
    const ignore = extractGlobsFromGitignore(workspaceRoot)?.join(',');
    const files = await vscode.workspace.findFiles('**/*.{js,ts}', `{${ignore}}`, 1000);
    return files
        .filter((f) => {
            const content = fs.readFileSync(f.fsPath, 'utf-8');
            return search(content).length > 0;
        })
        .map((f) => ({ name: f.fsPath.split('/').pop()!, uri: f }));
}

function extractGlobsFromGitignore(root: string) {
    const gitignorePath = path.join(root, '.gitignore');
    if (!fs.existsSync(gitignorePath)) {
        return ['**/node_modules/**', '**/bower_components/**', '**/dist/**', '**/out/**'];
    }
    return (
        fs
            .readFileSync(gitignorePath, 'utf8')
            .replaceAll('\r\n', '\n')
            .split('\n')
            .map((l) => l.trim())
            // Remove comments and empty lines
            .filter((l) => !l.startsWith('#') && l !== '')
            // Remove any leading slashes
            .map((l) => l.replace(/^\//, ''))
            // Tech Debt: if the line containes alternatives {a,b,c} then exlude it
            .filter((l) => !(l.includes('{') || l.includes('[')))
            // Add a trailing slash to directories
            .map((l) => (l.endsWith('/') ? l + '**' : l))
    );
}
