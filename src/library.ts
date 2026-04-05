import type { Nodes, Root, Parent } from 'mdast';
import type { LeafDirective } from 'mdast-util-directive';
import type { VFile } from 'vfile';
import { visit } from 'unist-util-visit';

/**
 * Collect `::include` directives for processing
 *
 * @param tree - Source AST
 * @param _file - Source markdown file
 * @returns Directives for later processing
 *
 * @internal
 */
export function getIncludeDirectives(tree: Root, _file: VFile): {
  node: LeafDirective,
  index: number,
  parent: Parent,
  depth: number
}[] {

  let depth = 0;
  const includeDirectives: {
    node: LeafDirective,
    index: number,
    parent: Parent,
    depth: number
  }[] = [];

  visit(
    tree,
    function (node: Nodes, index?: number, parent?: Parent): void {
      if (node.type === 'heading') {
        depth = node.depth;
      } else if (
        (node.type === 'leafDirective') &&
        ((node).name === 'include')
      ) {
        includeDirectives.unshift({
          node: node,
          index: index!,
          parent: parent!,
          depth: depth
        });
      }
    }
  );

  return includeDirectives;
}

type NonEmptyArray<T> = [T, ...T[]];

/**
 * Send Remark error message when file (files) from
 * `::include` directive not found
 *
 * @param file - Current markdown file
 * @param node - `::include` directive Node
 * @param paths - Files paths
 * @throws `VFileMessage` if file not found
 *
 * @internal
 */
export function assertFilesExists(
  file: VFile,
  node: LeafDirective,
  paths: string[]
): asserts paths is NonEmptyArray<string> {
  if (paths.length === 0) {
    if (
      node.attributes?.optional === null ||
      typeof node.attributes?.optional === 'undefined'
    ) {
      file.fail(
        `::include, file not found - "${node.attributes?.file ?? ''}"`,
        node,
        '@it-service-npm/remark-include'
      );
    } else {
      throw file.info(
        `::include, file not found - "${node.attributes.file ?? ''}"`,
        node,
        '@it-service-npm/remark-include'
      );
    }
  }
}

/**
 * Test `file.dirname` expected
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
      // eslint-disable-next-line max-len
      '::include, unexpected error: "file" should be an instance of VFile with specified path',
      undefined,
      '@it-service-npm/remark-include'
    );
  }
}

/**
 * Test `file` attribute of `::include` directive Node
 *
 * @param file - Current markdown file
 * @param node - `::include` directive Node
 * @throws `VFileMessage` if `file` attribute
 *  for `::include` directive does not exists or empty
 *
 * @internal
 */
export function assertFileAttributeIsCorrect(
  file: VFile,
  node: LeafDirective
): asserts node is LeafDirective & {
  attributes: Record<string, string | null | undefined> & {
    file: string
  }
} {
  if (!(
    (typeof node.attributes?.file === 'string') &&
    (node.attributes.file.length > 0)
  )) {
    file.fail(
      '::include, `file` attribute expected',
      node,
      '@it-service-npm/remark-include'
    );
  }
}
