/**
 * With this plugin, you can use `::include{file=./included.md}`
 * {@link https://docs.gitlab.com/user/markdown/#includes|
 * GitLab transclusion syntax}
 * statements to compose markdown files together.
 *
 * Additional features:
 *
 * - GitLab include directives inside the included file are ignored,
 *   but this plugin support recursive transclusion
 *
 * - It is possible to use globs (`::include{file=./included*.md}`)
 *   in `file` attribute
 *
 * - Introduce a new attribute called `optional`.
 *   This attribute prevents fatal errors from occurring
 *   when the file or files specified by the `file` attribute do not exist
 *
 * - Relative images and links in the imported files will have their paths
 *   rewritten to be relative
 *   the original document rather than the imported file
 *   (with {@link https://www.npmjs.com/package/@it-service-npm/remark-relative-url-adjustment|
 *   `@it-service-npm/remark-relative-url-adjustment`})
 *
 * - An imported markdown file will "inherit" the heading levels.
 *   If the `::include{file=./included.md}` statement happens under Heading 2,
 *   for example, any heading 1 in the included file
 *   will be "translated" to have header level 3
 *   (with{@link https://www.npmjs.com/package/@it-service-npm/remark-heading-adjustment|
 *   `@it-service-npm/remark-heading-adjustment`})
 *
 * This plugin is a modern fork of
 * {@link https://github.com/BrekiTomasson/remark-import| remark-import}
 * and {@link https://github.com/Qard/remark-include| remark-include},
 * compatible with Remark v15.
 *
 * @packageDocumentation
 */

export {
  remarkInclude as remarkIncludeSync,
  remarkIncludePreset as remarkIncludePresetSync
} from './sync.ts';
export {
  remarkInclude,
  remarkIncludePreset, remarkIncludePreset as default
} from './async.ts';
