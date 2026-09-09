import { describe, expect, it } from "vitest";
import { Lexer } from "../src/lexer/lexer.ts";
import { Token, TokenType } from "../src/lexer/token.ts";

describe("Tests lexer.ts", () => {
  it("should correctly tokenize the DSL structure and the arrow operator", () => {
    const input = `
      database ecommerce {
        table users {
          id: int primary key increment
        }
      }
      ref orders.user_id -> users.id one:many
    `;

    const lexer = new Lexer(input);
    const tokens: Token[] = [];
    let currentToken = lexer.nextToken();
    while (currentToken.type !== TokenType.EOF) {
      tokens.push(currentToken);
      currentToken = lexer.nextToken();
    }

    // tokens.forEach(({ type, lexeme }) => {
    //   console.log(`Type: ${type.padEnd(15)} | Lexeme: "${lexeme}"`);
    // });

    const arrowToken = tokens.find((t) => t.type === TokenType.ARROW);
    expect(arrowToken).toEqual({ type: TokenType.ARROW, lexeme: "->" });

    const databaseToken = tokens.find((t) => t.type === TokenType.DATABASE);
    expect(databaseToken).toEqual({
      type: TokenType.DATABASE,
      lexeme: "database",
    });
  });

  it("should handle invalid or unexpected characters as NotSupported tokens", () => {
    const input = "a1*";

    const lexer = new Lexer(input);
    const tokens: Token[] = [];

    let currentToken = lexer.nextToken();
    while (currentToken.type !== TokenType.EOF) {
      tokens.push(currentToken);
      currentToken = lexer.nextToken();
    }

    const notSupportedTokens = tokens.filter(
      (t) => t.type === TokenType.NOT_SUPPORTED,
    );

    expect(notSupportedTokens.length).toBe(2);
    expect(notSupportedTokens.map((t) => t.lexeme)).toEqual(["1", "*"]);
  });
});
