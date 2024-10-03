# Indented Syntax Improvements

*([Issue](https://github.com/sass/sass/issues/216))*

This proposal improves the indented syntax format, allowing multiline expressions, semicolons, and curly braces.

## Table of Contents

* [Background](#background)
* [Summary](#summary)
  * [Explicit statement ends](#explicit-statement-ends)
  * [Places where a line break must create a statement break](#places-where-a-line-break-must-create-a-statement-break)
    * [After a SassScript value](#after-a-sassscript-value)
    * [After a non-enclosed list begins](#after-a-non-enclosed-list-begins)
    * [At-rules](#at-rules)
  * [Design Decisions](#design-decisions)
* [Syntax](#syntax)
  * [Existing Syntax](#existing-syntax)
    * [Syntax-specific productions](#syntax-specific-productions)
      * [Indented format](#indented-format)
      * [SCSS format](#scss-format)
    * [Statement](#statement)
    * [Block](#block)
  * [Clarified Syntax](#clarified-syntax)
  * [Syntax Changes](#syntax-changes)
* [Procedures](#procedures)
  * [Parsing text as Sass](#parsing-text-as-sass)
  * [Productions of `StatementMayEnd`](#productions-of-statementmayend)

## Background

> This section is non-normative.

The indented `.sass` syntax uses whitespace to end statements (linebreaks) and
indicate nesting (indentation). While this syntax is preferred by some authors,
it presents authoring challenges, specifically around long lists.

## Summary

> This section is non-normative.

In the Sass indented syntax, line breaks always end a statement, which limits
how authors can format their code. However, the parser can tell from context
whether a statement can end at a given point. This document proposes that line
breaks only end statements when a statement can end, and in any other case, a
line break is treated as continuing white space.

In addition, this proposal adds semicolons to the indented syntax as explicit
statement ends, and allows curly braces to wrap blocks.

### Explicit statement ends

The `ExplicitStatementEnd`, `;`, will always cause a statement break. If one
occurs in a context where a statement can not end, an error will be thrown.

### Places where a line break must create a statement break

By design, line breaks are ignored as meaningless white space, except in
contexts where the semantics define that a statement may end. When an author
inserts a line break they intend to be meaningless in a position where a
statement may end, the statement will end, and parsing will most likely fail on
the subsequent text. The following places are where line breaks will cause
statements to end.

#### After a SassScript value

In a simple declaration, `$foo: bar \n`, the line break must cause the statement
to end.

This may be surprising in more complex situations, for instance, with binary
operators. `$foo: 3\n+ 4\n` ends the statement after `3`, but `$foo: 3 +\n4\n`
ends the statement after `4`. Wrapping with the order of operations operator
`()` allows authors more flexibility with `$foo: (3\n+ 4)`.

This also applies to flow control at-rules. `@if $a \n and $b` would end the
statement after `$`, but `@if ($a \n and $b)` can be parsed.

#### After a non-enclosed list begins

A line break in a list that is not in a `BracketedListExpression` or enclosed in `()` must
cause a statement break.

`$var: 1 2\n3` and `$var: 1, 2\n, 3` can not be parsed to determine when the
statement has ended. Alternates `$var: (1 2\n3)`, `$var: [1 2\n3]`, and `$var:
(1, 2,\n 3)` can be parsed.

Comma separated lists can not use a trailing comma to signify that a list will
continue after the line break, as this would break existing stylesheets with
trailing commas.

Because arguments to functions and mixins are already wrapped in `()`, line
breaks in arguments do not need to cause a statement break. Interpolations are
wrapped in `#{}` so line breaks do not need to end statements.

#### At-rules

For any at-rule that is supported by native CSS, line breaks after the `@` and
before a block or statement end are not supported. This includes `@include`,
(which overlaps with Sass), `@supports`, `@media`, `@keyframes` and any unknown at rule.

These rules should be emitted as is, with no special handling from Sass.

### Design Decisions

While some CSS at-rules may have contexts where a line break would not be
meaningful, custom handling of line breaks is outside of the scope of this
proposal. For instance, `@media (hover: hover) and \n (color)` is not supported,
even though line breaks do not end statements after boolean operators in general
SassScript.

## Syntax

The syntax impacted by these changes has not been specified, so this proposal first defines the existing syntax, and then the proposed changes.

### Existing Syntax

#### Syntax-specific productions

##### Indented format

<x><pre>
**NewLine**        ::= LineFeed | CarriageReturn | FormFeed
**StatementEnd**   ::= NewLine
**BlockStart**     ::= Indent
**BlockEnd**       ::= Dedent
</pre></x>

##### SCSS format

<x><pre>
**ExplicitStatementEnd**   ::= ';'
**StatementEnd**           ::= ExplicitStatementEnd | BlockEnd
**BlockStart**             ::= '{'
**BlockEnd**               ::= '}'
</pre></x>

#### Statement

<x><pre>
**Statements**     ::= Statement+
**Statement**      ::= Value StatementEnd
</pre></x>

#### Block

`*Rule` is any nonterminal rule, including `MixinRule`, `UseRule`,
and`UnknownAtRule`.

<x><pre>
**BlockPrelude**   ::= Selector | *Rule
**Block**          ::= BlockPrelude BlockStart BlockContents BlockEnd
**BlockContents**  ::= (Statement | Block)+
</pre></x>

### Clarified Syntax

This proposal defines replacements for productions that only defined syntax for the SCSS format.

[StandardDeclaration] is replaced.

[StandardDeclaration]: ../spec/declarations.md#syntax

<x><pre>
**StandardDeclaration** ::= [InterpolatedIdentifier]¹ ':' (Value | Value? BlockStart Statements BlockEnd )
</pre></x>

1. This may not begin with "--".

[UnknownAtRule] is replaced.

[UnknownAtRule]: ../spec/at-rules/unknown.md#syntax

<x><pre>
**UnknownAtRule** ::= '@' [InterpolatedIdentifier] InterpolatedValue?
&#32;                   (BlockStart Statements BlockEnd)?
</pre></x>

[MixinRule] is replaced.

[MixinRule]: ../spec/at-rules/mixin.md#syntax

<x><pre>
**MixinRule** ::= '@mixin' [\<ident-token>] ArgumentDeclaration? BlockStart Statements BlockEnd
</pre></x>

[ContentBlock] is replaced.

[ContentBlock]: ../spec/at-rules/mixin.md#syntax-1

<x><pre>
**ContentBlock**     ::= UsingDeclaration? BlockStart Statements BlockEnd
</pre></x>

[FunctionRule] is replaced.

[FunctionRule]: ../spec/at-rules/function.md#syntax

<x><pre>
**FunctionRule** ::= '@function' [\<ident-token>] ArgumentDeclaration BlockStart Statements BlockEnd
</pre></x>

[\<ident-token>]: https://drafts.csswg.org/css-syntax-3/#ident-token-diagram

[ForBlock] is replaced.

[ForBlock]: ../spec/at-rules/for.md#syntax

<x><pre>
**ForBlock**           ::= BlockStart Statements BlockEnd
</pre></x>

> TODO: Should this be BlockContents instead of Statements?

### Syntax Changes

For the indented syntax, [StatementEnd] is replaced with:

[StatementEnd]: #indented-format

<x><pre>
**StatementEnd**           ::= NewLine | ';' | BlockEnd
</pre></x>

## Procedures

### Parsing text as Sass

This algorithm takes a string, `text`, and a `syntax` ("indented" or "scss") and returns a Sass abstract syntax tree.

* Let `BlockStart`, `BlockEnd`, `StatementEnd`, and `StatementExplicitEnd` be
  the syntax for `syntax`.

* Let `AST` be an empty syntax tree.

* Let `current-statement` be a new statement.

* While parsing text:

  * If parsing encounters child `Statements`, set `parent` to
    `current-statement`, and parse each child.

  * If parsing produces [`StatementMayEnd`]:

  [`StatementMayEnd`]: #productions-of-statementmayend
  
  * If the next token is `StatementEnd`, add `current-statement` to `AST`, and resume parsing `parent` if one exists.

  * If the next token is `BlockEnd`, add `current-statement` to `AST`, and `parent` if one exists. If `parent` has a `parent`, continue parsing `parent`'s `parent`.

    > Todo- turn into a subroutine.

  * If you are at the end of `text`, return `AST`.

  * Otherwise, continue.

  * Otherwise, if `StatementExplicitEnd` is read, or if you are at the end of
    `text`, throw an error.

  * Otherwise, continue.

### Productions of `StatementMayEnd`

A `StatementMayEnd` pseudoproduction is created in the following productions:

* After a SassScript value, unless the SassScript value is inside a [`BracketedListExpression`], [`MapExpression`], [`ArgumentDeclaration`], or [`OrderOfOperationsExpression`].

[`BracketedListExpression`]: ../spec/types/list.md#syntax

* Immediately after any `*ListExpression`, `MapExpression` or [`OrderOfOperationsExpression`].

* Immediately after a `BlockEnd` in any other production.

* After each space or `NewLine` in a [`CustomDeclaration`], except inside an Interpolation production.

[`CustomDeclaration`]: ../spec/declarations.md#syntax

* After each space or `NewLine` in an at-rule supported by CSS, including unknown at-rules, except in interpolations.
