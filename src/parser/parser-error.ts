import { TokenType } from "../lexer/token.js";
import type { Token } from "../lexer/token.js";

/**
 * Thrown when the parser encounters syntax that does not match the grammar.
 */
export class ParseError extends Error {
  /** Token that caused the error. */
  public readonly token: Token;

  public constructor(message: string, token: Token) {
    const found = token.type === TokenType.EOF ? "EOF" : `"${token.lexeme}"`;

    super(
      `${message} (line ${token.line}, column ${token.column}; found ${found})`,
    );

    this.name = "ParseError";
    this.token = token;
  }
}