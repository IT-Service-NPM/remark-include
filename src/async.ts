/* eslint-disable max-statements */
import path from 'node:path';
import { glob } from 'node:fs/promises';
import type { Transformer, Preset, Processor } from 'unified';
import type { Root, RootContent } from 'mdast';
import remarkDirective from 'remark-directive';
import type { VFile } from 'vfile';
import { read } from 'to-vfile';
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
  assertFilesExists, assertFileDirnameIsDefined, assertErrorIsVFileMessage
} from './library.ts';

/**
 * Async Remark plugin fabric function.
 *
 * With this plugin, you can use `::include{file=./included.md}`
 * {@link https://docs.gitlab.com/user/markdown/#includes| GitLab transclusion syntax}
 * statements to compose markdown files together.
 *
 * Additional features:
 *
 * - GitLab `::include` directives are ignored inside the included file,
 *   but this plugin supports recursive transclusion
 *
 * - It is possible to use globs (`::include{file="./included*.md"}`)
 *   in `file` attribute
 *
 * - Introduce a new attribute called `optional`.
 *   This attribute prevents fatal errors from occurring
 *   when the file (or files) specified by the `file` attribute does not exists
 *
 * - Relative images and links in the imported files will have their paths
 *   rewritten to be relative
 *   the original document rather than the imported file
 *   (with {@link https://www.npmjs.com/package/@it-service-npm/remark-relative-url-adjustment|`@it-service-npm/remark-relative-url-adjustment`})
 *
 * - An imported markdown file will "inherit" the headings level.
 *   If the `::include{file=./included.md}` statement happens under Heading 2,
 *   for example, any Heading 1 in the included file
 *   will be "translated" to have header level 3
 *   (with {@link https://www.npmjs.com/package/@it-service-npm/remark-heading-adjustment|`@it-service-npm/remark-heading-adjustment`})
 *
 * @public
 */
export function remarkInclude(
  this: Processor
): Transformer<Root> {

  const processor: Processor = this;

  return async function (tree: Root, file: VFile): Promise<Root> {

    const includeDirectives = getIncludeDirectives(tree, file);
    assertFileDirnameIsDefined(file);
    const fileDirname = path.resolve(file.dirname);
    for (const includeDirective of includeDirectives) {
      let includedContent: RootContent[] = [];
      try {
        const attributes = getAttributes(file, includeDirective.node);
        const includedFilesPaths = (await Array.fromAsync<string>(glob(
          attributes.file,
          { cwd: path.resolve(file.dirname) }
        )));
        assertFilesExists(file, includeDirective.node,
          attributes, includedFilesPaths
        );
        includedFilesPaths.sort();

        async function getFileAST(
          _includedFilePath: string
        ): Promise<RootContent[]> {
          const includedFilePath = path.resolve(fileDirname, _includedFilePath);
          const includedFile: VFile = await read(includedFilePath, 'utf8');
          const _includedAST = processor.parse(includedFile);
          const includedAST: Root = await processor()
            .data('topHeadingDepth', includeDirective.depth + 1)
            .data('filePathChanges', {
              sourcePath: includedFile.path,
              destinationPath: file.path
            })
            .run(_includedAST, includedFile) as Root;
          return includedAST.children;
        }
        const _includedContent: RootContent[][] = (await Promise.all(
          includedFilesPaths.map((filePath: string) => getFileAST(filePath))
        ));
        includedContent = _includedContent.flat();
      } catch (error) {
        assertErrorIsVFileMessage(error);
      }
      includeDirective.parent.children.splice(
        includeDirective.index, 1,
        ...includedContent
      );
    }
    return tree;
  };
};

/**
 * Preset of Remark plugins:
 *
 * - {@link remarkInclude}
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
