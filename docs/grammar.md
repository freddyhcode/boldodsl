# Boldodsl Grammar

**English** | [Español](grammar.es.md)

Notation: literals are quoted, `*` means zero or more repetitions, `|` means
alternative, and `EOF` is the end of input.

## Grammar

```ebnf
program     := database EOF
database    := "database" IDENTIFIER "{" (table | ref)* "}"
table       := "table" IDENTIFIER "{" column* "}"
column      := IDENTIFIER ":" type constraint*
type        := "int" | "string" | "decimal" | "boolean" | "date" | "datetime"
constraint  := "primary" "key" | "unique" | "not" "null" | "increment"
ref         := "ref" qualified "->" qualified cardinality
qualified   := IDENTIFIER "." IDENTIFIER
cardinality := ("one" | "many") ":" ("one" | "many")
```

## Lexical rules

- `IDENTIFIER` matches `[A-Za-z_][A-Za-z0-9_]*` and cannot be a reserved word.
- Reserved words are every literal quoted in the grammar.
- Keywords and identifiers are normalized to lowercase.
- Whitespace, tabs, `\r`, `\n`, and comments (`#` to end of line) are skipped.
- `->` must be written without spaces between `-` and `>`.
