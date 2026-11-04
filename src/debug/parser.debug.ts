/**
 * Manual parser playground.
 * Run with `npm run debug:parser` and edit the sample source below.
 */

import { Lexer } from "../lexer/lexer.js";
import { Parser } from "../parser/parser.js";

const source = `
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
`;

try {
  const ast = new Parser(new Lexer(source)).parse();

  console.log("===== AST =====");
  console.dir(ast, { depth: null, colors: true });
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
}
