import { getDefaultRules } from '@ng2react/core';
import * as fs from 'fs';
import * as vscode from 'vscode';
import Config from '../Config';
export default async function initCustomPrompt(source = Config.get('customPrompt.location')) {
    if (!source) {
        throw Error('No source folder selected');
    }

    Config.set('customPrompt.location', source, vscode.ConfigurationTarget.Workspace);
    if (!Config.get('customPrompt.enabled')) {
        await Config.set('customPrompt.enabled', true, vscode.ConfigurationTarget.Workspace);
    }

    const uri = vscode.Uri.file(vscode.workspace.workspaceFolders![0].uri.fsPath + '/' + source);
    // If the uri doesn't exist, create it
    if (!fs.existsSync(uri.fsPath)) {
        fs.mkdirSync(uri.fsPath, { recursive: true });
    }
    if (!fs.lstatSync(uri.fsPath).isDirectory()) {
        throw Error(`${uri.fsPath} is not a directory`);
    }
    const defaultFile = vscode.Uri.file(uri.path + '/patterns.ng2r.md');
    if (!fs.existsSync(defaultFile.fsPath)) {
        fs.writeFileSync(defaultFile.fsPath, getDefaultRules(), 'utf8');
    }

    // Open the file
    const file = await vscode.workspace.openTextDocument(defaultFile);
    vscode.window.showTextDocument(file);
}
