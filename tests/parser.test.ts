import { describe, expect, it } from "vitest";
import { Lexer } from "../src/lexer/lexer.js";
import { ParseError } from "../src/parser/parser-error.js";
import { Parser } from "../src/parser/parser.js";

describe("Tests parser.ts", () => {
  it("should parse an empty database", () => {
    const parser = new Parser(new Lexer("database ecommerce {}"));

    expect(parser.parse()).toEqual({
      kind: "database",
      name: "ecommerce",
      tables: [],
      refs: [],
      line: 1,
      column: 1,
    });
  });

  it("should parse a table named constructor", () => {
    const parser = new Parser(
      new Lexer("database d { table constructor { id: int } }"),
    );

    expect(parser.parse().tables[0].name).toBe("constructor");
  });

  it("should parse a source with a UTF-8 BOM", () => {
    const parser = new Parser(new Lexer("\uFEFFdatabase d {}"));

    expect(parser.parse().name).toBe("d");
  });

  it("should parse all supported column types", () => {
    const parser = new Parser(
      new Lexer(`
        database ecommerce {
          table values {
            a: int
            b: string
            c: decimal
            d: boolean
            e: date
            f: datetime
          }
        }
      `),
    );

    const columns = parser.parse().tables[0].columns;

    expect(columns.map((column) => column.dataType)).toEqual([
      "int",
      "string",
      "decimal",
      "boolean",
      "date",
      "datetime",
    ]);
  });

  it("should parse columns with constraints", () => {
    const parser = new Parser(
      new Lexer(`
        database ecommerce {
          table users {
            id: int primary key increment
            username: string not null
            email: string unique
          }
        }
      `),
    );

    const columns = parser.parse().tables[0].columns;

    expect(
      columns.map((column) => ({
        name: column.name,
        dataType: column.dataType,
        constraints: column.constraints.map((constraint) => constraint.kind),
      })),
    ).toEqual([
      {
        name: "id",
        dataType: "int",
        constraints: ["primary key", "increment"],
      },
      {
        name: "username",
        dataType: "string",
        constraints: ["not null"],
      },
      {
        name: "email",
        dataType: "string",
        constraints: ["unique"],
      },
    ]);
  });

  it("should parse all cardinalities", () => {
    const parser = new Parser(
      new Lexer(`
        database ecommerce {
          table users { id: int }
          table orders { id: int }
          ref orders.id -> users.id one:one
          ref orders.id -> users.id one:many
          ref orders.id -> users.id many:one
          ref orders.id -> users.id many:many
        }
      `),
    );

    const refs = parser.parse().refs;

    expect(
      refs.map((ref) => `${ref.cardinality.left}:${ref.cardinality.right}`),
    ).toEqual(["one:one", "one:many", "many:one", "many:many"]);
  });

  it("should parse a reference", () => {
    const parser = new Parser(
      new Lexer(`
        database ecommerce {
          table users { id: int primary key }
          table orders { user_id: int not null }
          ref orders.user_id -> users.id many:one
        }
      `),
    );

    expect(parser.parse().refs[0]).toMatchObject({
      kind: "ref",
      from: { table: "orders", column: "user_id" },
      to: { table: "users", column: "id" },
      cardinality: { left: "many", right: "one" },
    });
  });

  it("should parse the README example", () => {
    const parser = new Parser(
      new Lexer(`
        database ecommerce {
          table users {
            id: int primary key increment
            username: string not null
            email: string unique
          }

          table orders {
            id: int primary key increment
            user_id: int not null
            total: decimal
          }

          ref orders.user_id -> users.id many:one
        }
      `),
    );

    const database = parser.parse();

    expect(database.name).toBe("ecommerce");
    expect(database.tables.map((table) => table.name)).toEqual([
      "users",
      "orders",
    ]);
    expect(database.tables[0].columns).toHaveLength(3);
    expect(database.tables[1].columns).toHaveLength(3);
    expect(database.refs).toHaveLength(1);
  });

  it("should report the token position for a missing colon", () => {
    const source = "database ecommerce {\n  table users {\n    id int\n  }\n}";

    expect(() => new Parser(new Lexer(source)).parse()).toThrow(
      /line 3, column 8; found "int"/,
    );
  });

  it("should reject a missing database name", () => {
    expect(() => new Parser(new Lexer("database {}")).parse()).toThrow(
      /Expected database name/,
    );
  });

  it("should reject an invalid column type", () => {
    expect(
      () => new Parser(new Lexer("database d { table t { id: foo } }")).parse(),
    ).toThrow(/Expected a type/);
  });

  it("should reject 'primary' without 'key'", () => {
    expect(
      () =>
        new Parser(
          new Lexer("database d { table t { id: int primary } }"),
        ).parse(),
    ).toThrow(/Expected 'key' after 'primary'/);
  });

  it("should reject 'not' without 'null'", () => {
    expect(
      () =>
        new Parser(
          new Lexer("database d { table t { id: int not } }"),
        ).parse(),
    ).toThrow(/Expected 'null' after 'not'/);
  });

  it("should reject a reference without an arrow", () => {
    expect(
      () =>
        new Parser(
          new Lexer("database d { table a { id: int } ref a.id a.id one:one }"),
        ).parse(),
    ).toThrow(/Expected '->'/);
  });

  it("should reject an invalid cardinality", () => {
    expect(
      () =>
        new Parser(
          new Lexer(
            "database d { table a { id: int } ref a.id -> a.id maybe:one }",
          ),
        ).parse(),
    ).toThrow(/Expected 'one' or 'many' for the left side/);
  });

  it("should reject an unexpected character", () => {
    expect(
      () =>
        new Parser(new Lexer("database d { table t { id: int * } }")).parse(),
    ).toThrow("Unexpected character '*'");
  });

  it("should reject an unclosed table", () => {
    expect(
      () => new Parser(new Lexer("database d { table t { id: int")).parse(),
    ).toThrow(/Expected '}'/);
  });

  it("should reject trailing tokens", () => {
    expect(() => new Parser(new Lexer("database d {} extra")).parse()).toThrow(
      /Expected end of file/,
    );
  });

  it("should throw ParseError instances", () => {
    expect(() => new Parser(new Lexer("database {}")).parse()).toThrow(
      ParseError,
    );
  });
});
