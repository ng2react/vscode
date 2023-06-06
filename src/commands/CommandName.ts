import * as vscode from 'vscode';
import analyseFileCmd from './analyseFile';
import { convertToReactCmd } from './convertToReact';
// eslint-disable-next-line @typescript-eslint/naming-convention
export const Ng2React = {
    convertToReact: 'ng2react.convertToReact',
    analyseFile: 'ng2react.analyseFile',
    refreshTreeView: 'ng2react.refreshTreeView',
    initCustomPrompt: 'ng2react.initCustomPrompt',
    generateReactTest: 'ng2react.generateReactTest',
    checkConnection: 'ng2react.checkConnection',
} as const;

export type Ng2ReactCommand = (typeof Ng2React)[keyof typeof Ng2React];

type ConvertToReactParams = Parameters<typeof convertToReactCmd>;
export type ConvertToReactArgs = [vscode.Uri, string] & [ConvertToReactParams[0], ConvertToReactParams[1]];
export type AnalyseFileArgs = [vscode.Uri] & Parameters<typeof analyseFileCmd>;
