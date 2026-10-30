# Boldodsl

![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Node](https://img.shields.io/badge/Node-20+-339933?logo=node.js&logoColor=white)
[![npm](https://img.shields.io/badge/npm-boldodsl-CB3837?logo=npm&logoColor=white)](https://www.npmjs.com/package/boldodsl)
![License](https://img.shields.io/badge/license-MIT-green)

Un DSL declarativo para describir esquemas de bases de datos.

## ¿Qué es Boldodsl?

Boldodsl es un lenguaje específico de dominio, cercano a SQL, para describir tablas, columnas, restricciones y relaciones.

## Sintaxis

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

Todo esquema empieza con la palabra `database`, un nombre y un bloque entre llaves.

### Tablas y columnas

Cada tabla se declara con `table` y un bloque. Cada columna se escribe como `nombre: tipo` seguida de sus restricciones. Los identificadores se normalizan a minúsculas.

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

La cardinalidad se lee de izquierda a derecha: primero el lado izquierdo de la flecha.

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

## Licencia

MIT
