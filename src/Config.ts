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
    customPromptEnabled: 'customPrompt.enabled',
    customPromptSource: 'customPrompt.location',
    targetLanguage: 'targetLanguage',
} as const;

type ReturnsOptString = 'openai.organisation' | 'openai.apiKey' | 'customPrompt.location';
type ReturnsString = `source.${'angular' | 'react' | 'test'}Root` | 'openai.model';
type ReturnsBool = 'sandbox' | 'customPrompt.enabled';
type ReturnsNumber = 'openai.temperature';

export default class Config {
    static get(key: 'openai'): {
        apiKey: string | undefined;
        model: 'gpt-4' | 'gpt-3-turbo';
        organisation: string | undefined;
        temperature: number;
    };
    static get(key: 'source.testSuffix'): '.spec' | '.test';
    static get(key: 'targetLanguage'): 'javascript' | 'typescript' | 'auto';
    static get(key: 'enabled'): 'yes' | 'no' | 'auto';
    static get(key: ReturnsBool): boolean;
    static get(key: ReturnsNumber): number;
    static get(key: ReturnsOptString): string | undefined;
    static get(key: ReturnsString): string;
    static get(key: (typeof KEY)[keyof typeof KEY]) {
        const config = vscode.workspace.getConfiguration('ng2react');
        return config.get(key);
    }

    static set(
        key: 'targetLanguage',
        value: 'javascript' | 'typescript' | 'auto',
        target: vscode.ConfigurationTarget
    ): Thenable<void>;
    static set(key: 'enabled', value: 'yes' | 'no' | 'auto', target: vscode.ConfigurationTarget): Thenable<void>;
    static set(key: ReturnsBool, value: boolean, target: vscode.ConfigurationTarget): Thenable<void>;
    static set(key: ReturnsNumber, value: number, target: vscode.ConfigurationTarget): Thenable<void>;
    static set(key: ReturnsOptString, value: string | undefined, target: vscode.ConfigurationTarget): Thenable<void>;
    static set(key: ReturnsString, value: string, target: vscode.ConfigurationTarget): Thenable<void>;
    static set(key: (typeof KEY)[keyof typeof KEY], value: unknown, target: vscode.ConfigurationTarget) {
        const config = vscode.workspace.getConfiguration('ng2react');
        return config.update(key, value, target);
    }
}

export function getSourceRoot(key: 'angular' | 'react' | 'test') {
    const sourceRoot = Config.get(`source.${key}Root`) || 'src';
    const absoluteSourceRoot = path.join(vscode.workspace.workspaceFolders![0].uri.fsPath, sourceRoot);
    if (!fs.existsSync(absoluteSourceRoot)) {
        fs.mkdirSync(absoluteSourceRoot, { recursive: true });
        return undefined;
    }
    return absoluteSourceRoot;
}

export function getCustomPromptPath() {
    const sourceRoot = Config.get('customPrompt.location');
    if (!sourceRoot) {
        return undefined;
    }
    return path.join(vscode.workspace.workspaceFolders![0].uri.fsPath, sourceRoot);
}

export function getTargetLanguage(uri: vscode.Uri): 'javascript' | 'typescript';
export function getTargetLanguage(): 'javascript' | 'typescript' | 'auto';
export function getTargetLanguage(uri?: vscode.Uri) {
    const targetLanguage = Config.get('targetLanguage');
    if (targetLanguage === 'auto' && uri) {
        return path.extname(uri.fsPath).startsWith('.t') ? 'typescript' : 'javascript';
    }
    return targetLanguage;
}
