import { describe, it, beforeEach, type TestContext } from 'node:test';
import path from 'node:path';
import { remark } from 'remark';
import type { Processor } from 'unified';
import type { Root } from 'mdast';
import * as vFile from 'to-vfile';
import {
  remarkIncludePreset,
  remarkIncludePresetSync
} from '@it-service-npm/remark-include';

await describe('remarkIncludeSync', async () => {

  let RemarkProcessor: Processor<Root, undefined, undefined, Root, string>;

  beforeEach(() => {
    RemarkProcessor = remark()
      .use(remarkIncludePresetSync)
      .freeze();
  });

  await it('do not throws on empty included file',
    async (t: TestContext) => {

      const testFile = await vFile.read(
        path.resolve(
          import.meta.dirname, 'fixtures',
          'main.md'
        )
      );

      const outputFile = RemarkProcessor
        .processSync(testFile);

      t.assert.fileSnapshot(
        String(outputFile.value),
        path.resolve(import.meta.dirname, 'snapshots', 'output.md'),
        { serializers: [(data: string) => data] }
      );
    }
  );
});

await describe('remarkInclude', async () => {

  let RemarkProcessor: Processor<Root, undefined, undefined, Root, string>;

  beforeEach(() => {
    RemarkProcessor = remark()
      .use(remarkIncludePreset)
      .freeze();
  });

  await it('do not throws on empty included file',
    async (t: TestContext) => {

      const testFile = await vFile.read(
        path.resolve(
          import.meta.dirname, 'fixtures',
          'main.md'
        )
      );

      const outputFile = await RemarkProcessor
        .process(testFile);

      t.assert.fileSnapshot(
        String(outputFile.value),
        path.resolve(import.meta.dirname, 'snapshots', 'output.md'),
        { serializers: [(data: string) => data] }
      );
    }
  );
});
