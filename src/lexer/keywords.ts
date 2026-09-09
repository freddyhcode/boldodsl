import { TokenType } from "./token.js";

/**
 * Map of language control and structure keywords to their corresponding token types.
 */
export const KEYWORDS: Record<string, TokenType> = {
  database: TokenType.DATABASE,
  table: TokenType.TABLE,
  ref: TokenType.REF,
  primary: TokenType.PRIMARY,
  key: TokenType.KEY,
  unique: TokenType.UNIQUE,
  not: TokenType.NOT,
  null: TokenType.NULL,
  increment: TokenType.INCREMENT,
  one: TokenType.ONE,
  many: TokenType.MANY,
};

/**
 * Map of primitive data type keywords to their corresponding token types.
 */
export const TYPE_KEYWORDS: Record<string, TokenType> = {
  int: TokenType.INT,
  string: TokenType.STRING,
  decimal: TokenType.DECIMAL,
  boolean: TokenType.BOOLEAN,
  date: TokenType.DATE,
  datetime: TokenType.DATETIME,
};
