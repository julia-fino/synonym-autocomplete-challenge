export interface Identifier {
  code: string;
  type: "variable" | "function" | "constant";
  equationId?: string; // Used to track which equation the identifier belongs to
}

export interface EquationEnvironment {
  variables: Identifier[];
  functions: Identifier[];
  constants: Identifier[];
}