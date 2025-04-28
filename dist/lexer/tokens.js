"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allTokens = exports.Identifier = exports.Comment = exports.WhiteSpace = exports.CteString = exports.CteInt = exports.CteFloat = exports.Divide = exports.Multiply = exports.Minus = exports.Plus = exports.NotEquals = exports.LessThan = exports.GreaterThan = exports.Equals = exports.Comma = exports.Colon = exports.SemiColon = exports.RBracket = exports.LBracket = exports.RParen = exports.LParen = exports.RBrace = exports.LBrace = exports.Print = exports.Do = exports.Else = exports.If = exports.While = exports.Void = exports.Float = exports.Int = exports.Var = exports.End = exports.Main = exports.Program = void 0;
const chevrotain_1 = require("chevrotain");
// === TOKENS DEL LENGUAJE BABYDUCK ===
// Palabras clave
exports.Program = (0, chevrotain_1.createToken)({ name: "Program", pattern: /program/ });
exports.Main = (0, chevrotain_1.createToken)({ name: "Main", pattern: /main/ });
exports.End = (0, chevrotain_1.createToken)({ name: "End", pattern: /end/ });
exports.Var = (0, chevrotain_1.createToken)({ name: "Var", pattern: /var/ });
exports.Int = (0, chevrotain_1.createToken)({ name: "Int", pattern: /int/ });
exports.Float = (0, chevrotain_1.createToken)({ name: "Float", pattern: /float/ });
exports.Void = (0, chevrotain_1.createToken)({ name: "Void", pattern: /void/ });
exports.While = (0, chevrotain_1.createToken)({ name: "While", pattern: /while/ });
exports.If = (0, chevrotain_1.createToken)({ name: "If", pattern: /if/ });
exports.Else = (0, chevrotain_1.createToken)({ name: "Else", pattern: /else/ });
exports.Do = (0, chevrotain_1.createToken)({ name: "Do", pattern: /do/ });
exports.Print = (0, chevrotain_1.createToken)({ name: "Print", pattern: /print/ });
// Símbolos
exports.LBrace = (0, chevrotain_1.createToken)({ name: "LBrace", pattern: /{/ });
exports.RBrace = (0, chevrotain_1.createToken)({ name: "RBrace", pattern: /}/ });
exports.LParen = (0, chevrotain_1.createToken)({ name: "LParen", pattern: /\(/ });
exports.RParen = (0, chevrotain_1.createToken)({ name: "RParen", pattern: /\)/ });
exports.LBracket = (0, chevrotain_1.createToken)({ name: "LBracket", pattern: /\[/ });
exports.RBracket = (0, chevrotain_1.createToken)({ name: "RBracket", pattern: /\]/ });
exports.SemiColon = (0, chevrotain_1.createToken)({ name: "SemiColon", pattern: /;/ });
exports.Colon = (0, chevrotain_1.createToken)({ name: "Colon", pattern: /:/ });
exports.Comma = (0, chevrotain_1.createToken)({ name: "Comma", pattern: /,/ });
exports.Equals = (0, chevrotain_1.createToken)({ name: "Equals", pattern: /=/ });
exports.GreaterThan = (0, chevrotain_1.createToken)({ name: "GreaterThan", pattern: />/ });
exports.LessThan = (0, chevrotain_1.createToken)({ name: "LessThan", pattern: /</ });
exports.NotEquals = (0, chevrotain_1.createToken)({ name: "NotEquals", pattern: /!=/ });
exports.Plus = (0, chevrotain_1.createToken)({ name: "Plus", pattern: /\+/ });
exports.Minus = (0, chevrotain_1.createToken)({ name: "Minus", pattern: /-/ });
exports.Multiply = (0, chevrotain_1.createToken)({ name: "Multiply", pattern: /\*/ });
exports.Divide = (0, chevrotain_1.createToken)({ name: "Divide", pattern: /\// });
// Literales
exports.CteFloat = (0, chevrotain_1.createToken)({ name: "CteFloat", pattern: /\d+\.\d+/ });
exports.CteInt = (0, chevrotain_1.createToken)({ name: "CteInt", pattern: /\d+/ });
exports.CteString = (0, chevrotain_1.createToken)({ name: "CteString", pattern: /"[^"]*"/ });
// Tokens especiales que se omitirán
exports.WhiteSpace = (0, chevrotain_1.createToken)({
    name: "WhiteSpace",
    pattern: /\s+/,
    group: chevrotain_1.Lexer.SKIPPED
});
exports.Comment = (0, chevrotain_1.createToken)({
    name: "Comment",
    pattern: /\/\/[^\n]*/,
    group: chevrotain_1.Lexer.SKIPPED
});
// Identificador - debe definirse después de las palabras clave para que LongerAlt funcione
exports.Identifier = (0, chevrotain_1.createToken)({
    name: "Identifier",
    pattern: /[a-zA-Z_][a-zA-Z0-9_]*/,
    longer_alt: [
        exports.Program, exports.Main, exports.End, exports.Var, exports.Int, exports.Float, exports.Void,
        exports.While, exports.If, exports.Else, exports.Do, exports.Print // Omitir las palabras clave
    ]
});
// El orden es importante - los tokens se emparejan en el orden de definición
exports.allTokens = [
    // Tokens a omitir
    exports.WhiteSpace,
    exports.Comment,
    // Palabras clave
    exports.Program,
    exports.Main,
    exports.End,
    exports.Var,
    exports.Int,
    exports.Float,
    exports.Void,
    exports.While,
    exports.If,
    exports.Else,
    exports.Do,
    exports.Print,
    // Símbolos
    exports.LBrace,
    exports.RBrace,
    exports.LParen,
    exports.RParen,
    exports.LBracket,
    exports.RBracket,
    exports.SemiColon,
    exports.Colon,
    exports.Comma,
    exports.Equals,
    exports.GreaterThan,
    exports.LessThan,
    exports.NotEquals,
    exports.Plus,
    exports.Minus,
    exports.Multiply,
    exports.Divide,
    // Literales
    exports.CteFloat,
    exports.CteInt,
    exports.CteString,
    // Identificador - debe ser el último para evitar conflictos con palabras clave
    exports.Identifier
];
