# Indented Syntax Improvements

*([Issue](https://github.com/sass/sass/issues/216))*

This proposal improves the indented syntax format, allowing multiline expressions, semicolons, and curly braces.

## Table of Contents

* [Background](#background)
* [Summary](#summary)
  * [Design Decisions](#design-decisions)
* [Syntax](#syntax)
  * [Existing Syntax](#existing-syntax)
    * [Syntax-specific productions](#syntax-specific-productions)
      * [Indented Format](#indented-format)
      * [SCSS Format](#scss-format)
    * [Statement](#statement)
    * [Block](#block)
  * [Proposed Syntax](#proposed-syntax)
* [Semantics](#semantics)

## Background

> This section is non-normative.

The indented `.sass` syntax uses whitespace to end statements (linebreaks) and
indicate nesting (indentation). While this syntax is preferred by some authors,
it presents authoring challenges, specifically around long lists.

## Summary

> This section is non-normative.

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

##### SCSS Format

<x><pre>
**StatementEnd**   ::= ';'
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

### Proposed Syntax

## Semantics
