import { Lexer } from "chevrotain";
import { allTokens } from "./tokens";

/**
 * Analizador Léxico de BabyDuck - Responsable de tokenizar el código fuente de BabyDuck
 */
export class BabyDuckLexer {
  private lexer: Lexer;

  constructor() {
    this.lexer = new Lexer(allTokens);
  }

  /**
   * Tokeniza el código fuente de entrada
   * @param sourceCode El código fuente a tokenizar
   * @returns El resultado del analizador léxico que contiene tokens y cualquier error
   */
  tokenize(sourceCode: string) {
    return this.lexer.tokenize(sourceCode);
  }
}

export const babyDuckLexer = new BabyDuckLexer();
