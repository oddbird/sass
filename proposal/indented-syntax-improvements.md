# Indented Syntax Improvements

*([Issue](https://github.com/sass/sass/issues/216))*

This proposal improves the indented syntax format, allowing multiline expressions, semicolons, and curly braces.

## Table of Contents

* [Background](#background)
* [Summary](#summary)
  * [Places where a line break must create a statement break](#places-where-a-line-break-must-create-a-statement-break)
    * [After a non-enclosed list begins](#after-a-non-enclosed-list-begins)
      * [Lists in at rules](#lists-in-at-rules)
      * [Lists in arguments](#lists-in-arguments)
    * [Custom property values, except inside an InterpolatedDeclarationValue](#custom-property-values-except-inside-an-interpolateddeclarationvalue)
    * [Anywhere in an unwrapped expression expect immediately after an operator](#anywhere-in-an-unwrapped-expression-expect-immediately-after-an-operator)
    * [In an unwrapped condition of an `@if`](#in-an-unwrapped-condition-of-an-if)
  * [Design Decisions](#design-decisions)
* [Syntax](#syntax)
  * [Existing Syntax](#existing-syntax)
    * [Syntax-specific productions](#syntax-specific-productions)
      * [Indented Format](#indented-format)
      * [Scss Format](#scss-format)
    * [Statement](#statement)
    * [Block](#block)
    * [ArgumentDeclaration](#argumentdeclaration)
  * [Clarified Syntax](#clarified-syntax)
  * [Proposed Syntax](#proposed-syntax)
* [Semantics](#semantics)

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

### Places where a line break must create a statement break

#### After a non-enclosed list begins

A line break in a list that is not in a `BracketedListExpression` or enclosed in `()` must
cause a statement break.

`$var: 1 2\n3` and `$var: 1, 2\n, 3` can not be parsed to determine when the
statement has ended. Alternates `$var: (1 2\n3)`, `$var: [1 2\n3]`, and `$var:
(1, 2,\n 3)` can be parsed.

Comma separated lists can not use a trailing comma to signify that a list will
continue after the line break, as this would break existing stylesheets with
trailing commas.

##### Lists in at rules

This rule also applies to lists in an @each declaration. `@each $size in \n 12px
24px` will not be supported, but the wrapped `@each $size in \n (12px 24px)`
will be. `@each $key, \nvalue in \n $map` will not be supported, but the wrapped
`@each ($key, $value) in $map` will be.

##### Lists in arguments

Because arguments to functions and mixins are already wrapped in `()`, line
breaks in arguments do not need to cause a statement break.

#### Custom property values, except inside an InterpolatedDeclarationValue

Interpolations are wrapped in `#{}` so line breaks do not need to end statements.

#### Anywhere in an unwrapped expression expect immediately after an operator

`3\n+ 4` doesn't have a clear ending. `(3\n+ 4)` or `3 +\n4` would work.

#### In an unwrapped condition of an `@if`

`@if $a and \n $b` can not be parsed to determine when the statement has ended. `@if ($a \n and $b)` can be parsed.

### Design Decisions

## Syntax

The syntax impacted by these changes has not been specified, so this proposal first defines the existing syntax, and then the proposed changes.

### Existing Syntax

#### Syntax-specific productions

##### Indented Format

<x><pre>
**NewLine**        ::= LineFeed | CarriageReturn | FormFeed
**StatementEnd**   ::= NewLine
**BlockStart**     ::= NewLine Indent
**BlockEnd**       ::= Dedent
</pre></x>

##### Scss Format

<x><pre>
**StatementEnd**   ::= ';' | BlockEnd
**BlockStart**     ::= '{'
**BlockEnd**       ::= '}'
</pre></x>

#### Statement

<x><pre>
**Statement**      ::= Declaration StatementEnd
</pre></x>

#### Block

`*Rule` is any nonterminal rule, including `MixinRule`, `UseRule`,
and`UnknownAtRule`.

<x><pre>
**BlockPrelude**   ::= Selector | *Rule
**Block**          ::= BlockPrelude BlockStart BlockContents BlockEnd
**BlockContents**  ::= (Statement | Block)+
</pre></x>

#### ArgumentDeclaration

<x><pre>
ArgumentDeclaration ::= '(' [CommaListExpression] ')'
</pre></x>

[CommaListExpression]: ../spec/types/list.md#syntax

Productions for optional or keyword arguments are omitted, as they are orthogonal to this proposal.

### Clarified Syntax

This proposal defines replacements for productions that only defined syntax for the Scss format.

[StandardDeclaration] is replaced.

[StandardDeclaration]: ../spec/declarations.md#syntax

<x><pre>
**StandardDeclaration** ::= [InterpolatedIdentifier]¹ ':' (Value | Value? BlockStart Statements BlockEnd )
</pre></x>

[InterpolatedIdentifier]: ../spec/syntax.md#interpolatedidentifier

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

### Proposed Syntax

## Semantics
