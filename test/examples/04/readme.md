# Recursive transclusion

`@it-service-npm/remark-include` supports recursive transclusion.

> [!TIP]
> This plugin has two named entry points:
>
> - ‘sync’ ('@it-service-npm/remark-include/sync’)
> - ‘async’ ('@it-service-npm/remark-include/async’)
>
> With sync and async plugin function and preset.

Sync plugin using example:

```typescript
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
```

Source files:

main.md:

```markdown
Hello. I am an main markdown file with `::include` directive.

::include{file=./included1.md}

_That_ should do it!
```

included1.md:

```markdown
Hello. I am the included1 file with `::include` directive
for recursive transclusion example.

::include{file=./included2.md}
```

included2.md:

```markdown
Hello. I am the included2 file.
```

Remark output:

```markdown
Hello. I am an main markdown file with `::include` directive.

Hello. I am the included1 file with `::include` directive
for recursive transclusion example.

Hello. I am the included2 file.

*That* should do it!
```
