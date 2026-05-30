# Adjust the heading levels

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
