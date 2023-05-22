// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Ng2React } from './commands/CommandName';
import analyseFileCmd from './commands/analyseFile';
import { convertToReactCmd } from './commands/convertToReact';
import generateReactTest from './commands/generateReactTest';
import initCustomPrompt from './commands/initCustomPrompt';
import isEnabled from './lib/isEnabled';
import createNg2ReactTreeView from './views/Ng2ReactTreeView';
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "ng2react" is now active!');

    const updateContext = () => vscode.commands.executeCommand('setContext', 'ng2react.isActive', isEnabled());
    const treeDataProvider = createNg2ReactTreeView();
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(updateContext),
        vscode.commands.registerCommand(Ng2React.analyseFile, (uri) => analyseFileCmd(uri)),
        vscode.commands.registerCommand(Ng2React.convertToReact, (filePath, componentName) =>
            convertToReactCmd(filePath, componentName, context)
        ),
        vscode.commands.registerCommand(Ng2React.refreshTreeView, () => {
            treeDataProvider.refresh();
        }),
        vscode.commands.registerCommand(Ng2React.initCustomPrompt, (source) => initCustomPrompt(source)),
        vscode.commands.registerCommand(Ng2React.generateReactTest, (uri) => generateReactTest(uri, context)),
        vscode.window.createTreeView('ng2react.treeView', {
            showCollapseAll: true,
            treeDataProvider,
        })
    );
    updateContext();
}
// This method is called when your extension is deactivated
export function deactivate() {}
