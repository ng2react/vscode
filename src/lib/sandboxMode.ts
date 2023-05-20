import type { convert } from '@ng2react/core';
import Config from '../Config';
import { toPascalCase } from './writeToFile';

export function isSandbox() {
    return Config.get('sandbox');
}

export function getDummyResponse(componentName: string) {
    return new Promise<Awaited<ReturnType<typeof convert>>>((resolve) =>
        setTimeout(() => {
            const jsx = `const ${toPascalCase(componentName)} = () => {};`;
            resolve({
                prompt: `# ${componentName} sandbox mode dummy prompt\n\`\`\`javascript
angular.module('myApp', [])
    .component('${componentName}', {
        template: <></>
    });
\`\`\``,
                results: [
                    {
                        markdown: `# ${componentName} sandbox mode dummy response\n\`\`\`jsx\n${jsx}\n\`\`\``,
                        jsx,
                    } as const,
                ],
            });
        }, 1000)
    );
}
