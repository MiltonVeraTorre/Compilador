import { ILexingResult } from "chevrotain";
import { BabyDuckGrammar } from "./grammar";
import { semanticAnalyzer } from "../semantic/semantic-analyzer";
import { functionDirectory } from "../semantic/function-directory";
import {
  ProgramCstNode,
  BodyCstNode,
  StatementCstNode
} from "./cst-types";

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

    // Procesar declaraciones de funciones
    if (programNode.children.func && programNode.children.func.length > 0) {
      for (const funcNode of programNode.children.func) {
        semanticAnalyzer.processFunc(funcNode);

        // Procesar variables locales de la función
        if (funcNode.children.vars && funcNode.children.vars.length > 0) {
          semanticAnalyzer.processVars(funcNode.children.vars[0]);
        }

        // Procesar el cuerpo de la función
        if (funcNode.children.body && funcNode.children.body.length > 0) {
          this.processBody(funcNode.children.body[0]);
        }
      }
    }

    // Establecer el ambito global para el cuerpo principal
    functionDirectory.setCurrentFunction('global');

    // Procesar el cuerpo principal
    if (programNode.children.body && programNode.children.body.length > 0) {
      this.processBody(programNode.children.body[0]);
    }
  }

  /**
   * Procesa el cuerpo de una función o del programa principal
   * @param bodyNode Nodo del cuerpo
   */
  private processBody(bodyNode: BodyCstNode): void {
    // Procesar cada statement
    if (bodyNode.children.statement && bodyNode.children.statement.length > 0) {
      for (const statementNode of bodyNode.children.statement) {
        this.processStatement(statementNode);
      }
    }
  }

  /**
   * Procesa un statement
   * @param statementNode Nodo del statement
   */
  private processStatement(statementNode: StatementCstNode): void {
    // Procesar asignación
    if (statementNode.children.assign && statementNode.children.assign.length > 0) {
      semanticAnalyzer.processAssign(statementNode.children.assign[0]);
    }

    // Procesar condición
    if (statementNode.children.condition && statementNode.children.condition.length > 0) {
      const conditionNode = statementNode.children.condition[0];

      // Procesar la expresión de la condición
      if (conditionNode.children.expression && conditionNode.children.expression.length > 0) {
        semanticAnalyzer.processExpression(conditionNode.children.expression[0]);
      }

      // Procesar el cuerpo de la condición
      if (conditionNode.children.body && conditionNode.children.body.length > 0) {
        this.processBody(conditionNode.children.body[0]);
      }

      // Procesar el cuerpo del else si existe
      if (conditionNode.children.body && conditionNode.children.body.length > 1) {
        this.processBody(conditionNode.children.body[1]);
      }
    }

    // Procesar ciclo
    if (statementNode.children.cycle && statementNode.children.cycle.length > 0) {
      const cycleNode = statementNode.children.cycle[0];

      // Procesar la expresión del ciclo
      if (cycleNode.children.expression && cycleNode.children.expression.length > 0) {
        semanticAnalyzer.processExpression(cycleNode.children.expression[0]);
      }

      // Procesar el cuerpo del ciclo
      if (cycleNode.children.body && cycleNode.children.body.length > 0) {
        this.processBody(cycleNode.children.body[0]);
      }
    }

    // Procesar llamada a función
    if (statementNode.children.f_call && statementNode.children.f_call.length > 0) {
      semanticAnalyzer.processFunctionCall(statementNode.children.f_call[0]);
    }

    // Procesar print
    if (statementNode.children.print && statementNode.children.print.length > 0) {
      const printNode = statementNode.children.print[0];

      // Procesar las expresiones del print
      if (printNode.children.expression && printNode.children.expression.length > 0) {
        for (const expressionNode of printNode.children.expression) {
          semanticAnalyzer.processExpression(expressionNode);
        }
      }
    }
  }
}

// Exportar un singleton
export const babyDuckParser = new BabyDuckParser();
