import { search } from '@ng2react/core';
import * as fs from 'fs';
import * as vscode from 'vscode';
import Config from '../Config';
import { ConvertToReactArgs, Ng2React } from '../commands/CommandName';
import findAllAngularFiles from '../lib/findAllAngularFiles';
import { findExistingConversions } from '../lib/searchDocument';

type TreeNode = { name: string; uri: vscode.Uri; type: 'react' | 'angular' | 'component' | 'file' | 'convert' };

export default function createNg2ReactTreeView() {
    const onDidChangeTreeData = new vscode.EventEmitter<TreeNode | void>();
    let enabled = Config.get('enabled') === 'yes';
    return {
        getChildren: async (parent?: TreeNode) => {
            if (!enabled) {
                return [];
            }
            if (!parent) {
                return (await findAllAngularFiles()).map(
                    ({ uri, name }) => ({ uri, name, type: 'file' } satisfies TreeNode)
                );
            }
            if (parent.type === 'file') {
                const content = fs.readFileSync(parent.uri.fsPath, 'utf8');
                return search(content, { file: parent.uri.fsPath }).flatMap(({ name }) => [
                    { name: name, uri: parent.uri, type: 'component' } satisfies TreeNode,
                ]);
            }
            if (parent.type === 'component') {
                // Assume this is an AngularJS file and find conversions
                return [
                    { ...parent, type: 'convert' },
                    { ...parent, type: 'angular' },
                    ...findExistingConversions(parent.uri, parent.name).map(
                        ({ name, uri }) => ({ name, uri, type: 'react' } satisfies TreeNode)
                    ),
                ];
            }
            // Assume this is a React file
            return [];
        },
        getTreeItem: (item: TreeNode) => {
            if (item.type === 'file') {
                return {
                    label: item.uri.path.split('/').pop()!,
                    collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
                };
            }
            if (item.type === 'component') {
                return {
                    label: item.name,
                    collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
                };
            }
            if (item.type === 'convert') {
                return {
                    label: 'Convert to React',
                    collapsibleState: vscode.TreeItemCollapsibleState.None,
                    iconPath: new vscode.ThemeIcon('gear'),
                    command: {
                        title: 'Convert to React',
                        command: Ng2React.convertToReact,
                        arguments: [item.uri, item.name] satisfies ConvertToReactArgs,
                        tooltip: 'Convert this angular component to react',
                    },
                };
            }
            return {
                label: item.type === 'react' ? item.uri.path.split('/').pop()! : item.name,
                collapsibleState: vscode.TreeItemCollapsibleState.None,
                resourceUri: item.uri,
                command: {
                    title: 'Open',
                    command: 'vscode.open',
                    arguments: [item.uri],
                    tooltip: 'Open this file',
                },
            };
        },
        onDidChangeTreeData: onDidChangeTreeData.event,
        refresh() {
            enabled = true;
            onDidChangeTreeData.fire();
        },
    } satisfies vscode.TreeDataProvider<TreeNode> & { refresh(): void };
}
