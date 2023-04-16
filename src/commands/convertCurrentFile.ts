import * as vscode from 'vscode';
import { createAst, findComponents } from "@ng2react/core";

export default function convertCurrentFile() {
	if (!vscode.window.activeTextEditor) {
		vscode.window.showInformationMessage('No active text editor');
		return;
	}
	const { document } = vscode.window.activeTextEditor;
	const shortFileName = document.fileName.split('/').pop()!;
	if (!(shortFileName.endsWith('.js') || shortFileName.endsWith('.ts'))) {
		vscode.window.showInformationMessage(`File ${shortFileName} is not a TypeScript or JavaScript file`);
		return;
	}

	try {
		const ast = createAst(document.fileName, document.getText());
		const ngComponents = findComponents(ast);
		if (!ngComponents.length) {
			vscode.window.showInformationMessage(`No components found in ${shortFileName}`);
			return;
		}

		vscode.window.showQuickPick([
			...ngComponents.map(c => c.name)
		])
			.then((selectedComponent) => {
				if (!selectedComponent) {
					return;
				}
				vscode.window.showInformationMessage(`Selected component: ${selectedComponent}`);
			});
	} catch (e) {
		vscode.window.showErrorMessage(`Error while searching for components in ${shortFileName}: ${(e as Error).message}`);
	}
}