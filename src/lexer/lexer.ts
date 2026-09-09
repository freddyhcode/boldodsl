import { KEYWORDS, TYPE_KEYWORDS } from "./keywords.js";
import { Token, TokenType } from "./token.js";

/**
 * Lexer implementation for the DSL.
 * Tokenizes source code strings into a stream of structured Tokens.
 */
export class Lexer {
  private source: string = "";
  private position: number = 0;
  private readonly WHITESPACE: string = " \t\n\r";

  /**
   * Initializes a new instance of the Lexer, optionally with source code.
   */
  public constructor(input: string = "") {
    if (input) {
      this.init(input);
    }
  }
  /**
   * Sets the source code to be tokenized.
   */
  public init(input: string): void {
    this.source = input;
    this.position = 0;
  }

  /**
   * Scans and returns the next token from the source code.
   */
  public nextToken(): Token {
    this.skipWhitespace();
    const char = this.current();

    if (char == "") {
      return { type: TokenType.EOF, lexeme: "" };
    }

    if (this.isAlpha(char)) {
      const lexeme = this.readIdentifier();

      if (KEYWORDS[lexeme]) {
        return { type: KEYWORDS[lexeme], lexeme: lexeme };
      }

      if (TYPE_KEYWORDS[lexeme]) {
        return { type: TYPE_KEYWORDS[lexeme], lexeme: lexeme };
      }

      return { type: TokenType.IDENTIFIER, lexeme: lexeme };
    }

    switch (char) {
      case "{":
        this.advance();
        return { type: TokenType.LBRACE, lexeme: "{" };
      case "}":
        this.advance();
        return { type: TokenType.RBRACE, lexeme: "}" };
      case ":":
        this.advance();
        return { type: TokenType.COLON, lexeme: ":" };
      case ".":
        this.advance();
        return { type: TokenType.DOT, lexeme: "." };
      case "-":
        this.advance();
        if (this.current() === ">") {
          this.advance();
          return { type: TokenType.ARROW, lexeme: "->" };
        }
        return { type: TokenType.MINUS, lexeme: "-" };
      case ">":
        this.advance();
        return { type: TokenType.GREATER, lexeme: ">" };
    }

    this.advance();
    return { type: TokenType.NOT_SUPPORTED, lexeme: char };
  }

  /**
   * Quick debug helper to test the lexer token stream.
   */
  public static debug(input: string): void {
    const lexer = new Lexer();
    lexer.init(input);

    console.log("===== TOKENS =====");
    let token: Token;
    do {
      token = lexer.nextToken();
      console.log(token);
    } while (token.type !== TokenType.EOF);
  }

  /**
   * Returns the character at the current position, or an empty string if EOF.
   */
  private current(): string {
    return this.source[this.position] || "";
  }

  /**
   * Advances the internal pointer to the next character.
   */
  private advance(): void {
    if (this.position < this.source.length) {
      this.position++;
    }
  }

  /**
   * Skips all whitespace characters (spaces, tabs, newlines).
   */
  private skipWhitespace(): void {
    while (this.current() !== "" && this.WHITESPACE.includes(this.current())) {
      this.advance();
    }
  }

  /**
   * Checks if a character is a valid letter or underscore.
   */
  private isAlpha(char: string): boolean {
    return (
      (char >= "a" && char <= "z") ||
      (char >= "A" && char <= "Z") ||
      char === "_"
    );
  }

  /**
   * Reads a full alphabetical identifier/word from the source.
   */
  private readIdentifier(): string {
    let identifier: string = "";
    while (this.isAlpha(this.current())) {
      identifier += this.current();
      this.advance();
    }
    return identifier;
  }
}
