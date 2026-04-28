# Transclusion or including markdown sub-documents for reuse

`@it-service-npm/remark-include` can include sub-documents in markdown document.

> [!TIP]
> This plugin has two named entry points:
>
> - ‘sync’ ('@it-service-npm/remark-include/sync’)
> - ‘async’ ('@it-service-npm/remark-include/async’)
>
> With sync and async plugin function and preset.

Async plugin using example:

```typescript
import { remark } from 'remark';
import * as vFile from 'to-vfile';
import { remarkIncludePreset } from '@it-service-npm/remark-include/async';
import type { VFile } from 'vfile';

export async function remarkDirectiveUsingExample(
  filePath: string
): Promise<VFile> {
  return remark()
    .use(remarkIncludePreset)
    .process(await vFile.read(filePath));
};
```

Source files:

main.md:

```markdown
Hello. I am an main markdown file with `::include` directive.

::include{file=./included1.md}

After first file.

::include{file="./included 2.md"}

After second file.

_That_ should do it!
```

included1.md:

```markdown
Hello. I am the included1 file.
```

included 2.md:

```markdown
Hello. I am the included2 file.
```

Remark output:

```markdown
Hello. I am an main markdown file with `::include` directive.

Hello. I am the included1 file.

After first file.

Hello. I am the included2 file.

After second file.

*That* should do it!
```
