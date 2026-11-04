import {
  Cardinality,
  ColumnNode,
  Constraint,
  DatabaseNode,
  DataType,
  QualifiedName,
  RefNode,
  TableNode,
} from "../ast/nodes.js";
import { Lexer } from "../lexer/lexer.js";
import { Token, TokenType } from "../lexer/token.js";
import { ParseError } from "./parser-error.js";

/**
 * Recursive descent parser for Boldodsl.
 */
export class Parser {
  private readonly lexer: Lexer;
  private current: Token;

  /**
   * Creates a parser for the given lexer.
   */
  public constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.current = lexer.nextToken();
  }

  /**
   * Parses a complete source file.
   * program := database EOF
   */
  public parse(): DatabaseNode {
    const database = this.parseDatabase();
    this.eat(TokenType.EOF, "end of file");
    return database;
  }

  /**
   * Parses a database block.
   * database := "database" IDENTIFIER "{" (table | ref)* "}"
   */
  private parseDatabase(): DatabaseNode {
    const start = this.eat(TokenType.DATABASE, "'database'");
    const name = this.eat(TokenType.IDENTIFIER, "database name").lexeme;

    this.eat(TokenType.LBRACE, "'{'");

    const tables: TableNode[] = [];
    const refs: RefNode[] = [];

    while (!this.check(TokenType.RBRACE) && !this.check(TokenType.EOF)) {
      if (this.check(TokenType.TABLE)) {
        tables.push(this.parseTable());
      } else if (this.check(TokenType.REF)) {
        refs.push(this.parseRef());
      } else {
        this.fail("Expected 'table', 'ref', or '}'");
      }
    }

    this.eat(TokenType.RBRACE, "'}'");

    return {
      kind: "database",
      name,
      tables: tables,
      refs: refs,
      line: start.line,
      column: start.column,
    };
  }

  /**
   * Parses a table block.
   * table := "table" IDENTIFIER "{" column* "}"
   */
  private parseTable(): TableNode {
    const start = this.eat(TokenType.TABLE, "'table'");
    const name = this.eat(TokenType.IDENTIFIER, "table name").lexeme;

    this.eat(TokenType.LBRACE, "'{'");

    const columns: ColumnNode[] = [];

    while (this.check(TokenType.IDENTIFIER)) {
      columns.push(this.parseColumn());
    }

    this.eat(TokenType.RBRACE, "'}'");

    return {
      kind: "table",
      name,
      columns: columns,
      line: start.line,
      column: start.column,
    };
  }

  /**
   * Parses a column type.
   * type := "int" | "string" | "decimal" | "boolean" | "date" | "datetime"
   */
  private parseType(): DataType {
    const token = this.current;

    switch (token.type) {
      case TokenType.INT:
        this.nextToken();
        return "int";

      case TokenType.STRING:
        this.nextToken();
        return "string";

      case TokenType.DECIMAL:
        this.nextToken();
        return "decimal";

      case TokenType.BOOLEAN:
        this.nextToken();
        return "boolean";

      case TokenType.DATE:
        this.nextToken();
        return "date";

      case TokenType.DATETIME:
        this.nextToken();
        return "datetime";

      default:
        return this.fail(
          "Expected a type: int, string, decimal, boolean, date or datetime",
        );
    }
  }

  /**
   * Parses zero or more column constraints.
   * constraint := "primary" "key" | "unique" | "not" "null" | "increment"
   */
  private parseConstraints(): Constraint[] {
    const constraints: Constraint[] = [];

    while (true) {
      const token = this.current;

      switch (token.type) {
        case TokenType.PRIMARY:
          this.nextToken();
          this.eat(TokenType.KEY, "'key' after 'primary'");
          constraints.push({
            kind: "primary key",
            line: token.line,
            column: token.column,
          });
          break;

        case TokenType.UNIQUE:
          this.nextToken();
          constraints.push({
            kind: "unique",
            line: token.line,
            column: token.column,
          });
          break;

        case TokenType.NOT:
          this.nextToken();
          this.eat(TokenType.NULL, "'null' after 'not'");
          constraints.push({
            kind: "not null",
            line: token.line,
            column: token.column,
          });
          break;

        case TokenType.INCREMENT:
          this.nextToken();
          constraints.push({
            kind: "increment",
            line: token.line,
            column: token.column,
          });
          break;

        default:
          return constraints;
      }
    }
  }

  /**
   * Parses a column declaration.
   * column := IDENTIFIER ":" type constraint*
   */
  private parseColumn(): ColumnNode {
    const start = this.eat(TokenType.IDENTIFIER, "column name");

    this.eat(TokenType.COLON, "':'");

    const dataType = this.parseType();
    const constraints = this.parseConstraints();

    return {
      kind: "column",
      name: start.lexeme,
      dataType,
      constraints,
      line: start.line,
      column: start.column,
    };
  }

  /**
   * Parses a qualified name.
   * qualified := IDENTIFIER "." IDENTIFIER
   */
  private parseQualifiedName(side: string): QualifiedName {
    const table = this.eat(TokenType.IDENTIFIER, `${side} table name`).lexeme;

    this.eat(TokenType.DOT, "'.'");

    const column = this.eat(TokenType.IDENTIFIER, `${side} column name`).lexeme;

    return { table, column };
  }

  /**
   * Parses one side of a cardinality.
   * side := "one" | "many"
   */
  private parseCardinalitySide(side: string): Cardinality {
    switch (this.current.type) {
      case TokenType.ONE:
        this.nextToken();
        return "one";

      case TokenType.MANY:
        this.nextToken();
        return "many";

      default:
        return this.fail(`Expected 'one' or 'many' for the ${side} side`);
    }
  }

  /**
   * Parses a reference between two columns.
   * ref := "ref" qualified "->" qualified cardinality
   */
  private parseRef(): RefNode {
    const start = this.eat(TokenType.REF, "'ref'");

    const from = this.parseQualifiedName("source");

    this.eat(TokenType.ARROW, "'->'");

    const to = this.parseQualifiedName("target");

    const left = this.parseCardinalitySide("left");
    this.eat(TokenType.COLON, "':' in cardinality");
    const right = this.parseCardinalitySide("right");

    return {
      kind: "ref",
      from,
      to,
      cardinality: { left, right },
      line: start.line,
      column: start.column,
    };
  }

  /**
   * Advances to the next token.
   */
  private nextToken(): void {
    this.current = this.lexer.nextToken();
  }

  /**
   * Returns true when the current token matches the given type.
   */
  private check(type: TokenType): boolean {
    return this.current.type === type;
  }

  /**
   * Consumes the current token when it matches, otherwise throws.
   */
  private eat(type: TokenType, description: string): Token {
    if (this.current.type !== type) {
      return this.fail(`Expected ${description}`);
    }

    const token = this.current;
    this.nextToken();
    return token;
  }

  /**
   * Throws a ParseError for the current token.
   */
  private fail(message: string): never {
    const detail =
      this.current.type === TokenType.NOT_SUPPORTED
        ? `Unexpected character '${this.current.lexeme}'`
        : message;

    throw new ParseError(detail, this.current);
  }

}