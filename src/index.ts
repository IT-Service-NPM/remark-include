/**
 * With this Remark plugin, you can use `::include`
 * directive to compose markdown files together.
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
} from './sync.js';
export {
  remarkInclude,
  remarkIncludePreset
} from './async.js';
