import * as vscode from 'vscode';
import searchDocument from '../lib/searchDocument';
import { isJavaScript } from '../lib/validation';

export default async function analyseFileCmd(uri: vscode.Uri | undefined) {
	if (!uri) {
		uri = vscode.window.activeTextEditor?.document.uri;
	}
	if (!uri) {
		vscode.window.showInformationMessage('No active text editor');
		return;
	}
	const document = await vscode.workspace.openTextDocument(uri);
	const shortFileName = document.fileName.split('/').pop()!;
	if (!isJavaScript(document)) {
		vscode.window.showInformationMessage(`File ${shortFileName} is not a TypeScript or JavaScript file`);
		return;
	}

	const ngComponents = searchDocument(document);
	if (!ngComponents.length) {
		vscode.window.showInformationMessage(`No components found in ${shortFileName}`);
		return;
	}

	const selectedComponentName = await vscode.window.showQuickPick(
		ngComponents.map(c => c.name)
	);

	if (!selectedComponentName) {
		return;
	}

	vscode.commands.executeCommand('ng2react.convertToReact', uri, selectedComponentName);
}