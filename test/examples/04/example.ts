import { remark } from 'remark';
import * as vFile from 'to-vfile';
import { remarkIncludePreset } from '@it-service-npm/remark-include/sync';
import type { VFile } from 'vfile';

export function remarkDirectiveUsingExample(
  filePath: string
): VFile {
  return remark()
    .use(remarkIncludePreset)
    .processSync(vFile.readSync(filePath));
};
