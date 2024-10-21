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

## Definitions

### Current indentation level

The `current indentation level` is the count of the [`documentation indentation character`] between a new line and any non-whitespace characters of the last consumed line. Changes in the indentation level are used by the indented syntax to start and end blocks of statements.

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

> Use Less and More rather than directional (up, down, lower, below) to prevent
> ambiguity.

### StatementSequence

<x><pre> **StatementSequence**     ::= (StatementWithBlock |
StatementWithoutBlock)+ </pre></x>

> A StatementSequence represents the statements at a given level, either inside
> a block, or at the top level.
