import { describe, it, type TestContext } from 'node:test';
import path from 'node:path';
import { remarkDirectiveUsingExample } from './example.ts';

await describe('remark-include', async () => {

  await it('update relative url for images',
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
          path.resolve(import.meta.dirname, 'fixtures', 'output.md'),
          { serializers: [(data: string) => data] }
        );
      } finally {
        process.chdir(_cwd);
      };
    }
  );

  await it('leave links (url) starting with `/` (relative to the repository root)',
    async (t: TestContext) => {
      const _cwd = process.cwd();
      try {
        process.chdir(import.meta.dirname);

        const outputFile = await remarkDirectiveUsingExample(
          path.resolve(
            import.meta.dirname, 'fixtures',
            'main-with-relative-to-root-link.md'
          )
        );

        t.assert.fileSnapshot(
          String(outputFile.value),
          path.resolve(
            import.meta.dirname, 'fixtures',
            'output-with-relative-to-root-link.md'
          ),
          { serializers: [(data: string) => data] }
        );
      } finally {
        process.chdir(_cwd);
      };
    }
  );

});
