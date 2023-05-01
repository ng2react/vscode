import * as vscode from 'vscode';
import { search, convert } from "@ng2react/core";
import { startCase } from 'lodash';
import * as fs from 'fs';
import * as MarkdownIt from 'markdown-it';

type AngularComponent = ReturnType<typeof search>[0];

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


	async function convertComponents(document: vscode.TextDocument) {
		const shortFileName = document.fileName.split('/').pop()!;
		try {
			const ngComponents = search(document.getText(), { filename: document.fileName });
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
			const selectedComponent = ngComponents.find(c => c.name === selectedComponentName)!;
			await convertComponent(selectedComponent);
		} catch (e) {
			vscode.window.showErrorMessage(`Error while searching for components in ${shortFileName}: ${(e as Error).message}`);
		}

	}

	async function convertComponent(component: AngularComponent) {

		const {apiKey, model, organization} = vscode.workspace.getConfiguration('ng2react.openai');
		
		if (typeof apiKey !== 'string') {
			vscode.window.showErrorMessage('OpenAI API key is not set');
			return;
		}
	
		const { markdown, jsx } = (await convert(component, {
			apiKey,
			model,
			organization: organization || undefined
		}))[0];

		return displayMarkdownResult(component.name, markdown);

		async function displayMarkdownResult(id: string, content: string) {

			const panel = vscode.window.createWebviewPanel(
				`ng2react`,
				`ng2react: ${id}`,
				vscode.ViewColumn.One,
				{
					enableScripts: true,
					// retainContextWhenHidden: true,
					// localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
				}
			);

			// Set the webview content to the rendered Markdown
			panel.webview.html = getHtml(component.name, content);

			panel.webview.onDidReceiveMessage((message) => {
				if (message.command === 'writeToFile') {
					writeToFile(jsx);
				}
				vscode.window.showInformationMessage(`Received: ${message.text}`);
			},
				undefined,
				context.subscriptions);


			async function writeToFile(content: string) {
				const { fileName } = component.node.getSourceFile();
				const componentName = startCase(component.name);
				const fileExtension = fileName.endsWith('.ts') ? '.tsx' : '.jsx';
				const newFileName = componentName + fileExtension;
				const newFilePath = fileName.replace(/[^\/]+$/, newFileName);

				fs.writeFileSync(newFilePath, '', 'utf8');
				const newFile = await vscode.workspace.openTextDocument(newFilePath);
				const newEditor = await vscode.window.showTextDocument(newFile);
				const newContent = content;
				newEditor.edit(edit => {
					edit.replace(new vscode.Range(0, 0, newFile.lineCount, 0), newContent);
				});
			}

			function getHtml(title: string, markdown: string) {
				// Initialize the markdown-it parser
				const md = new MarkdownIt();

				// Parse the content and convert it to HTML
				const renderedMarkdown = md.render(markdown);
				return `
				<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>AngularJS to React Conversion</title>
	</head>
	<body>
		<button class="write-to-file-button">Write to file</button>
		<h1>${title}</h1>
		<article class="markdown-body">
			${renderedMarkdown}
		</article>
		<button class="write-to-file-button">Write to file</button>
		<script>
			(() => {
				const vscode = acquireVsCodeApi();
				for (const btn of document.querySelectorAll('.write-to-file-button')) {
					btn.addEventListener('click', () => vscode.postMessage({
						command: 'writeToFile'
					}));
				}
			})();
		</script>
	</body>
</html>
			  `;
			}
		}
	}
}