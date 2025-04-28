import { ILexingResult } from "chevrotain";
import { BabyDuckGrammar } from "./grammar";

/**
 * Analizador Sintáctico de BabyDuck - Analiza tokens en un Árbol de Sintaxis Concreto (CST)
 */
export class BabyDuckParser {
  private parser: BabyDuckGrammar;

  constructor() {
    this.parser = new BabyDuckGrammar();
  }

  /**
   * Analiza tokens en un Árbol de Sintaxis Concreto (CST)
   * @param lexResult El resultado del analizador léxico
   * @returns El resultado del análisis con CST y cualquier error
   */
  parse(lexResult: ILexingResult) {
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

// Crear y exportar una instancia singleton del analizador sintáctico
export const babyDuckParser = new BabyDuckParser();
