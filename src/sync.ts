/* eslint-disable max-statements */
import path from 'node:path';
import { globSync } from 'node:fs';
import type { Transformer, Preset, Processor } from 'unified';
import type { Root, RootContent } from 'mdast';
import remarkDirective from 'remark-directive';
import type { VFile } from 'vfile';
import { VFileMessage } from 'vfile-message';
import { readSync } from 'to-vfile';
import {
  remarkHeadingsAdjustment
} from '@it-service-npm/remark-heading-adjustment';
import {
  remarkRelativeUrlsAdjustment
} from '@it-service-npm/remark-relative-url-adjustment';
import {
  remarkRelativeCodePathsAdjustment
} from '@it-service-npm/remark-code-path-adjustment';
import {
  getIncludeDirectives,
  assertFilesExists, assertFileAttributeIsCorrect, assertFileDirnameIsDefined
} from './library.js';

/**
 * Sync Remark plugin fabric function.
 *
 * With this plugin, you can use `::include{file=./included.md}`
 * statements to compose markdown files together.
 *
 * This plugin is a modern fork of
 * {@link https://github.com/BrekiTomasson/remark-import| remark-import}
 * and {@link https://github.com/Qard/remark-include| remark-include},
 * compatible with Remark v15.
 *
 * Relative images and links in the imported files
 * will have their paths rewritten
 * to be relative the original document rather than the imported file.
 *
 * An imported markdown file will "inherit" the heading levels.
 * If the `::include{file=./included.md}` statement happens under Heading 2,
 * for example, any heading 1 in the included file
 * will be "translated" to have header level 3.
 *
 * @remarks
 *
 * @see {@link https://github.com/BrekiTomasson/remark-import| remark-import},
 * {@link https://github.com/Qard/remark-include| remark-include}
 *
 * @public
 */
export function remarkInclude(
  this: Processor
): Transformer<Root> {

  const processor: Processor = this;

  return function (tree: Root, file: VFile): Root {

    const includeDirectives = getIncludeDirectives(tree, file);
    assertFileDirnameIsDefined(file);
    const fileDirname = path.resolve(file.dirname);
    for (const includeDirective of includeDirectives) {
      let includedContent: RootContent[] = [];
      try {
        assertFileAttributeIsCorrect(file, includeDirective.node);
        const includedFilesPaths = globSync(
          includeDirective.node.attributes.file,
          { cwd: path.resolve(file.dirname) }
        ).toSorted();
        assertFilesExists(file, includeDirective.node,
          includedFilesPaths
        );

        function getFileAST(_includedFilePath: string): RootContent[] {
          const includedFilePath = path.resolve(fileDirname, _includedFilePath);
          const includedFile: VFile = readSync(includedFilePath, 'utf8');
          const _includedAST = processor.parse(includedFile);
          const includedAST: Root = processor()
            .data('topHeadingDepth', includeDirective.depth + 1)
            .data('filePathChanges', {
              sourcePath: includedFile.path,
              destinationPath: file.path
            })
            .runSync(_includedAST, includedFile) as Root;
          return includedAST.children;
        }
        includedContent = includedFilesPaths.flatMap(
          (filePath: string) => getFileAST(filePath)
        );
      } catch (error) {
        if (!((error instanceof VFileMessage) && (!error.fatal))) {
          throw error;
        }
      }
      includeDirective.parent.children.splice(
        includeDirective.index, 1,
        ...includedContent
      );
    }
    return tree;
  };
}

/**
 * Preset of Remark plugins:
 * {@link remarkIncludeSync}
 * and {@link https://www.npmjs.com/package/remark-directive| remarkDirective}
 *
 * @remarks
 *
 * @see {@link remarkIncludeSync},
 * {@link https://www.npmjs.com/package/remark-directive| remarkDirective}
 *
 * @public
 */
export const remarkIncludePreset: Preset = {
  plugins: [
    remarkDirective,
    remarkInclude,
    remarkHeadingsAdjustment,
    remarkRelativeUrlsAdjustment,
    remarkRelativeCodePathsAdjustment
  ]
};
