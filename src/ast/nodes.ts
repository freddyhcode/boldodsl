/**
 * AST node definitions for Boldodsl.
 * Every node stores the source position of its first token.
 */

/** Primitive data types supported by the DSL. */
export type DataType = "int" | "string" | "decimal" | "boolean" | "date" | "datetime";

/**
 * Constraint kinds as defined by the grammar.
 * `primary key` and `not null` are single constraints made of two keywords.
 */
export type ConstraintKind = "primary key" | "unique" | "not null" | "increment";

/** Side of a relationship cardinality. */
export type Cardinality = "one" | "many";

/** Constraint attached to a column, with its source position. */
export type Constraint = {
  kind: ConstraintKind;
  line: number;
  column: number;
};

/** Column declared inside a table. */
export type ColumnNode = {
  kind: "column";
  name: string;
  dataType: DataType;
  constraints: Constraint[];
  line: number;
  column: number;
};

/** Table declared inside a database. */
export type TableNode = {
  kind: "table";
  name: string;
  columns: ColumnNode[];
  line: number;
  column: number;
};

/** Table and column reference used by a `ref` endpoint. */
export type QualifiedName = {
  table: string;
  column: string;
};

/** Relationship between two columns. */
export type RefNode = {
  kind: "ref";
  from: QualifiedName;
  to: QualifiedName;
  cardinality: {
    left: Cardinality;
    right: Cardinality;
  };
  line: number;
  column: number;
};

/** Root node returned by the parser. */
export type DatabaseNode = {
  kind: "database";
  name: string;
  tables: TableNode[];
  refs: RefNode[];
  line: number;
  column: number;
};