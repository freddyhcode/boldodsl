# Boldodsl

[English](README.md) | **Español**

![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Node](https://img.shields.io/badge/Node-20+-339933?logo=node.js&logoColor=white)
[![npm](https://img.shields.io/badge/npm-boldodsl-CB3837?logo=npm&logoColor=white)](https://www.npmjs.com/package/boldodsl)
![License](https://img.shields.io/badge/license-MIT-green)

Un DSL declarativo para describir esquemas de bases de datos.

## ¿Qué es Boldodsl?

Boldodsl es un lenguaje específico de dominio, cercano a SQL, para describir
tablas, columnas, restricciones y relaciones.

## Estado

El lexer, el parser y el AST están implementados. El validador semántico y la
generación de SQL todavía no están implementados.

El lexer no lanza errores. Los caracteres inválidos se convierten en tokens
`NOT_SUPPORTED`, y el parser reporta los errores de sintaxis como `ParseError`
con la línea y columna correspondientes.

## Uso

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
```

## Sintaxis

La gramática formal está en [docs/grammar.es.md](docs/grammar.es.md).

### Ejemplo

```boldo
database ecommerce {

  # Tabla de usuarios
  table users {
    id: int primary key increment
    username: string not null
    email: string unique
  }

  # Tabla de pedidos
  table orders {
    id: int primary key increment
    user_id: int not null
    total: decimal
  }

  ref orders.user_id -> users.id many:one
}
```

### Base de datos

Todo esquema empieza con la palabra `database`, un nombre y un bloque entre
llaves.

### Tablas y columnas

Cada tabla se declara con `table` y un bloque. Cada columna se escribe como
`nombre: tipo`, seguida de sus restricciones. Los identificadores se normalizan
a minúsculas.

### Palabras reservadas

Las keywords y los nombres de tipos son reservados y no pueden usarse como
identificadores. Las palabras reservadas son `database`, `table`, `ref`,
`primary`, `key`, `unique`, `not`, `null`, `increment`, `one`, `many`, `int`,
`string`, `decimal`, `boolean`, `date` y `datetime`.

### Tipos

| Tipo | Descripción |
|---|---|
| `int` | Número entero |
| `string` | Cadena de texto |
| `decimal` | Número decimal |
| `boolean` | Verdadero o falso |
| `date` | Fecha |
| `datetime` | Fecha y hora |

### Restricciones

| Restricción | Descripción |
|---|---|
| `primary key` | Clave primaria de la tabla |
| `unique` | El valor no se puede repetir |
| `not null` | El valor es obligatorio |
| `increment` | El valor se incrementa automáticamente |

### Relaciones

```boldo
ref orders.user_id -> users.id many:one
```

La cardinalidad se lee de izquierda a derecha: primero el lado izquierdo de la
flecha.

| Cardinalidad | Significado |
|---|---|
| `one:one` | Uno a uno |
| `one:many` | Uno a muchos |
| `many:one` | Muchos a uno |
| `many:many` | Muchos a muchos |

### Comentarios

```boldo
# Comentario de una línea
```

## Desarrollo

```bash
npm run test:run      # ejecutar los tests una vez
npm run debug:lexer   # playground de tokens
npm run debug:parser  # playground del AST
npm run build         # compilar dist con tsup
```

## Documentación

- Gramática formal: [Español](docs/grammar.es.md) · [English](docs/grammar.md)
- README en inglés: [README.md](README.md)

## Licencia

MIT
