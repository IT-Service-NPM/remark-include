import type { Nodes, Root, Parent } from 'mdast';
import type { LeafDirective } from 'mdast-util-directive';
import type { VFile } from 'vfile';
import { visit } from 'unist-util-visit';
import { VFileMessage } from 'vfile-message';

export interface DirectiveInfo {
  node: LeafDirective,
  index: number,
  parent: Parent,
  depth: number
}

/**
 * Collect `::include` directives for processing
 *
 * @param tree - Source AST
 * @param _file - Source markdown file
 * @returns Directives for later processing
 *
 * @internal
 */
export function getIncludeDirectives(
  tree: Root, _file: VFile
): DirectiveInfo[] {

  let depth = 0;
  const includeDirectives: DirectiveInfo[] = [];

  visit(
    tree,
    function (node: Nodes, index?: number, parent?: Parent): void {
      if (node.type === 'heading') {
        depth = node.depth;
      } else if (
        (node.type === 'leafDirective') &&
        (node.name === 'include')
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

/**
 * Wrap recursive Remark processor calls error
 *
 * @param file - Current markdown file
 * @param node - `::include` directive Node
 * @param error - errors, produced by recursive Remark processor calls
 * @throws `VFileMessage` if unexpected recursive transclusion occurs
 *
 * @internal
 */
export function wrapRecursiveProcessorCallsErrors(
  file: VFile,
  node: LeafDirective,
  error: unknown
): never {
  if (error instanceof VFileMessage) {
    file.fail(error.message, {
      place: node.position,
      ancestors: [node],
      source: error.source,
      ruleId: error.ruleId,
      cause: error
    });
  } else {
    file.fail('An unexpected error occurred during recursive include processing. Check the included file for errors.', {
      place: node.position,
      ancestors: [node],
      source: '@it-service-npm/remark-include',
      ruleId: 'unknown-processor-call-error',
      cause: error as Error
    });
  }
}
