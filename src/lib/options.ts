import type { LeafDirective } from 'mdast-util-directive';
import type { VFile } from 'vfile';

export interface DirectiveAttributes {
  file: string;
  optional: boolean;
}

/**
 * Test and return attributes of `::include` directive Node
 *
 * @param file - Current markdown file
 * @param node - `::include` directive Node
 * @throws `VFileMessage` if `file` attribute
 *  for `::include` directive does not exists or empty
 *
 * @internal
 */
export function getAttributes(
  file: VFile,
  node: LeafDirective
): DirectiveAttributes {

  const attributes: DirectiveAttributes = {
    file: '',
    optional: false
  };

  if (!(
    (typeof node.attributes?.file === 'string') &&
    (node.attributes.file.length > 0)
  )) {
    file.fail('::include, `file` attribute expected', {
      place: node.position,
      ancestors: [node],
      source: '@it-service-npm/remark-include',
      ruleId: 'file-attribute-expected'
    });
  }
  attributes.file = node.attributes.file;

  if (typeof node.attributes.optional === 'string') {
    switch (node.attributes.optional) {
      case '':
      case 'true': {
        attributes.optional = true;
        break;
      }
      case 'false': {
        break;
      }
      default: {
        file.fail(`::include, \`optional\` attribute invalid value "${node.attributes.optional}"`, {
          place: node.position,
          ancestors: [node],
          source: '@it-service-npm/remark-include',
          ruleId: 'no-attribute-invalid-value'
        });
      }
    };
  }

  const unexpectedAttributes = Object.keys(node.attributes)
    .filter((attribute) => !(Object.keys(attributes).includes(attribute)));
  if (unexpectedAttributes.length > 0) {
    const attributeList = unexpectedAttributes
      .map((s) => `\`${s}\``)
      .join(', ');
    file.fail(`::include, unknown attribute(s): ${attributeList}`, {
      place: node.position,
      ancestors: [node],
      source: '@it-service-npm/remark-include',
      ruleId: 'no-unknown-attributes'
    });
  }

  return attributes;
}
