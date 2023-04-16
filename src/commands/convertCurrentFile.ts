import * as vscode from 'vscode';
import { createAst, findComponents, AngularComponent } from "@ng2react/core";
import { startCase } from 'lodash';
import * as fs from 'fs';
export default function convertCurrentFile(context: vscode.ExtensionContext) {
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
	return convertComponents(document);
}

async function convertComponents(document: vscode.TextDocument) {
	const shortFileName = document.fileName.split('/').pop()!;
	try {
		const ast = createAst(document.fileName, document.getText());
		const ngComponents = findComponents(ast);
		if (!ngComponents.length) {
			vscode.window.showInformationMessage(`No components found in ${shortFileName}`);
			return;
		}

		const selectedComponentName = await vscode.window.showQuickPick([
			...ngComponents.map(c => c.name)
		]);
		if (!selectedComponentName) {
			return;
		}
		const selectedComponent = ngComponents.find(c => c.name === selectedComponentName)!;
		await convertComponent(selectedComponent);
	} catch (e) {
		vscode.window.showErrorMessage(`Error while searching for components in ${shortFileName}: ${(e as Error).message}`);
	}

}

async function convertComponent(component: AngularComponent) {
	const { fileName } = component.node.getSourceFile();
	const componentName = startCase(component.name);
	const fileExtension = fileName.endsWith('.ts') ? '.tsx' : '.jsx';
	const newFileName = componentName + fileExtension;
	const newFilePath = fileName.replace(/[^\/]+$/, newFileName);

	fs.writeFileSync(newFilePath, '', 'utf8');
	const newFile = await vscode.workspace.openTextDocument(newFilePath);
	const newEditor = await vscode.window.showTextDocument(newFile);
	const newContent = `import React from 'react';\n\nconst ${componentName} = () => (<>TODO</>););`;
	newEditor.edit(edit => {
		edit.replace(new vscode.Range(0, 0, newFile.lineCount, 0), newContent);
	});

}