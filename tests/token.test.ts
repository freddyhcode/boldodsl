import { describe, it, expect } from "vitest";
import { Token, TokenType } from "../src/lexer/token.js";

describe("token.ts", () => {
  it("creates a token correctly", () => {
    const token: Token = {
      type: TokenType.Database,
      lexeme: "database",
    };

    expect(token.type).toBe(TokenType.Database);
    expect(token.lexeme).toBe("database");
  });

  it("defines all token types correctly", () => {
    const tokens = [
      [TokenType.Database, "database"],
      [TokenType.Table, "table"],
      [TokenType.Ref, "ref"],
      [TokenType.Primary, "primary"],
      [TokenType.Key, "key"],
      [TokenType.Unique, "unique"],
      [TokenType.Not, "not"],
      [TokenType.Null, "null"],
      [TokenType.One, "one"],
      [TokenType.Many, "many"],
      [TokenType.Int, "int"],
      [TokenType.String, "string"],
      [TokenType.Decimal, "decimal"],
      [TokenType.Boolean, "boolean"],
      [TokenType.Date, "date"],
      [TokenType.Identifier, "identifier"],
      [TokenType.LBrace, "{"],
      [TokenType.RBrace, "}"],
      [TokenType.Colon, ":"],
      [TokenType.Dot, "."],
      [TokenType.Minus, "-"],
      [TokenType.Greater, ">"],
      [TokenType.EOF, "eof"],
    ] as const;

    tokens.forEach(([tokenType, value]) => {
      expect(tokenType).toBe(value);
    });
  });
});
