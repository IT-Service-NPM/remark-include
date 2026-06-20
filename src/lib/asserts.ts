import type { LeafDirective } from 'mdast-util-directive';
import type { VFile } from 'vfile';
import { type Options as VFileMessageOptions } from 'vfile-message';
import type { IData } from './types.ts';

export interface DirectiveAttributes {
  file: string;
  optional: boolean;
}

type NonEmptyArray<T> = [T, ...T[]];

/**
 * Send Remark error message when file (files) from
 * `::include` directive not found
 *
 * @param file - Current markdown file
 * @param node - `::include` directive Node
 * @param attributes - `::include` directive attributes
 * @param paths - Files paths
 * @throws `VFileMessage` if file not found
 *
 * @internal
 */
export function assertFilesExistsOrOptional(
  file: VFile,
  node: LeafDirective,
  attributes: DirectiveAttributes,
  paths: string[]
): asserts paths is NonEmptyArray<string> {
  if (paths.length > 0) {
    return;
  }
  const errorMessage = `file(s) "${attributes.file}" not found`;
  const errorOptions: VFileMessageOptions = {
    place: node.position,
    ancestors: [node],
    source: '@it-service-npm/remark-include',
    ruleId: 'no-empty-file-list'
  };
  if (attributes.optional) {
    file.info(errorMessage, errorOptions);
  } else {
    file.fail(errorMessage, errorOptions);
  }
}

/**
 * Send Remark error message when file from
 * `::include` directive includes this file with `::include` directive
 *
 * @param file - Current markdown file
 * @param node - `::include` directive Node
 * @param attributes - `::include` directive attributes
 * @param includedFilePath - file paths for including
 * @param processorData - Remark processor additional data, used by this plugin
 * @throws `VFileMessage` if unexpected recursive transclusion occurs
 *
 * @internal
 */
export function assertNoRecursiveTransclusion(
  file: VFile,
  node: LeafDirective,
  attributes: DirectiveAttributes,
  includedFilePath: string,
  processorData?: IData
): void {
  if (!processorData?.processedFilePaths.includes(includedFilePath)) {
    return;
  }
  const filesList = [...processorData.processedFilePaths, includedFilePath]
    .map((filePath) => `"${filePath}"`)
    .join('\n\t-> ');
  file.fail(`unexpected recursive transclusion:\n\t${filesList}`, {
    place: node.position,
    ancestors: [node],
    source: '@it-service-npm/remark-include',
    ruleId: 'no-recursive-transclusion'
  });
}

/**
 * Assert that `file.dirname` is defined
 *
 * @param file - current markdown file
 * @throws `VFileMessage` if `file.dirname` is undefined
 *
 * @internal
 */
export function assertFileDirnameIsDefined(
  file: VFile
): asserts file is VFile & { get dirname(): string } {
  if (typeof file.dirname === 'undefined') {
    file.fail(
      'Unexpected error in ::include directive: file should be an instance of VFile with specified path', {
      source: '@it-service-npm/remark-include',
      ruleId: 'file-must-be-placed-in-file-system'
    }
    );
  }
}
