import * as  vscode from 'vscode';
import * as fs from 'fs';
import path = require('path');
type IsEnabled = 'yes' | 'no' | 'auto';

export default function isEnabled() {
    const enabled = vscode.workspace.getConfiguration('ng2react').get('enabled') as IsEnabled;
    if (enabled !== 'auto') {
        return enabled === 'yes';
    }
    return isAnglarProject();
}

function isAnglarProject() {
    // Look for a package.json file in the workspace root
    const root = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    if (!root) {
        return false;
    }
    const packageJson = path.join(root, 'package.json');
    if (!fs.existsSync(packageJson)) {
        return false;
    }
    try {
        const {dependencies, peerDependencies, devDependencies} = JSON.parse(fs.readFileSync(packageJson, 'utf-8'));
        const allDependencies = {...dependencies, ...peerDependencies, ...devDependencies};
        if ('angular' in allDependencies) {
            return true;
        }
        if ('@types/angular' in allDependencies) {
            return true;
        }
        return false;
    } catch (e) {
        console.error('Failed to determine whether project is AngularJS', e);
        return false;
    }
}