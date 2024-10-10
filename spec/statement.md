# Statement

## Table of Contents

* [Syntax](#syntax)
  * [StatementSequence](#statementsequence)
* [Procedures](#procedures)
  * [Consuming a Statement](#consuming-a-statement)
  * [Consuming a declaration value](#consuming-a-declaration-value)
  * [Scss statements](#scss-statements)
  * [Indented statements](#indented-statements)

## Syntax

### StatementSequence

<x><pre> **StatementSequence**     ::= (StatementWithBlock |
StatementWithoutBlock)+ </pre></x>

> A StatementSequence represents the statements at a given level, either inside
> a block, or at the top level.

## Procedures

### Consuming a Statement

This algorithm consumes input from a stream of [code points] and returns a
single Statement. It takes a `syntax` of `scss` or `indented`, and an optional
boolean flag, `root`, which indicates whether it's at the root of the
stylesheet, and defaults to `false`.

* Let `sequence` be an empty array.

* While there is input:

  * If the input starts with `@`, consume an AtRule with `root` set to `root`,
      and add it to `sequence`.
  
  * If `syntax` is `indented`:

    * If the input starts with `+`, and [consuming an identifier] does not throw
      an error, consume an IncludeRule and add it to `sequence`. If it throws an
      error, consume a StyleRule and add it to `sequence`.

    [consuming an identifier]: ./syntax.md#consuming-an-identifier

    * If the input starts with `=`, consume a MixinRule, and add it to `sequence`.

  * If the input is a StatementWithBlock, consume a StatementSequence for the
    indented syntax according to its specific definition, with the contents of
    the block as input, and add it to `sequence`.

  * Otherwise, consume a StatementWithoutBlock according to its specific
    definition and add it to `sequence`.

* Return `sequence`.

### Consuming a declaration value

This algorithm takes a consumes input from a stream of [code points] and returns
a nested array of statements. It takes a `syntax` of `indented` or `scss`.

> Based on _interpolatedDeclarationValue

* Let `buffer` be a Buffer.

* Let `brackets` be an empty array.

* While there is input:

  * If the input starts with `\`, consume an [escaped code point] and add it to `buffer`.
  
  [escaped code point]: ./syntax.md#consuming-an-escaped-code-point

  * Otherwise, if the input starts with `'` or `"`, consume a Sass String until finding a matching end quote, and add it to `buffer`.

  * Otherwise, if the input starts with `/*`, consume a loud comment until finding `*/` and add it to `buffer`.

  * Otherwise, if the input starts with `//`, consume until a new line is consumed, and add nothing to `buffer`.

  > TODO: This is conditional on `silentComments`- explore more

  * Otherwise, if the input starts with `/`, consume it and add `/` to `buffer`.

  * Otherwise, if the input starts with `#{`, add the result of [Consuming an Interpolated Identifier] to `buffer`.

  [Consuming an Interpolated Identifier]: ./syntax.md#consuming-an-interpolated-identifier

  * Otherwise, if... White space is collapsed, unless it's indentation.

  > Todo- flesh out

  * Otherwise, if the input starts with a line break:

    * If `syntax` is `indented`, set input to `null` to end the loop.

    * Otherwise, collapse multiple newlines into one.

    > Todo- flesh out

  * Otherwise, if the input starts with `{` and `allowOpenBrace` is false, set input to `null` to end the loop.

  > Todo: Declare allowOpenBrace. Why is allowOpenBrace false? Certain at rules

  * Otherwise, if the input starts with `(`, `{` or `[`, consume it and add it to the buffer. Add it to the end of `brackets`.

  * Otherwise, if the input starts with `)`, `}` or `]`, consume it and add it to the buffer. Remove the last item from `brackets`. If it does not match the input, set the input to `null` to end the loop.

  > TODO: cleanup bracket matching. Also how does this interact with StatementWithBlock?

  * Otherwise, if the input starts with `;`:

    * If `brackets` is empty and not in a place where semicolons are supported,
      set the input to `null` to end the loop.

    > TODO: Flesh out semicolon support.

    * Otherwise, consume it and add it to the `buffer`.

  * Otherwise, if the input starts with `:`:

    * If `brackets` is empty and not in a place where colons are supported,
      set the input to `null` to end the loop.

    > TODO: Flesh out colon support.

    * Otherwise, consume it and add it to the `buffer`.

  * Otherwise, if the input starts with `url(` or `url-prefix(` and contains a URL, consume the URL and add it to the buffer.

  > Todo: this needs more specificity

  * Let `identifier` be the result of [Consuming an Identifier]. If it does not throw an error, consume `identifier` and add it to `buffer`.

  * Otherwise, consume the next code point and add it to `buffer`.

* Return an interpolation of `buffer`.

### Scss statements

This algorithm takes a string `text` and returns an array of Statements.

* Let `statements` be an empty array.

* Consume any preceding whitespace.

* While `text` is not empty:

  * If `text` starts with `$`, consume a Variable Declaration Without Namesspace.

  * Otherwise, if `text` starts with `//`, consume a Silent Comment and add it to `statements`. Consume any whitespace.

  * Otherwise, if `text` starts with `/*`, consume a Loud Comment and add it to `statements`. Consume any whitespace.

  * Otherwise, if `text` starts with `/`, consume a Statement if one exists and add it to `statements`.

  * Otherwise, if `text` starts with `;`, consume it and any following white space.

  * Otherwise, consume a Statement if one exists, and add it to `statements`.

* Return `statements`.

### Indented statements

This algorithm takes a string `text` in the indented syntax and returns an array of Statements.

* If `text` starts with a tab or space, throw an error.

* Let `statements` be an empty array.

* While `text` is not empty:

  * If `text` starts with an empty line, consume it.

  * Otherwise, if `text` starts with `$`, consume a Variable Declaration Without Namesspace and add it to `statements`.

  * Otherwise, if `text` starts with `//`, consume a Silent Comment and add it to `statements`.

  * Otherwise, if `text` starts with `/*`, consume a Loud Comment and add it to `statements`.

  * Otherwise, consume the first child in `text` and add it to `statements`.

  > Consuming the child is done by ### Consuming a StatementSequence, which is named incorrectly.

  > TODO- Indentation tracking

* Return `statements`.
