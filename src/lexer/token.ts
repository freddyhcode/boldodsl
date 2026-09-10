export enum TokenType {
  // Keywords
  DATABASE = "DATABASE",
  TABLE = "TABLE",
  REF = "REF",
  PRIMARY = "PRIMARY",
  KEY = "KEY",
  UNIQUE = "UNIQUE",
  NOT = "NOT",
  NULL = "NULL",
  INCREMENT = "INCREMENT",
  ONE = "ONE",
  MANY = "MANY",

  // Types
  INT = "INT",
  STRING = "STRING",
  DECIMAL = "DECIMAL",
  BOOLEAN = "BOOLEAN",
  DATE = "DATE",
  DATETIME = "DATETIME",

  // Identifiers
  IDENTIFIER = "IDENTIFIER",

  // Symbols
  LBRACE = "LBRACE",
  RBRACE = "RBRACE",
  COLON = "COLON",
  DOT = "DOT",
  MINUS = "MINUS",
  GREATER = "GREATER",
  ARROW = "ARROW",

  // Special
  NOT_SUPPORTED = "NOT_SUPPORTED",
  EOF = "EOF",
}

export type Token = {
  type: TokenType;
  lexeme: string;
  line: number;
  column: number;
};
