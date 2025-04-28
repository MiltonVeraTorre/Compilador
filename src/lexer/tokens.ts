import { createToken, Lexer } from "chevrotain";

// === TOKENS DEL LENGUAJE BABYDUCK ===

// Palabras clave
export const Program = createToken({ name: "Program", pattern: /program/ });
export const Main = createToken({ name: "Main", pattern: /main/ });
export const End = createToken({ name: "End", pattern: /end/ });
export const Var = createToken({ name: "Var", pattern: /var/ });
export const Int = createToken({ name: "Int", pattern: /int/ });
export const Float = createToken({ name: "Float", pattern: /float/ });
export const Void = createToken({ name: "Void", pattern: /void/ });
export const While = createToken({ name: "While", pattern: /while/ });
export const If = createToken({ name: "If", pattern: /if/ });
export const Else = createToken({ name: "Else", pattern: /else/ });
export const Do = createToken({ name: "Do", pattern: /do/ });
export const Print = createToken({ name: "Print", pattern: /print/ });

// Símbolos
export const LBrace = createToken({ name: "LBrace", pattern: /{/ });
export const RBrace = createToken({ name: "RBrace", pattern: /}/ });
export const LParen = createToken({ name: "LParen", pattern: /\(/ });
export const RParen = createToken({ name: "RParen", pattern: /\)/ });
export const LBracket = createToken({ name: "LBracket", pattern: /\[/ });
export const RBracket = createToken({ name: "RBracket", pattern: /\]/ });
export const SemiColon = createToken({ name: "SemiColon", pattern: /;/ });
export const Colon = createToken({ name: "Colon", pattern: /:/ });
export const Comma = createToken({ name: "Comma", pattern: /,/ });
export const Equals = createToken({ name: "Equals", pattern: /=/ });
export const GreaterThan = createToken({ name: "GreaterThan", pattern: />/ });
export const LessThan = createToken({ name: "LessThan", pattern: /</ });
export const NotEquals = createToken({ name: "NotEquals", pattern: /!=/ });
export const Plus = createToken({ name: "Plus", pattern: /\+/ });
export const Minus = createToken({ name: "Minus", pattern: /-/ });
export const Multiply = createToken({ name: "Multiply", pattern: /\*/ });
export const Divide = createToken({ name: "Divide", pattern: /\// });

// Literales
export const CteFloat = createToken({ name: "CteFloat", pattern: /\d+\.\d+/ });
export const CteInt = createToken({ name: "CteInt", pattern: /\d+/ });
export const CteString = createToken({ name: "CteString", pattern: /"[^"]*"/ });

// Tokens especiales que se omitirán
export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED
});

export const Comment = createToken({
  name: "Comment",
  pattern: /\/\/[^\n]*/,
  group: Lexer.SKIPPED
});

// Identificador - debe definirse después de las palabras clave para que LongerAlt funcione
export const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z_][a-zA-Z0-9_]*/,
  longer_alt: [
    Program, Main, End, Var, Int, Float, Void,
    While, If, Else, Do, Print // Omitir las palabras clave
  ]
});

// El orden es importante - los tokens se emparejan en el orden de definición
export const allTokens = [
  // Tokens a omitir
  WhiteSpace,
  Comment,

  // Palabras clave
  Program,
  Main,
  End,
  Var,
  Int,
  Float,
  Void,
  While,
  If,
  Else,
  Do,
  Print,

  // Símbolos
  LBrace,
  RBrace,
  LParen,
  RParen,
  LBracket,
  RBracket,
  SemiColon,
  Colon,
  Comma,
  Equals,
  GreaterThan,
  LessThan,
  NotEquals,
  Plus,
  Minus,
  Multiply,
  Divide,

  // Literales
  CteFloat,
  CteInt,
  CteString,

  // Identificador - debe ser el último para evitar conflictos con palabras clave
  Identifier
];
