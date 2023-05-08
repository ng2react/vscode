import * as vscode from 'vscode';
import { toPascalCase } from './writeToFile';
import type { convert } from '@ng2react/core';

export function isSandbox() {
    return !!vscode.workspace.getConfiguration('ng2react.sandbox');
}

export function getDummyResponse(componentName: string) {
    return new Promise<Awaited<ReturnType<typeof convert>>>((resolve) =>
        setTimeout(() => {
            const jsx = `const ${toPascalCase(componentName)} = () => {};`;
            resolve([
                {
                    markdown: `# ${componentName} sandbox mode dummy response\n\`\`\`jsx\n${jsx}\n\`\`\``,
                    jsx,
                } as const,
            ]);
        }, 3000)
    );
}
