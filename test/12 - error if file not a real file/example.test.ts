import { describe, it, type TestContext } from 'node:test';
import { remark } from 'remark';
import { VFile } from 'vfile';
import { remarkIncludePresetSync } from '@it-service-npm/remark-include';

await describe('remark-include', async () => {

  // eslint-disable-next-line max-len
  await it('send a FAIL message to the remark processor if the file does not have a path',
    async (t: TestContext) => {

      const testFile = new VFile([
        'Hello. I am an main markdown file with `::include` directive.',
        '',
        '::include{}',
        '',
        '_That_ should do it!'
      ].join('\n'));
      const fileInfoSpy = t.mock.method(testFile, 'info');
      const fileFailSpy = t.mock.method(testFile, 'fail');

      const RemarkProcessor = remark()
        .use(remarkIncludePresetSync)
        .freeze();

      const _cwd = process.cwd();
      try {
        process.chdir(import.meta.dirname);

        await t.assert.rejects(
          RemarkProcessor
            .process(testFile)
        );

      } finally {
        process.chdir(_cwd);
      };

      t.assert.strictEqual(fileInfoSpy.mock.callCount(), 0);
      t.assert.strictEqual(fileFailSpy.mock.callCount(), 1);
    }
  );

});
