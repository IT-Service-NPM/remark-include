# @it-service-npm/remark-include Remark plugin

[![GitHub release][github-release]][github-release-url]
[![NPM release][npm]][npm-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]

[![CI Status][build]][build-url]
[![Tests Results][tests]][tests-url]
[![Coverage status][coverage]][coverage-url]

[![Semantic Versioning](https://img.shields.io/badge/Semantic%20Versioning-v2.0.0-green.svg?logo=semver)](https://semver.org/lang/ru/spec/v2.0.0.html)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-v1.0.0-yellow.svg?logo=git)](https://conventionalcommits.org)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://makeapullrequest.com)

[![VS Code](https://img.shields.io/badge/Visual_Studio_Code-0078D4?logo=visual%20studio%20code)](https://code.visualstudio.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-333333.svg?logo=typescript)](http://www.typescriptlang.org/)
[![EditorConfig](https://img.shields.io/badge/EditorConfig-333333.svg?logo=editorconfig)](https://editorconfig.org)
[![ESLint](https://img.shields.io/badge/ESLint-3A33D1?logo=eslint)](https://eslint.org)

[github-release]: https://img.shields.io/github/v/release/IT-Service-NPM/remark-include.svg?sort=semver&logo=github

[github-release-url]: https://github.com/IT-Service-NPM/remark-include/releases

[npm]: https://img.shields.io/npm/v/@it-service-npm/remark-include.svg?logo=npm

[npm-url]: https://www.npmjs.com/package/@it-service-npm/remark-include

[deps]: https://img.shields.io/librariesio/release/npm/@it-service-npm/remark-include

[deps-url]: https://libraries.io/npm/@it-service-npm%2Fremark-include

[size]: https://packagephobia.com/badge?p=@it-service-npm/remark-include

[size-url]: https://packagephobia.com/result?p=@it-service-npm/remark-include

[build]: https://github.com/IT-Service-NPM/remark-include/actions/workflows/ci.yml/badge.svg?branch=main

[build-url]: https://github.com/IT-Service-NPM/remark-include/actions/workflows/ci.yml

[tests]: https://img.shields.io/endpoint?logo=node.js&url=https%3A%2F%2Fgist.githubusercontent.com%2Fsergey-s-betke%2Fd70e4de09a490afc9fb7a737363b231a%2Fraw%2Fremark-include-junit-tests.json

[tests-url]: https://github.com/IT-Service-NPM/remark-include/actions/workflows/ci.yml

[coverage]: https://coveralls.io/repos/github/IT-Service-NPM/remark-include/badge.svg?branch=main

[coverage-url]: https://coveralls.io/github/IT-Service-NPM/remark-include?branch=main

With this plugin, you can use `::include{file=./included.md}`
[GitLab transclusion syntax](https://docs.gitlab.com/user/markdown/#includes)
statements to compose markdown files together.

Additional features:

- GitLab `::include` directives are ignored inside the included file,
  but this plugin **supports recursive transclusion**
- It is possible to use globs (`::include{file=./included*.md}`)
  in `file` attribute
- New attribute `optional`.
  This attribute prevents fatal errors from occurring
  when the file (or files) specified by the `file` attribute does not exist
- Relative images and links in the imported files will have their paths rewritten
  to be relative to the original document rather than the imported file
  (with [`@it-service-npm/remark-relative-url-adjustment`](https://www.npmjs.com/package/@it-service-npm/remark-relative-url-adjustment))
- An imported markdown file will “inherit” the heading levels.
  If the `::include{file=./included.md}` statement happens under Heading 2,
  for example, any heading 1 in the included file
  will be “translated” to have header level 3
  (with [`@it-service-npm/remark-heading-adjustment`](https://www.npmjs.com/package/@it-service-npm/remark-heading-adjustment))

This plugin is a modern version of
[`remark-import`](https://github.com/BrekiTomasson/remark-import) plugin
and [`remark-include`](https://github.com/Qard/remark-include) plugin,
written in Typescript, and compatible with Remark v15.

There are two plugins: `remarkInclude` (preferred) and `remarkIncludeSync`.

> [!IMPORTANT]
> [`remark-directive`][] plugin expected before
> `@it-service-npm/remark-include`.
>
> This package provides two plugins presets:
>
> - `remarkIncludePreset`. This preset contains:
>
>   - `remarkInclude`
>   - `remarkDirective`
>   - `remarkHeadingsAdjustment`
>   - `remarkRelativeUrlsAdjustment`
>   - `remarkRelativeCodePathsAdjustment`
> - `remarkIncludePresetSync`. This preset contains:
>
>   - `remarkIncludeSync`
>   - `remarkDirective`
>   - `remarkHeadingsAdjustment`
>   - `remarkRelativeUrlsAdjustment`
>   - `remarkRelativeCodePathsAdjustment`

[`remark-directive`]: https://www.npmjs.com/package/remark-directive

## Contents

- [Install](#install)
- [Examples](#examples)
  - [Transclusion or including markdown sub-documents for reuse](#transclusion-or-including-markdown-sub-documents-forreuse)
  - [Recursive transclusion](#recursive-transclusion)
  - [Adjust the heading levels](#adjust-the-headinglevels)
  - [Include multiple files with glob](#include-multiple-files-withglob)
  - [Updating relative path for links, images](#updating-relative-path-for-linksimages)
  - [Updating relative path for code files](#updating-relative-path-for-codefiles)
- [API](#api)
  - [Public API Report File for “@it-service-npm/remark-include”](#public-api-report-file-forit-service-npmremark-include)
- [License](#license)

## Install

```sh
npm install --save-dev @it-service-npm/remark-include
```

## Examples

### Transclusion or including markdown sub-documents for reuse

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

### Recursive transclusion

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

### Adjust the heading levels

`@it-service-npm/remark-include` adjusts the headings level within the included content.

An imported markdown file will “inherit” the headings level.
If the `::include{file=./included.md}` statement happens under Heading 2,
for example, any Heading 1 in the included file
will be “translated” to have header level 3
(with [`@it-service-npm/remark-heading-adjustment`](https://www.npmjs.com/package/@it-service-npm/remark-heading-adjustment))

Source files:

main.md:

```markdown
# Main file

Hello. I am an main markdown file with `::include` directive.

::include{file=./included1.md}

## H2 in main file

End of main file.
```

included1.md:

```markdown
# included1 file H1 (should be changed to H2 in output file)

Hello. I am the included1.

## in included1 file H2 (should be changed to H3 in output file)

::include{file=./included2.md}

## in included1 file after included2 H2 (should be changed to H3 in output file)

text text text.
```

included2.md:

```markdown
# included2 file H1 (should be changed to H4 in output file)

Hello. I am the included2.
```

Remark output:

```markdown
# Main file

Hello. I am an main markdown file with `::include` directive.

## included1 file H1 (should be changed to H2 in output file)

Hello. I am the included1.

### in included1 file H2 (should be changed to H3 in output file)

#### included2 file H1 (should be changed to H4 in output file)

Hello. I am the included2.

### in included1 file after included2 H2 (should be changed to H3 in output file)

text text text.

## H2 in main file

End of main file.
```

### Include multiple files with glob

`@it-service-npm/remark-include` supports
[glob](https://nodejs.org/api/fs.html#fsglobpattern-options-callback)
as `file` attribute value.

Source files:

main.md:

```markdown
# main file

Hello. I am an main markdown file with `::include` directive.

::include{file=./included*.md}

_That_ should do it!
```

included1.md:

```markdown
# included 1

Hello. I am the included1.
```

included2.md:

```markdown
# included 2

Hello. I am the included2.
```

included3.md:

```markdown
# included 3

Hello. I am the included3.
```

Remark output:

```markdown
# main file

Hello. I am an main markdown file with `::include` directive.

## included 1

Hello. I am the included1.

## included 2

Hello. I am the included2.

## included 3

Hello. I am the included3.

*That* should do it!
```

### Updating relative path for links, images

Relative images and links in the imported files will have their paths rewritten
to be relative to the original document rather than the imported file.

Source files:

main.md:

```markdown
Hello. I am an main markdown file with `::include` directive.

::include{file=./subfolder1/included.md}

_That_ should do it!
```

included.md:

```markdown
Hello. I am the included. Test image:

![Test local image](test-image.png)

![Test local image with space](test%20image.png)

![Test web image](https://img.shields.io/badge/github-repo-blue?logo=github)
```

Remark output:

```markdown
Hello. I am an main markdown file with `::include` directive.

Hello. I am the included. Test image:

![Test local image](subfolder1/test-image.png)

![Test local image with space](subfolder1/test%20image.png)

![Test web image](https://img.shields.io/badge/github-repo-blue?logo=github)

*That* should do it!
```

### Updating relative path for code files

Relative images and links in the imported files will have their paths rewritten
to be relative to the original document rather than the imported file.

Source files:

main.md:

```markdown
Hello. I am an main markdown file with `::include` directive.

::include{file=./subfolder1/included.md}

_That_ should do it!
```

included.md:

````markdown
Hello. I am the included. Test for code file path rebasing:

```typescript file=../../example.ts
import { remark } from 'remark';
import * as vFile from 'to-vfile';
import remarkDirective from 'remark-directive';
import { remarkInclude } from '@it-service-npm/remark-include';
import type { VFile } from 'vfile';

export async function remarkDirectiveUsingExample(
  filePath: string
): Promise<VFile> {
  return remark()
    .use(remarkDirective)
    .use(remarkInclude)
    .process(await vFile.read(filePath));
};

```

Code with file path with spaces and lines range:

```typescript file=code\ with\ spaces.ts#L11-L15
  return remark()
    .use(remarkDirective)
    .use([codeImport])
    .use(remarkInclude)
    .process(await vFile.read(filePath));
```

And code without file attribute:

```typescript
import { remark } from 'remark';
import * as vFile from 'to-vfile';
import remarkDirective from 'remark-directive';
import { remarkInclude } from '@it-service-npm/remark-include';
import type { VFile } from 'vfile';
```
````

Remark output:

````markdown
Hello. I am an main markdown file with `::include` directive.

Hello. I am the included. Test for code file path rebasing:

```typescript file=../example.ts
import { remark } from 'remark';
import * as vFile from 'to-vfile';
import remarkDirective from 'remark-directive';
import { remarkInclude } from '@it-service-npm/remark-include';
import type { VFile } from 'vfile';

export async function remarkDirectiveUsingExample(
  filePath: string
): Promise<VFile> {
  return remark()
    .use(remarkDirective)
    .use(remarkInclude)
    .process(await vFile.read(filePath));
};

```

Code with file path with spaces and lines range:

```typescript file=subfolder1/code\ with\ spaces.ts#L11-L15
  return remark()
    .use(remarkDirective)
    .use([codeImport])
    .use(remarkInclude)
    .process(await vFile.read(filePath));
```

And code without file attribute:

```typescript
import { remark } from 'remark';
import * as vFile from 'to-vfile';
import remarkDirective from 'remark-directive';
import { remarkInclude } from '@it-service-npm/remark-include';
import type { VFile } from 'vfile';
```

*That* should do it!
````

## API

Please, read the [API reference](/docs/index.md).

### Public API Report File for “@it-service-npm/remark-include”

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import type { Plugin } from 'unified';
import type { Preset } from 'unified';
import type { Root } from 'mdast';

// @public
export const remarkInclude: Plugin<[], Root>;

// @public
const remarkIncludePreset: Preset;
export default remarkIncludePreset;
export { remarkIncludePreset }

// @public
export const remarkIncludePresetSync: Preset;

// @public
export const remarkIncludeSync: Plugin<[], Root>;

```

## License

[MIT](LICENSE) © [Sergei S. Betke](https://github.com/sergey-s-betke)
