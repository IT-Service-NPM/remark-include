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

  await it('send a FAIL message to the remark processor if file includes itself',
    async (t: TestContext) => {

      const testFile = await vFile.read(
        path.resolve(
          import.meta.dirname, 'fixtures',
          'main1.md'
        )
      );
      const fileInfoSpy = t.mock.method(testFile, 'info');
      const fileFailSpy = t.mock.method(testFile, 'fail');

      const _cwd = process.cwd();
      try {
        process.chdir(import.meta.dirname);
        t.assert.throws(() =>
          RemarkProcessor
            .processSync(testFile)
          , { fatal: true }
        );
      } finally {
        process.chdir(_cwd);
      };

      t.assert.strictEqual(fileInfoSpy.mock.callCount(), 0);
      t.assert.strictEqual(fileFailSpy.mock.callCount(), 1);
    }
  );

  await it('send a FAIL message to the remark processor if recursive transclusion occurs',
    async (t: TestContext) => {

      const testFile = await vFile.read(
        path.resolve(
          import.meta.dirname, 'fixtures',
          'main2.md'
        )
      );
      const _cwd = process.cwd();
      try {
        process.chdir(import.meta.dirname);
        t.assert.throws(() =>
          RemarkProcessor
            .processSync(testFile)
          , { fatal: true }
        );
      } finally {
        process.chdir(_cwd);
      };
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

  await it('send a FAIL message to the remark processor if file includes itself',
    async (t: TestContext) => {

      const testFile = await vFile.read(
        path.resolve(
          import.meta.dirname, 'fixtures',
          'main1.md'
        )
      );
      const fileInfoSpy = t.mock.method(testFile, 'info');
      const fileFailSpy = t.mock.method(testFile, 'fail');

      const _cwd = process.cwd();
      try {
        process.chdir(import.meta.dirname);
        await t.assert.rejects(
          RemarkProcessor
            .process(testFile)
          , { fatal: true }
        );
      } finally {
        process.chdir(_cwd);
      };

      t.assert.strictEqual(fileInfoSpy.mock.callCount(), 0);
      t.assert.strictEqual(fileFailSpy.mock.callCount(), 1);
    }
  );

  await it('send a FAIL message to the remark processor if recursive transclusion occurs',
    async (t: TestContext) => {

      const testFile = await vFile.read(
        path.resolve(
          import.meta.dirname, 'fixtures',
          'main2.md'
        )
      );
      const _cwd = process.cwd();
      try {
        process.chdir(import.meta.dirname);
        await t.assert.rejects(
          RemarkProcessor
            .process(testFile)
          , { fatal: true }
        );
      } finally {
        process.chdir(_cwd);
      };
    }
  );
});
