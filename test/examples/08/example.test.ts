import { describe, it, type TestContext } from 'node:test';
import path from 'node:path';
import {
  remarkDirectiveUsingExample as remarkDirectiveUsingExampleSync
} from './example.sync.ts';
import {
  remarkDirectiveUsingExample
} from './example.ts';

await describe('remark-include', async () => {

  await it('supports globs as file path in sync mode',
    (t: TestContext) => {
      const _cwd = process.cwd();
      try {
        process.chdir(import.meta.dirname);

        const outputFile = remarkDirectiveUsingExampleSync(
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

  await it('supports globs as file path in async mode',
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
