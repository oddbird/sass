# Statement

## Table of Contents

* [Definitions](#definitions)
  * [Current indentation level](#current-indentation-level)
  * [Document indentation character](#document-indentation-character)
* [Syntax](#syntax)
  * [Statements](#statements)
  * [Block](#block)
  * [Whitespace](#whitespace)
  * [Indentation](#indentation)
  * [StatementSequence](#statementsequence)
* [Procedures - old](#procedures---old)
  * [Consuming a Statement Sequence in the `scss` syntax](#consuming-a-statement-sequence-in-the-scss-syntax)
  * [Consuming a Statement in the `scss` syntax](#consuming-a-statement-in-the-scss-syntax)
  * [Consuming a Statement Without Block in the `scss` syntax](#consuming-a-statement-without-block-in-the-scss-syntax)
  * [Consuming a Statement With Block in the `scss` syntax](#consuming-a-statement-with-block-in-the-scss-syntax)
  * [Consuming a Statement Sequence in the `indented` syntax](#consuming-a-statement-sequence-in-the-indented-syntax)
  * [Consuming a Statement in the `indented` syntax](#consuming-a-statement-in-the-indented-syntax)
  * [Consuming a Statement Without Block in the `indented` syntax](#consuming-a-statement-without-block-in-the-indented-syntax)
  * [Consuming a Statement With Block in the `indented` syntax](#consuming-a-statement-with-block-in-the-indented-syntax)
* [Spec extracted from code](#spec-extracted-from-code)
  * [Consuming a Statement](#consuming-a-statement)
  * [Consuming a Variable Declaration, Declaration, or StyleRule](#consuming-a-variable-declaration-declaration-or-stylerule)
  * [Consuming a declaration value](#consuming-a-declaration-value)

## Definitions

### Current indentation level

The `current indentation level` is the count of the [`documentation indentation character`] between a new line and any non-whitespace characters. Changes in the indentation level are used by the indented syntax to start and end blocks of statements.

> TODO: Needs to be clear this is the last level, against which the next line is compared

[`documentation indentation character`]: #document-indentation-character

### Document indentation character

The `document indentation character` is the character used for calculating the [`current indentation level`], and is either a space or tab character.

[`current indentation level`]: #current-indentation-level

It is defined as the first tab or space character used as an [IndentMore] production.

In the indented syntax, a document may not begin with whitespace, and no character other than the `document indentation character` may be used for indentation.

## Syntax

### Statements

<x><pre>
**ScssStatements**      ::= (Statement ';'?¹)*Statement?
**IndentedStatements**  ::= (Statement IndentedSame?¹)* Statement?
**Statements**          ::= ScssStatements | IndentedStatements²
</pre></x>

1: This production is mandatory unless the previous `Statement` is a `LoudComment` or `SilentComment`, or its final production is a `Block`.

2: Only the production for the current syntax is valid.

If a `WhitespaceComment` would be ambiguous with a `Statement` in this rule, parse it preferentially as a `Statement`.

### Block

<x><pre>
**ScssBlock**      ::= '{' ScssStatements '}'
**IndentedBlock**  ::= IndentMore IndentedStatements IndentLess
**Block**          ::= ScssBlock | IndentedBlock¹
</pre></x>

1: Only the production for the current syntax is valid.

### Whitespace

<x><pre>
**LineBreaks**          ::= CarriageReturn | LineFeed | FormFeed
**IndentCharacter**     ::= Space | Tab
**Whitespace**          ::= LineBreaks | Indentation
</pre></x>

> TODO >  make it clear that newlines (and comments that contain newlines) don't currently count as whitespace for the indented syntax.

### Indentation

<x><pre>
**IndentSame**      ::= [IndentCharacter]{ Current }
**IndentLess**      ::= [IndentCharacter]{ 0, Current - 1 }
**IndentMore**      ::= [IndentCharacter]{ Current, }
</pre></x>

[IndentCharacter]: #whitespace

The [IndentCharacter] must be the [Document indentation character].

[Document indentation character]: #document-indentation-character

Current is the [current indentation level]. After consuming an Indent* production, the [current indentation level] is set to the number of [IndentCharacter] found.

> Use *Less and*More rather than directional (up, down, lower, below) to
> prevent ambiguity.

### StatementSequence

<x><pre> **StatementSequence**     ::= (StatementWithBlock |
StatementWithoutBlock)+ </pre></x>

> A StatementSequence represents the statements at a given level, either inside
> a block, or at the top level.

## Procedures - old

### Consuming a Statement Sequence in the `scss` syntax

This algorithm consumes input from a stream of [code points] and returns a
Statement Sequence. It takes a boolean `inBlock` which defaults to `false`.

[code points]: https://infra.spec.whatwg.org/#code-point

* Let `statements` be an empty array.

* Consume any preceding whitespace.

* While input is not empty:

  * Add the result of [Consuming a Statement in the `scss` syntax] to `statements`.

  [Consuming a Statement Sequence in the `scss` syntax]: #consuming-a-statement-sequence-in-the-scss-syntax

  * Consume any whitespace.

  * If `inBlock` is true and the next code point is `}`, return `statements`.

* If `inBlock` is true, throw an error.

* Return `statements`.

### Consuming a Statement in the `scss` syntax

This algorithm consumes input from a stream of [code points] in the Scss syntax
and returns a Statement.

Return the result of [Consuming a Statement Without Block] or [Consuming a Statement With Block] according to the Statement's specific definition.

[Consuming a Statement Without Block]: #consuming-a-statement-without-block-in-the-scss-syntax
[Consuming a Statement With Block]: #consuming-a-statement-with-block-in-the-scss-syntax

### Consuming a Statement Without Block in the `scss` syntax

This algorithm consumes input from a stream of [code points] in the Scss syntax
and returns a Statement Without Block.

* Let `statement` be an empty buffer.

* While there is input:

  * If the next code point is whitespace, consume it.
  
  * If the next code point is `;`, consume it and return `statement`.
  
  * If the next code point is `}`, return `statement`.

  * Otherwise, add the next code point to `statement`.

* Return `statement`.

### Consuming a Statement With Block in the `scss` syntax

This algorithm consumes input from a stream of [code points] in the Scss syntax
and returns a Statement With Block.

* Let `prelude` be the result be the result of consuming input until a `{` that is not preceded by a `#` is consumed.

* Let `children` be the result of [Consuming a Statement Sequence in the `scss` syntax] with `inBlock` set to true.

* Return a StatementWithBlock with `prelude` and `children`.

### Consuming a Statement Sequence in the `indented` syntax

This algorithm consumes input from a stream of [code points] and returns a Statement Sequence. It takes an `indentationLevel` integer that defaults to `0`.

* If `indentationLevel` is `0` and input starts with a tab or space, throw an error.

* Let `statements` be an empty array.

* Let `tabCount` and `spaceCount` be 0.

* While there is input:

  * If the next code point is an empty line, consume it.

  * If the next code point is a tab, consume it, and increment `tabCount` by 1.

  * If the next code point is a space, consume it, and increment `spaceCount` by
    1.

  * If `spaceCount` and `tabCount` are both greater than 0, throw an error.

  * Let `newIndentationLevel` be the maximum value of `spaceCount` and `tabCount`.

  * If `newIndentationLevel` is less than `indentationLevel`, return `statements`.

  * Otherwise, add the result of [Consuming a Statement in the `indented` syntax] to `statements` with an `indentationLevel` of `indentationLevel`.

  [Consuming a Statement in the `indented` syntax]: #consuming-a-statement-sequence-in-the-indented-syntax

* Return `statements`.

### Consuming a Statement in the `indented` syntax

This algorithm consumes input from a stream of [code points] in the indented syntax
and returns a Statement. It takes an integer `indentationLevel` that defaults to 0.

Return the result of [Consuming a Statement Without Block in the `indented`
syntax] or [Consuming a Statement With Block in the `indented` syntax] with
`indentationLevel` according to the Statement's specific definition.

[Consuming a Statement Without Block in the `indented` syntax]: #consuming-a-statement-without-block-in-the-indented-syntax
[Consuming a Statement With Block in the `indented` syntax]: #consuming-a-statement-with-block-in-the-indented-syntax

### Consuming a Statement Without Block in the `indented` syntax

This algorithm consumes input from a stream of [code points] in the indented syntax
and returns a Statement Without Block.

* Let `statement` be an empty buffer.

* While there is input:

  * If the next code point is a new line, return `statement`.

  * Otherwise, add the next code point to `statement`.

* Return `statement`.

### Consuming a Statement With Block in the `indented` syntax

This algorithm consumes input from a stream of [code points] in the indented syntax
and returns a Statement With Block. It takes an integer `indentationLevel`.

* Let `prelude` be the result of consuming input until a new line code point is consumed.

* Let `children` be the result of [Consuming a Statement Sequence in the `indented` syntax] with `indentationLevel` of `indentationLevel + 1`.

[Consuming a Statement Sequence in the `indented` syntax]: #consuming-a-statement-sequence-in-the-indented-syntax

* Return a Statement With Block with `prelude` and `children`.

## Spec extracted from code

The following sections describe the parser code, and were created in order to
understand existing behavior. They are preserved for reference for now, but will
likely be removed before merging. If they are useful, missing parts will need to
be filled in.

### Consuming a Statement

This algorithm consumes input from a stream of [code points] and returns a
single Statement. It may be a StatementWithBlock or a StatementWithoutBlock. It
takes a `syntax` of `scss` or `indented`, and an optional boolean flag, `root`,
which indicates whether it's at the root of the stylesheet, and defaults to
`false`.

* If the input starts with `@`, consume an AtRule with `root` set to `root`, and
    return it.

* Otherise, if `syntax` is `indented` and the input starts with `+`, and
    [consuming an identifier] does not throw an error, consume an IncludeRule
    and return it. If it throws an error, consume a StyleRule and return it.

  [consuming an identifier]: ./syntax.md#consuming-an-identifier

* Otherise, if `syntax` is `indented` and the input starts with `=`, consume a
  MixinRule and return it.

* Otherwise, if in StyleRule, in UnknownAtRule, in Mixin, or ContentBlock,
  consume a Variable Declaration, Declaration, or StyleRule and return it.

> TODO: Specify the booleans.

* Otherwise, consume a Variable Declaration or StyleRule and return it.

### Consuming a Variable Declaration, Declaration, or StyleRule

This algorithm consumes input from a stream of [code points] and returns a Variable Declaration, Declaration, or StyleRule. It takes a `syntax` of `indented` or `scss`.

* If `syntax` is `indented` and the input starts with `\`, return the result of [Consuming a Style Rule].

[Consuming a Style Rule]: ./style-rules.md#consuming-a-style-rule

* Let `buffer` be an empty buffer.

* If input starts with a character that could start a property hack (`*`, `:`, `#`, `.`), consume it, and add it to `buffer`. Set `isHack` to true.

* If the input does not start with a potential [Interpolated Identifier], return `buffer`.

[Interpolated Identifier]: syntax.md#interpolatedidentifier

* If `isHack` is true or the input does not start with a CSS identifier, add the
  result of [Consuming an Interpolated Identifier] to `buffer`.

[Consuming an Interpolated Identifier]:./syntax.md#consuming-an-interpolated-identifier

* Otherwise, let `identifier` be the result of consuming an identifier.

* If input starts with `$`, consume a [variable] with `identifier` as the namespace, and return it.

[variable]: ./variables.md#syntax

* If input starts with an Interpolated Identifier Body, interpolate it, add it to `identifier`, and add it to `buffer`.

* If the input starts with `/*`, consume a loud comment and add it to `buffer`.

* Let `whitespace` be an empty buffer.

* Consume any whitespace and add it to `whitespace`.

* If the input doesn't start with `:`:

  * If `whitespace` is not empty, add a space to `buffer`, and return it.

  * Otherwise, return `buffer`.

* Let `result` be the result of consuming a [Declaration].

[Declaration]: declarations.md

> Todo: this part is incomplete

* Let `couldBeSelector` be true if there is no whitespace after the colon (what
  colon?) and the input starts with a possible identifier.

* Let `expression` be the result of consuming an expression.

* If the `input` starts with a block of children:
  
  * If `couldBeSelector` is true, this is a selector. (And do what?)

  * Otherwise, if the input is not at the end of a statement, (do what?)

  * > Todo: the catch on line 427

* If the input has children, return them.

* If the input does not start with a statement separator, throw an error.

* Otherwise, return a Declaration with name `buffer` (is this correct?) and value of `expression`.

### Consuming a declaration value

This algorithm consumes input from a stream of [code points] and returns a
declaration value. It takes a `syntax` of `indented` or `scss`.

> Based on _interpolatedDeclarationValue

* Let `buffer` be a Buffer.

* Let `brackets` be an empty array.

* While there is input:

  * If the input starts with `\`, consume an [escaped code point] and add it to
    `buffer`.
  
  [escaped code point]: ./syntax.md#consuming-an-escaped-code-point

  * Otherwise, if the input starts with `'` or `"`, consume a Sass String until
    finding a matching end quote, and add it to `buffer`.

  * Otherwise, if the input starts with `/*`, consume a loud comment until
    finding `*/` and add it to `buffer`.

  * Otherwise, if the input starts with `//`, consume until a new line is
    consumed, and add nothing to `buffer`.

  > TODO: This is conditional on `silentComments`- explore more

  * Otherwise, if the input starts with `/`, consume it and add `/` to `buffer`.

  * Otherwise, if the input starts with `#{`, add the result of [Consuming an
    Interpolated Identifier] to `buffer`.

  * Otherwise, if... White space is collapsed, unless it's indentation.

  > Todo- flesh out

  * Otherwise, if the input starts with a line break:

    * If `syntax` is `indented`, set input to `null` to end the loop.

    * Otherwise, collapse multiple newlines into one.

    > Todo- flesh out

  * Otherwise, if the input starts with `{` and `allowOpenBrace` is false, set
    input to `null` to end the loop.

  > Todo: Declare allowOpenBrace. Why is allowOpenBrace false? Certain at rules

  * Otherwise, if the input starts with `(`, `{` or `[`, consume it and add it
    to the buffer. Add it to the end of `brackets`.

  * Otherwise, if the input starts with `)`, `}` or `]`, consume it and add it
    to the buffer. Remove the last item from `brackets`. If it does not match
    the input, set the input to `null` to end the loop.

  > TODO: cleanup bracket matching. Also how does this interact with
  > StatementWithBlock?

  * Otherwise, if the input starts with `;`:

    * If `brackets` is empty and not in a place where semicolons are supported,
      set the input to `null` to end the loop.

    > TODO: Flesh out semicolon support.

    * Otherwise, consume it and add it to the `buffer`.

  * Otherwise, if the input starts with `:`:

    * If `brackets` is empty and not in a place where colons are supported, set
      the input to `null` to end the loop.

    > TODO: Flesh out colon support.

    * Otherwise, consume it and add it to the `buffer`.

  * Otherwise, if the input starts with `url(` or `url-prefix(` and contains a
    URL, consume the URL and add it to the buffer.

  > Todo: this needs more specificity

  * Let `identifier` be the result of [Consuming an Identifier]. If it does not
    throw an error, consume `identifier` and add it to `buffer`.

  * Otherwise, consume the next code point and add it to `buffer`.

* Return an interpolation of `buffer`.
