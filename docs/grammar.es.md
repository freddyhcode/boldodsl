# Gramática de Boldodsl

[English](grammar.md) | **Español**

Notación: los literales van entre comillas, `*` significa cero o más
repeticiones, `|` significa alternativa y `EOF` es el fin del archivo.

## Gramática

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

## Reglas léxicas

- `IDENTIFIER` cumple `[A-Za-z_][A-Za-z0-9_]*` y no puede ser palabra reservada.
- Son palabras reservadas todos los literales entre comillas de la gramática.
- Keywords e identificadores se normalizan a minúsculas.
- Espacios, tabs, `\r`, `\n` y comentarios (`#` hasta fin de línea) se descartan.
- `->` se escribe junto, sin espacio entre `-` y `>`.
