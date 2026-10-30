import { describe, it, expect } from "vitest";
import { Token, TokenType } from "../src/lexer/token.js";

describe("Tests token.ts", () => {
  it("should create a token correctly", () => {
    const token: Token = {
      type: TokenType.DATABASE,
      lexeme: "database",
      line: 1,
      column: 1,
    };

    expect(token.type).toBe(TokenType.DATABASE);
    expect(token.lexeme).toBe("database");
  });

  it("should define all token types correctly", () => {
    const tokens = [
      [TokenType.DATABASE, "DATABASE"],
      [TokenType.TABLE, "TABLE"],
      [TokenType.REF, "REF"],
      [TokenType.PRIMARY, "PRIMARY"],
      [TokenType.KEY, "KEY"],
      [TokenType.UNIQUE, "UNIQUE"],
      [TokenType.NOT, "NOT"],
      [TokenType.NULL, "NULL"],
      [TokenType.INCREMENT, "INCREMENT"],
      [TokenType.ONE, "ONE"],
      [TokenType.MANY, "MANY"],
      [TokenType.INT, "INT"],
      [TokenType.STRING, "STRING"],
      [TokenType.DECIMAL, "DECIMAL"],
      [TokenType.BOOLEAN, "BOOLEAN"],
      [TokenType.DATE, "DATE"],
      [TokenType.DATETIME, "DATETIME"],
      [TokenType.IDENTIFIER, "IDENTIFIER"],
      [TokenType.LBRACE, "LBRACE"],
      [TokenType.RBRACE, "RBRACE"],
      [TokenType.COLON, "COLON"],
      [TokenType.DOT, "DOT"],
      [TokenType.MINUS, "MINUS"],
      [TokenType.GREATER, "GREATER"],
      [TokenType.ARROW, "ARROW"],
      [TokenType.NOT_SUPPORTED, "NOT_SUPPORTED"],
      [TokenType.EOF, "EOF"],
    ] as const;

    tokens.forEach(([tokenType, value]) => {
      expect(tokenType).toBe(value);
    });
  });
});
