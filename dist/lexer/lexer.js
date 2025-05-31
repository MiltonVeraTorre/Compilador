"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.babyDuckLexer = exports.BabyDuckLexer = void 0;
const chevrotain_1 = require("chevrotain");
const tokens_1 = require("./tokens");
/**
 * Analizador Léxico de BabyDuck - Responsable de tokenizar el código fuente de BabyDuck
 */
class BabyDuckLexer {
    constructor() {
        this.lexer = new chevrotain_1.Lexer(tokens_1.allTokens);
    }
    /**
     * Tokeniza el código fuente de entrada
     * @param sourceCode El código fuente a tokenizar
     * @returns El resultado del analizador léxico que contiene tokens y cualquier error
     */
    tokenize(sourceCode) {
        return this.lexer.tokenize(sourceCode);
    }
}
exports.BabyDuckLexer = BabyDuckLexer;
// Crear y exportar una instancia singleton del analizador léxico
exports.babyDuckLexer = new BabyDuckLexer();
//# sourceMappingURL=lexer.js.map