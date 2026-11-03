# Boldodsl

**English** | [Español](README.es.md)

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Node](https://img.shields.io/badge/Node-20+-339933?logo=node.js&logoColor=white)
[![npm](https://img.shields.io/badge/npm-boldodsl-CB3837?logo=npm&logoColor=white)](https://www.npmjs.com/package/boldodsl)
![License](https://img.shields.io/badge/license-MIT-green)

A declarative DSL for describing database schemas.

## What is Boldodsl?

Boldodsl is a domain-specific language, close to SQL, for describing tables,
columns, constraints, and relationships.

## Status

The lexer, parser, and AST are implemented. Semantic validation and SQL
generation are not implemented yet.

The lexer does not throw. Invalid characters become `NOT_SUPPORTED` tokens, and
the parser reports syntax errors as `ParseError` with the offending line and
column.

## Usage

```ts
import { Lexer, Parser } from "boldodsl";

const source = `
database ecommerce {
    table users {
        id: int primary key increment
        username: string not null
    }
}
`;

const ast = new Parser(new Lexer(source)).parse();
console.dir(ast, { depth: null });
```

## Syntax

The formal grammar is available in [docs/grammar.md](docs/grammar.md).

### Example

```boldo
database ecommerce {

    # Users table
    table users {
        id: int primary key increment
        username: string not null
        email: string unique
    }

    # Orders table
    table orders {
        id: int primary key increment
        user_id: int not null
        total: decimal
    }

    ref orders.user_id -> users.id many:one
}
```

### Database

Every schema starts with the `database` keyword, a name, and a block between
braces.

### Tables and columns

Each table is declared with `table` and a block. Each column is written as
`name: type`, followed by its constraints. Identifiers are normalized to
lowercase.

### Reserved words

Keywords and type names are reserved and cannot be used as identifiers. The
reserved words are `database`, `table`, `ref`, `primary`, `key`, `unique`,
`not`, `null`, `increment`, `one`, `many`, `int`, `string`, `decimal`,
`boolean`, `date`, and `datetime`.

### Types

| Type | Description |
|---|---|
| `int` | Integer number |
| `string` | Text string |
| `decimal` | Decimal number |
| `boolean` | True or false |
| `date` | Date |
| `datetime` | Date and time |

### Constraints

| Constraint | Description |
|---|---|
| `primary key` | Primary key of the table |
| `unique` | The value cannot be repeated |
| `not null` | The value is required |
| `increment` | The value is incremented automatically |

### Relationships

```boldo
ref orders.user_id -> users.id many:one
```

Cardinality is read from left to right: first the left side of the arrow.

| Cardinality | Meaning |
|---|---|
| `one:one` | One to one |
| `one:many` | One to many |
| `many:one` | Many to one |
| `many:many` | Many to many |

### Comments

```boldo
# Single-line comment
```

## Development

```bash
npm run test:run      # single test run
npm run debug:lexer   # token debug playground
npm run debug:parser  # AST debug playground
npm run build         # build dist with tsup
```

## Documentation

- Formal grammar: [English](docs/grammar.md) · [Español](docs/grammar.es.md)
- Spanish README: [README.es.md](README.es.md)

## License

MIT
