export enum TokenType {
  // Keywords
  Database = "database",
  Table = "table",
  Ref = "ref",
  Primary = "primary",
  Key = "key",
  Unique = "unique",
  Not = "not",
  Null = "null",
  One = "one",
  Many = "many",

  // Types
  Int = "int",
  String = "string",
  Decimal = "decimal",
  Boolean = "boolean",
  Date = "date",
  DateTime = "datetime",

  // Identifiers
  Identifier = "identifier",

  // Symbols
  LBrace = "{",
  RBrace = "}",
  Colon = ":",
  Dot = ".",
  Minus = "-",
  Greater = ">",

  // Special
  EOF = "eof",
}

export type Token = {
  type: TokenType;
  lexeme: string;
};
