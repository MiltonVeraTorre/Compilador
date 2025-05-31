import { ILexingResult } from "chevrotain";
import { functionDirectory } from "../semantic/function-directory";
import { semanticAnalyzer } from "../semantic/semantic-analyzer";
import {
  BodyCstNode,
  ProgramCstNode,
  StatementCstNode
} from "./cst-types";
import { BabyDuckGrammar } from "./grammar";

/**
 * Analizador sintactico de BabyDuck - Analiza tokens en un Arbol de Sintaxis Concreto y realiza analisis semántico
 */
export class BabyDuckParser {
  private parser: BabyDuckGrammar;

  constructor() {
    this.parser = new BabyDuckGrammar();
  }

  /**
   * Analiza tokens en un Árbol de Sintaxis Concreto y realiza analisis semántico
   * @param lexResult El resultado del analizador léxico
   * @returns El resultado del análisis con CST, errores sintácticos y errores semánticos
   */
  parse(lexResult: ILexingResult) {
    // Entrada del analizador
    this.parser.input = lexResult.tokens;

    // Limpiar estado
    semanticAnalyzer.clearErrors();

    // Analizar la entrada
    const cst = this.parser.program() as ProgramCstNode;

    // Si hay errores no realizar analisis semántico
    if (this.parser.errors.length > 0) {
      return {
        cst,
        parseErrors: this.parser.errors,
        semanticErrors: []
      };
    }

    // Realizar analisis semántico
    this.performSemanticAnalysis(cst);

    return {
      cst,
      parseErrors: this.parser.errors,
      semanticErrors: semanticAnalyzer.getErrors()
    };
  }

  /**
   * Realiza el analisis semántico del programa
   * @param cst Arbol de sintaxis concreto
   */
  private performSemanticAnalysis(cst: ProgramCstNode): void {
    // Procesar el programa
    const programNode = cst;

    // Inicializar el ambito global
    semanticAnalyzer.processProgram();

    // Procesar declaraciones de variables globales
    if (programNode.children.vars && programNode.children.vars.length > 0) {
      semanticAnalyzer.processVars(programNode.children.vars[0]);
    }

    // PASO 1: Declarar todas las funciones (sin procesar sus cuerpos)
    if (programNode.children.func && programNode.children.func.length > 0) {
      for (const funcNode of programNode.children.func) {
        semanticAnalyzer.processFunc(funcNode);

        // Procesar variables locales de la función
        if (funcNode.children.vars && funcNode.children.vars.length > 0) {
          semanticAnalyzer.processVars(funcNode.children.vars[0]);
        }
        // NO procesamos el cuerpo de la función aquí
      }
    }

    // PASO 2: Establecer el ambito global y procesar el cuerpo principal
    functionDirectory.setCurrentFunction('global');

    // Procesar el cuerpo principal
    if (programNode.children.body && programNode.children.body.length > 0) {
      this.processBody(programNode.children.body[0]);
    }

    // Generar cuádruplo HALT al final del main
    semanticAnalyzer.generateHaltQuadruple();

    // PASO 3: Procesar los cuerpos de las funciones
    if (programNode.children.func && programNode.children.func.length > 0) {
      for (const funcNode of programNode.children.func) {
        const idToken = funcNode.children.Identifier[0];
        const funcName = idToken.image;

        // Registrar la dirección de inicio de la función
        const functionStartAddress = semanticAnalyzer.getQuadruples().length;
        semanticAnalyzer.setFunctionAddress(funcName, functionStartAddress);

        // Cambiar al contexto de la función
        functionDirectory.setCurrentFunction(funcName);

        // Procesar el cuerpo de la función
        if (funcNode.children.body && funcNode.children.body.length > 0) {
          this.processBody(funcNode.children.body[0]);
        }

        // Generar cuádruplo ENDPROC al final de la función
        semanticAnalyzer.generateEndprocQuadruple();
      }
    }

    // PASO 4: Resolver todos los GOSUB pendientes
    semanticAnalyzer.resolvePendingGosubs();
  }

  /**
   * Procesa el cuerpo de una función o del programa principal
   * @param bodyNode Nodo del cuerpo
   */
  private processBody(bodyNode: BodyCstNode): void {
    // Usar el método processBody del analizador semántico
    semanticAnalyzer.processBody(bodyNode);
  }

  /**
   * Procesa un statement
   * @param statementNode Nodo del statement
   */
  private processStatement(statementNode: StatementCstNode): void {
    // Usar el método processStatement del analizador semántico
    semanticAnalyzer.processStatement(statementNode);
  }
}

// Exportar un singleton
export const babyDuckParser = new BabyDuckParser();
