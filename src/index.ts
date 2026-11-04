/**
 * Public package entry point.
 */
import { Lexer } from "./lexer/lexer.js";
import { Parser } from "./parser/parser.js";
import type { Token } from "./lexer/token.js";
import type { DatabaseNode } from "./ast/nodes.js";

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

/**
 * Convenience facade for the public API.
 */
export class BoldoDSL {
  private constructor() {}

  /**
   * Returns all tokens for the given source.
   */
  public static lexer(source: string): Token[] {
    return new Lexer(source).tokenize();
  }

  /**
   * Parses the given source into an AST.
   */
  public static parser(source: string): DatabaseNode {
    return new Parser(new Lexer(source)).parse();
  }
}
