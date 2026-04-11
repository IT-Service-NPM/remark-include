# Adjust the heading levels

`@it-service-npm/remark-include` adjust the heading levels within the included content.

Source files:

main.md:

```markdown file=fixtures/main.md
# Main file

Hello. I am an main markdown file with `::include` directive.

::include{file=./included1.md}

## H2 in main file

End of main file.

```

included1.md:

```markdown file=fixtures/included1.md
# included1 file H1 (should be changed to H2 in output file)

Hello. I am the included1.

## in included1 file H2 (should be changed to H3 in output file)

::include{file=./included2.md}

## in included1 file after included2 H2 (should be changed to H3 in output file)

text text text.

```

included2.md:

```markdown file=fixtures/included2.md
# included2 file H1 (should be changed to H4 in output file)

Hello. I am the included2.

```

Remark output:

```markdown file=snapshots/output.md
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
