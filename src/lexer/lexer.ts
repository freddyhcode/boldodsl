import { KEYWORDS, TYPE_KEYWORDS } from "./keywords.js";
import { Token, TokenType } from "./token.js";

/**
 * Lexer implementation for the DSL.
 * Tokenizes source code strings into a stream of structured Tokens.
 */
export class Lexer {
  private source: string = "";
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;
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
    // Ignore a UTF-8 BOM and normalize CRLF/CR to LF.
    this.source = input
      .replace(/^\uFEFF/, "")
      .replace(/\r\n?/g, "\n");
    this.position = 0;
    this.line = 1;
    this.column = 1;
  }

  /**
   * Scans and returns the next token from the source code.
   */
  public nextToken(): Token {
    this.skipWhitespace();
    const char = this.current();
    const line = this.line;
    const column = this.column;

    if (char == "") {
      return { type: TokenType.EOF, lexeme: "" , line, column };
    }

    if (this.isAlpha(char)) {
      const lexeme = this.readIdentifier();

      if (Object.hasOwn(KEYWORDS, lexeme)) {
        return { type: KEYWORDS[lexeme], lexeme: lexeme, line, column };
      }

      if (Object.hasOwn(TYPE_KEYWORDS, lexeme)) {
        return { type: TYPE_KEYWORDS[lexeme], lexeme: lexeme, line, column };
      }

      return { type: TokenType.IDENTIFIER, lexeme: lexeme, line, column };
    }

    switch (char) {
      case "{":
        this.advance();
        return { type: TokenType.LBRACE, lexeme: "{" , line, column };
      case "}":
        this.advance();
        return { type: TokenType.RBRACE, lexeme: "}", line, column };
      case ":":
        this.advance();
        return { type: TokenType.COLON, lexeme: ":", line, column };
      case ".":
        this.advance();
        return { type: TokenType.DOT, lexeme: ".", line, column };
      case "-":
        this.advance();
        if (this.current() === ">") {
          this.advance();
          return { type: TokenType.ARROW, lexeme: "->", line, column};
        }
        return { type: TokenType.MINUS, lexeme: "-", line, column };
      case ">":
        this.advance();
        return { type: TokenType.GREATER, lexeme: ">", line, column };
    }

    this.advance();
    return { type: TokenType.NOT_SUPPORTED, lexeme: char, line, column };
  }

  /**
   * Collects the remaining tokens, including EOF.
   */
  public tokenize(): Token[] {
    const tokens: Token[] = [];
    let token: Token;

    do {
      token = this.nextToken();
      tokens.push(token);
    } while (token.type !== TokenType.EOF);

    return tokens;
  }

  /**
   * Returns the character at the current position, or an empty string if EOF.
   */
  private current(): string {
    return this.source[this.position] || "";
  }

  /**
   * Advances the lexer position and updates line and column.
   */
  private advance(): void {
    if (this.position >= this.source.length) {
      return;
    }
    
    if (this.current() === "\n") {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    
    this.position++;
  }

  /**
   * Skips whitespace and comments.
   */
  private skipWhitespace(): void {
    while (this.current() !== "") {
      if (this.WHITESPACE.includes(this.current())) {
        this.advance();
      } else if (this.current() === "#") {
        while (this.current() !== "" && this.current() !== "\n") {
          this.advance();
        }
      } else {
        break;
      }
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
   * Checks if a character is a digit.
   */
  private isNumber(char: string): boolean {
    return char >= "0" && char <= "9";
  }

  /**
   * Reads an identifier and normalizes it to lowercase.
   */
  private readIdentifier(): string {
    let identifier: string = "";
    while (this.isAlpha(this.current()) || this.isNumber(this.current())) {
      identifier += this.current();
      this.advance();
    }
    return identifier.toLowerCase();
  }

}
