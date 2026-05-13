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
  getIncludeDirectives, getAttributes,
  assertFilesExists, assertFileDirnameIsDefined
} from './library.ts';

/**
 * Sync Remark plugin fabric function.
 *
 * With this plugin, you can use `::include{file=./included.md}`
 * {@link https://docs.gitlab.com/user/markdown/#includes| GitLab transclusion syntax}
 * statements to compose markdown files together.
 *
 * Additional features:
 *
 * - GitLab include directives inside the included file are ignored,
 *   but this plugin support recursive transclusion
 *
 * - It is possible to use globs (`::include{file="./included*.md"}`)
 *   in `file` attribute
 *
 * - Introduce a new attribute called `optional`.
 *   This attribute prevents fatal errors from occurring
 *   when the file or files specified by the `file` attribute do not exist
 *
 * - Relative images and links in the imported files will have their paths
 *   rewritten to be relative
 *   the original document rather than the imported file
 *   (with {@link https://www.npmjs.com/package/@it-service-npm/remark-relative-url-adjustment|`@it-service-npm/remark-relative-url-adjustment`})
 *
 * - An imported markdown file will "inherit" the heading levels.
 *   If the `::include{file=./included.md}` statement happens under Heading 2,
 *   for example, any heading 1 in the included file
 *   will be "translated" to have header level 3
 *   (with {@link https://www.npmjs.com/package/@it-service-npm/remark-heading-adjustment|`@it-service-npm/remark-heading-adjustment`})
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
        const attributes = getAttributes(file, includeDirective.node);
        const includedFilesPaths = globSync(
          attributes.file,
          { cwd: path.resolve(file.dirname) }
        ).toSorted();
        assertFilesExists(file, includeDirective.node,
          attributes, includedFilesPaths
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
 *
 * - {@link remarkIncludeSync}
 *
 * - {@link https://www.npmjs.com/package/remark-directive|remarkDirective}
 *
 * - {@link https://www.npmjs.com/package/@it-service-npm/remark-heading-adjustment|remarkHeadingsAdjustment}
 *
 * - {@link https://www.npmjs.com/package/@it-service-npm/remark-relative-url-adjustment|remarkRelativeUrlsAdjustment}
 *
 * - {@link https://www.npmjs.com/package/@it-service-npm/remark-code-path-adjustment|remarkRelativeCodePathsAdjustment}
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
