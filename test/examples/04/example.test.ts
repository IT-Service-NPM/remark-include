import { describe, it, type TestContext } from 'node:test';
import path from 'node:path';
import { remarkDirectiveUsingExample } from './example.ts';

await describe('remark-include', async () => {

  await it('must support include directive in included files',
    async (t: TestContext) => {
      const _cwd = process.cwd();
      try {
        process.chdir(import.meta.dirname);

        const outputFile = await remarkDirectiveUsingExample(
          path.resolve(
            import.meta.dirname, 'fixtures',
            'main.md'
          )
        );

        t.assert.fileSnapshot(
          String(outputFile.value),
          path.resolve(import.meta.dirname, 'snapshots', 'output.md'),
          { serializers: [(data: string) => data] }
        );
      } finally {
        process.chdir(_cwd);
      };
    }
  );

});
