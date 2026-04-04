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

    for (const includeDirective of includeDirectives) {
      try {
        assertFileDirnameIsDefined(file, includeDirective.node);
        const filePathGlob = includeDirective.node.attributes?.file;
        assertFileAttributeIsCorrect(
          filePathGlob,
          file, includeDirective.node
        );
        const includedFilesPaths = globSync(filePathGlob, {
          cwd: path.resolve(file.dirname)
        }).toSorted();
        assertFilesExists(
          includedFilesPaths,
          includeDirective.node, file, filePathGlob
        );

        const includedContent: RootContent[] = includedFilesPaths.flatMap(
          function (
            _includedFilePath: string
          ): RootContent[] {
            const includedFilePath = path.resolve(
              path.resolve(file.dirname),
              _includedFilePath
            );
            const includedFile: VFile = readSync(includedFilePath, 'utf8');

            const includedAST: Root = processor()
              .data('topHeadingDepth', includeDirective.depth + 1)
              .data('filePathChanges', {
                sourcePath: includedFile.path,
                destinationPath: file.path
              })
              .runSync(
                processor.parse(includedFile),
                includedFile
              ) as Root;

            return includedAST.children;
          }
        );

        includeDirective.parent.children.splice(
          includeDirective.index, 1,
          ...includedContent
        );

      } catch (error) {
        if ((error instanceof VFileMessage) && (!error.fatal)) {
          includeDirective.parent.children.splice(
            includeDirective.index, 1,
          );
        } else {
          throw error;
        }
      }
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
