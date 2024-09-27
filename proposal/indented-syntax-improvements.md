# Indented Syntax Improvements

*([Issue](https://github.com/sass/sass/issues/216))*

This proposal improves the indented syntax format, allowing multiline expressions, semicolons, and curly braces.

## Table of Contents

* [Background](#background)
* [Summary](#summary)
  * [Places where a line break must create a statement break](#places-where-a-line-break-must-create-a-statement-break)
    * [After a non-enclosed list begins](#after-a-non-enclosed-list-begins)
      * [Lists in arguments](#lists-in-arguments)
    * [Custom property values, except inside an InterpolatedDeclarationValue](#custom-property-values-except-inside-an-interpolateddeclarationvalue)
    * [Binary operators](#binary-operators)
    * [At Rules](#at-rules)
  * [Design Decisions](#design-decisions)
* [Syntax](#syntax)
  * [Existing Syntax](#existing-syntax)
    * [Syntax-specific productions](#syntax-specific-productions)
      * [Indented format](#indented-format)
      * [SCSS format](#scss-format)
    * [Statement](#statement)
    * [Block](#block)
    * [ArgumentDeclaration](#argumentdeclaration)
    * [InterpolatedDeclarationValue](#interpolateddeclarationvalue)
    * [OrderOfOperationsExpression](#orderofoperationsexpression)
    * [MapExpression](#mapexpression)
  * [Clarified Syntax](#clarified-syntax)
  * [Proposed Syntax Changes](#proposed-syntax-changes)
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

##### Lists in arguments

Because arguments to functions and mixins are already wrapped in `()`, line
breaks in arguments do not need to cause a statement break.

#### Custom property values, except inside an InterpolatedDeclarationValue

Interpolations are wrapped in `#{}` so line breaks do not need to end statements.

#### Binary operators

Line breaks must cause statement breaks before a binary operator, unless it is wrapped in `()`.

`3\n+ 4` doesn't have a clear ending. `(3\n+ 4)` or `3 +\n4` would work.

`@if $a \n and $b` can not be parsed to determine when the statement has ended. `@if ($a \n and $b)` can be parsed.

#### At Rules

For any at rule that is supported by native CSS, line breaks after the `@` and
before a block or statement end are not supported. This includes `@include`,
(which overlaps with Sass), `@supports`, `@media`, `@keyframes` and any unknown at rule.

These rules should be emitted as is, with no special handling from Sass.

### Design Decisions

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

#### ArgumentDeclaration

<x><pre>
ArgumentDeclaration ::= '(' [CommaListExpression] ')'
</pre></x>

[CommaListExpression]: ../spec/types/list.md#syntax

Productions for optional or keyword arguments are omitted, as they are orthogonal to this proposal.

#### InterpolatedDeclarationValue

<x><pre>
InterpolatedDeclarationValue ::= (Interpolation | String)+
</pre></x>

#### OrderOfOperationsExpression

<x><pre>
OrderOfOperationsExpression ::= '(' Statements ')'
</pre></x>

#### MapExpression

<x><pre>
MapExpression ::= '(' [InterpolatedIdentifier] ':' Value) (',' [InterpolatedIdentifier] ':' Value)* ')'
</pre></x>

[InterpolatedIdentifier]: ../spec/syntax.md#interpolatedidentifier

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

### Proposed Syntax Changes

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

* Let `AST` be an empty tree.

* Let `current-statement` be a new statement.

* While parsing text:

  * If parsing encounters child `Statements`, `BlockStart`, set `parent` to
    `current-statement`, and parse each child.

  * If parsing produces `StatementMayEnd`:
  
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

* After each space or `NewLine` in a [`CustomDeclaration`], except in Interpolations.

[`CustomDeclaration`]: ../spec/declarations.md#syntax
