import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
const KEY = {
    enabled: 'enabled',
    sandbox: 'sandbox',
    angularRoot: 'source.angularRoot',
    reactRoot: 'source.reactRoot',
    testRoot: 'source.testRoot',
    testSuffix: 'source.testSuffix',
    apiKey: 'openai.apiKey',
    organization: 'openai.organisation',
    model: 'openai.model',
    temperature: 'openai.temperature',
    openai: 'openai',
} as const;

type ReturnsOptString = 'openai.organisation' | 'openai.apiKey';
type ReturnsString = `source.${'angular' | 'react' | 'test'}Root` | 'openai.model';
type ReturnsBool = 'sandbox';
type ReturnsNumber = 'openai.temperature';

export default class Config {
    static get(key: 'openai'): {
        apiKey: string | undefined;
        model: 'gpt-4' | 'gpt-3-turbo';
        organisation: string | undefined;
        temperature: number;
    };
    static get(key: 'enabled'): 'yes' | 'no' | 'auto';
    static get(key: ReturnsBool): boolean;
    static get(key: ReturnsNumber): number;
    static get(key: ReturnsOptString): string | undefined;
    static get(key: ReturnsString): string;
    static get(key: (typeof KEY)[keyof typeof KEY]) {
        const config = vscode.workspace.getConfiguration('ng2react');
        return config.get(key);
    }
}

export function getSourceRoot(key: 'angular' | 'react' | 'test') {
    const sourceRoot = Config.get(`source.${key}Root`) || 'src';
    const absoluteSourceRoot = path.join(vscode.workspace.workspaceFolders![0].uri.fsPath, sourceRoot);
    if (!fs.existsSync(absoluteSourceRoot)) {
        return undefined;
    }
    return absoluteSourceRoot;
}