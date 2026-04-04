import type { Nodes, Root, Parent } from 'mdast';
import type { LeafDirective } from 'mdast-util-directive';
import type { VFile } from 'vfile';
import { visit } from 'unist-util-visit';

/**
 * Collect `::include` directives for processing
 *
 * @param tree source AST
 * @param _file source markdown file
 * @returns directives for later processing
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
 * Send Remark error message when file from
 * `::include` directive not found
 *
 * @param paths - files paths
 * @param node - include directive
 * @param file - current markdown file
 * @param fileAttribute - missing file path
 * @throws
 *
 * @internal
 */
export function assertFilesExists(
  paths: string[],
  node: LeafDirective,
  file: VFile,
  fileAttribute: string
): asserts paths is NonEmptyArray<string> {
  if (paths.length === 0) {
    if (
      node.attributes?.optional === null ||
      typeof node.attributes?.optional === 'undefined'
    ) {
      file.fail(
        `::include, file not found - "${fileAttribute}"`,
        node,
        '@it-service-npm/remark-include'
      );
    } else {
      throw file.info(
        `::include, file not found - "${fileAttribute}"`,
        node,
        '@it-service-npm/remark-include'
      );
    }
  }
}

/**
 * Test for file.dirname is defined
 *
 * @param file current markdown file
 * @param node include directive
 * @throws
 *
 * @internal
 */
export function assertFileDirnameIsDefined(
  file: VFile,
  node: LeafDirective
): asserts file is VFile & { dirname: NonNullable<VFile['dirname']> } {
  if (typeof file.dirname === 'undefined') {
    file.fail(
      '::include, unexpected error: "file" should be an instance of VFile',
      node,
      '@it-service-npm/remark-include'
    );
  }
}

/**
 * Test `file` attribute
 *
 * @param file current markdown file
 * @param node include directive
 * @throws
 *
 * @internal
 */
export function assertFileAttributeIsCorrect(
  fileAttribute: any,
  file: VFile,
  node: LeafDirective
): asserts fileAttribute is string {
  if (
    node.attributes?.file === null ||
    typeof node.attributes?.file === 'undefined'
  ) {
    file.fail(
      '::include, `file` attribute expected',
      node,
      '@it-service-npm/remark-include'
    );
  }
}
