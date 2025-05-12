"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.babyDuckParser = exports.babyDuckLexer = void 0;
exports.parseInput = parseInput;
const lexer_1 = require("./lexer/lexer");
Object.defineProperty(exports, "babyDuckLexer", { enumerable: true, get: function () { return lexer_1.babyDuckLexer; } });
const parser_1 = require("./parser/parser");
Object.defineProperty(exports, "babyDuckParser", { enumerable: true, get: function () { return parser_1.babyDuckParser; } });
const semantic_analyzer_1 = require("./semantic/semantic-analyzer");
/**
 * Analiza el código fuente de BabyDuck
 * @param sourceCode El código fuente a analizar
 * @returns El resultado del análisis con CST y cualquier error
 */
function parseInput(sourceCode) {
    // Tokenizar la entrada
    const lexResult = lexer_1.babyDuckLexer.tokenize(sourceCode);
    // Verificar errores léxicos
    if (lexResult.errors.length > 0) {
        console.error("Errores léxicos detectados:", lexResult.errors);
        return {
            cst: null,
            lexErrors: lexResult.errors,
            parseErrors: [],
            semanticErrors: [],
            quadruples: []
        };
    }
    // Analizar los tokens
    const parseResult = parser_1.babyDuckParser.parse(lexResult);
    // Verificar errores de análisis sintáctico
    if (parseResult.parseErrors.length > 0) {
        console.error("Errores de análisis sintáctico detectados:", parseResult.parseErrors);
    }
    return {
        cst: parseResult.cst,
        lexErrors: lexResult.errors,
        parseErrors: parseResult.parseErrors,
        semanticErrors: parseResult.semanticErrors || [],
        quadruples: semantic_analyzer_1.semanticAnalyzer.getQuadruples() || []
    };
}
