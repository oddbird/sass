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
  * [IndentedStatements](#indentedstatements)
  * [Block](#block)
  * [Whitespace](#whitespace)

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
statement after `$a`, but `@if ($a \n and $b)` can be parsed.

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

We considered borrowing alternate syntax from other languages, such as a leading
`>` or `|` from YAML or a trailing `|` from HAML. These introduce syntax that is
novel to Sass, and we instead opted to borrow syntax from the Scss format.

These changes also allow authors using the indented syntax to add more explicit
blocks and line breaks. While this introduces the changes for all authors,
authors will still be able choose to limit the syntax with linters.

## Syntax

### IndentedStatements

<x><pre>
**IndentedStatements**  ::= (Statement (';' | IndentedSame)?¹)* Statement?
</pre></x>

1: This production is mandatory unless the previous `Statement` is a
`LoudComment` or `SilentComment`, or after the final production in a
`IndentedStatements` production, which is either at the end of a `Block` or the
end of the document.

If a `WhitespaceComment` would be ambiguous with a `Statement` in the `IndentedStatements` rule, parse it preferentially as a `Statement`.

If an `IndentedSame` would be ambiguous with `IndentedWhitespace`, parse it preferentially as `IndentedSame`.

> This is essentially "If there's a line break in a place where a `;` could go,
> it is a line break."

### Block

Replace footnote 1 with:

1: In the Scss syntax, only the `ScssBlock` production is valid.

### Whitespace

<x><pre>
**IndentedWhitespace**      ::= LineBreak¹ | Space | Tab
</pre></x>

1. `LineBreak` is not whitespace in the `IncludeAtRule`, `SupportsAtRule`, [`MediaAtRule`], `KeyframesAtRule` or [`UnknownAtRule`].

[`MediaAtRule`]: ../spec/at-rules/media.md
[`UnknownAtRule`]: ../spec/at-rules/unknown.md
