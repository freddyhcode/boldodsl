import { describe, expect, it } from "vitest";
import { BoldoDSL } from "../src/index.js";
import { TokenType } from "../src/lexer/token.js";

describe("Tests index.ts", () => {
  it("should tokenize and parse in one call", () => {
    const tokens = BoldoDSL.lexer("database d {}");
    const ast = BoldoDSL.parser("database d {}");

    expect(tokens[tokens.length - 1].type).toBe(TokenType.EOF);
    expect(ast.name).toBe("d");
  });
});
