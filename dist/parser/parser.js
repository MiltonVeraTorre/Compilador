"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.babyDuckParser = exports.BabyDuckParser = void 0;
const grammar_1 = require("./grammar");
/**
 * Analizador Sintáctico de BabyDuck - Analiza tokens en un Árbol de Sintaxis Concreto (CST)
 */
class BabyDuckParser {
    constructor() {
        this.parser = new grammar_1.BabyDuckGrammar();
    }
    /**
     * Analiza tokens en un Árbol de Sintaxis Concreto (CST)
     * @param lexResult El resultado del analizador léxico
     * @returns El resultado del análisis con CST y cualquier error
     */
    parse(lexResult) {
        // Establecer la entrada del analizador
        this.parser.input = lexResult.tokens;
        // Analizar la entrada
        const cst = this.parser.program();
        return {
            cst,
            parseErrors: this.parser.errors
        };
    }
}
exports.BabyDuckParser = BabyDuckParser;
// Crear y exportar una instancia singleton del analizador sintáctico
exports.babyDuckParser = new BabyDuckParser();
