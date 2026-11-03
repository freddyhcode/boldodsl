/**
 * Manual parser playground.
 * Run with `npm run debug:parser` and edit the sample source below.
 */

import { Parser } from "../parser/parser.js";

Parser.debug(`
database ecommerce {
  table users {
    id: int primary key increment
    username: string not null
    email: string unique
  }
  table orders {
    id: int primary key
    user_id: int not null
    total: decimal
  }
  ref orders.user_id -> users.id many:one
}
`);