/**
 * Public package entry point.
 */
export { Lexer } from "./lexer/lexer.js";
export { TokenType } from "./lexer/token.js";
export type { Token } from "./lexer/token.js";

export { Parser } from "./parser/parser.js";
export { ParseError } from "./parser/parser-error.js";
export type {
  Cardinality,
  ColumnNode,
  Constraint,
  ConstraintKind,
  DatabaseNode,
  DataType,
  QualifiedName,
  RefNode,
  TableNode,
} from "./ast/nodes.js";
