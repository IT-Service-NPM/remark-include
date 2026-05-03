// https://github.com/unifiedjs/unified-engine#config-files

import remarkGfm from 'remark-gfm';
import remarkPresetLintConsistent from 'remark-preset-lint-consistent';
import remarkPresetLintRecommended from 'remark-preset-lint-recommended';
import remarkLicense from 'remark-license';
import remarkTypography from 'remark-typography';
import remarkValidateLinks from 'remark-validate-links';
import remarkLintCodeBlockStyle from 'remark-lint-code-block-style';
import remarkDirective from 'remark-directive';
import { remarkIncludeCode } from '@it-service-npm/remark-include-code/async';
import { remarkIncludePreset } from '@it-service-npm/remark-include/async';
import { remarkGithubAdmonitions } from '@it-service-npm/remark-gfm-admonition';
import remarkToc from 'remark-toc';
import removeComments from 'remark-remove-comments';

export default {
  plugins: [
    remarkDirective,
    remarkGithubAdmonitions,
    [remarkIncludeCode, {
      useEditorConfig: true,
      trimFinalNewline: true,
      trimExtraIndent: true
    }],
    remarkIncludePreset,
    remarkToc,
    remarkLicense,
    remarkGfm,
    remarkValidateLinks,
    remarkTypography,
    remarkPresetLintConsistent,
    remarkPresetLintRecommended,
    remarkLintCodeBlockStyle,
    removeComments
  ],
  settings: {
    bullet: '-'
  }
}
