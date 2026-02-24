import { remark } from 'remark';
import * as vFile from 'to-vfile';
import remarkDirective from 'remark-directive';
import { remarkIncludePresetSync } from '@it-service-npm/remark-include';
import type { VFile } from 'vfile';

export function remarkDirectiveUsingExample(
  filePath: string
): VFile {
  return remark()
    .use(remarkDirective)
    .use(remarkIncludePresetSync)
    .processSync(vFile.readSync(filePath));
};
