import { IToken } from "chevrotain";
import {
  ArgListCstNode,
  AssignCstNode,
  BabyDuckCstNode,
  BodyCstNode,
  ConditionCstNode,
  CteCstNode,
  CycleCstNode,
  ExpCstNode,
  ExpressionCstNode,
  FactorCstNode,
  FCallCstNode,
  FuncCstNode,
  ParamListCstNode,
  PrintCstNode,
  StatementCstNode,
  TermCstNode,
  TypeCstNode,
  VarsCstNode
} from '../parser/cst-types';
import {
  quadrupleGenerator,
  resetTempCounter
} from '../quadruples';
import { functionDirectory } from './function-directory';
import { DataType, Operator, semanticCube } from './semantic-cube';
import { Variable } from './variable-table';

/**
 * Interfaz para errores semanticos
 */
export interface SemanticError {
  message: string;
  line?: number;
  column?: number;
  type: 'error' | 'warning';
}

/**
 * Analizador Semantico - Hace validaciones semanticas
 *
 * Checa que las operaciones y declaraciones tengan sentido, como los tipos,
 * que las variables y funciones esten declaradas, etc.
 */
export class SemanticAnalyzer {
  private errors: SemanticError[];
  private currentType: DataType | null;

  constructor() {
    this.errors = [];
    this.currentType = null;
  }

  /**
   * Inicializa el ambito global y el generador de cuádruplos
   */
  public processProgram() {
    // Poner el programa principal
    functionDirectory.addFunction('global', DataType.VOID);
    functionDirectory.setCurrentFunction('global');

    // Reiniciar el generador de cuádruplos
    quadrupleGenerator.clear();
    resetTempCounter();
  }

  /**
   * Obtiene los cuádruplos generados
   * @returns Lista de cuádruplos
   */
  public getQuadruples() {
    return quadrupleGenerator.getQuadruples();
  }

  /**
   * Registra la dirección de inicio de una función
   * @param functionName Nombre de la función
   * @param address Dirección de inicio
   */
  public setFunctionAddress(functionName: string, address: number): void {
    quadrupleGenerator.setFunctionAddress(functionName, address);
  }

  /**
   * Resuelve todos los cuádruplos GOSUB pendientes
   */
  public resolvePendingGosubs(): void {
    quadrupleGenerator.resolvePendingGosubs();
  }

  /**
   * Genera un cuádruplo ENDPROC para marcar el final de una función
   */
  public generateEndprocQuadruple(): void {
    quadrupleGenerator.generateEndprocQuadruple();
  }

  /**
   * Genera un cuádruplo HALT para terminar el programa
   */
  public generateHaltQuadruple(): void {
    quadrupleGenerator.generateHaltQuadruple();
  }

  /**
   * Procesa las variables
   * @param varsNode Nodo de variables
   */
  public processVars(varsNode: VarsCstNode) {
    const identifiers = varsNode.children.Identifier;
    const types = varsNode.children.type;

    // Verificar que hay el mismo numero de identificadores y tipos
    if (!identifiers || !types || identifiers.length !== types.length) {
      this.addError('Numero incorrecto de identificadores o tipos', varsNode);
      return;
    }

    // Procesar cada par identificador-tipo
    for (let i = 0; i < identifiers.length; i++) {
      const idToken = identifiers[i];
      const typeNode = types[i];

      // Obtener el tipo de la variable
      this.processType(typeNode);
      const varType = this.currentType;

      if (!varType) {
        this.addError('Tipo de variable no especificado', idToken);
        continue;
      }

      const varName = idToken.image;
      const isGlobal = functionDirectory.getCurrentFunction() === 'global';

      // Intentar agregar la variable
      const added = functionDirectory.addVariable(varName, varType, isGlobal);

      if (!added) {
        this.addError(`Variable doblemente declarada: ${varName}`, idToken);
      }
    }
  }

  /**
   * Procesa una funcion
   * @param funcNode Nodo de la funcion
   */
  public processFunc(funcNode: FuncCstNode) {
    const idToken = funcNode.children.Identifier[0];
    const funcName = idToken.image;

    // Agregar la función al directorio
    const added = functionDirectory.addFunction(funcName, DataType.VOID);

    if (!added) {
      this.addError(`Función doblemente declarada: ${funcName}`, idToken);
      return;
    }

    // Procesar parametros si estan
    if (funcNode.children.paramList && funcNode.children.paramList.length > 0) {
      this.processParamList(funcNode.children.paramList[0]);
    }
  }

  /**
   * Procesa los parametros
   * @param paramListNode Nodo de parametros
   */
  public processParamList(paramListNode: ParamListCstNode) {
    const identifiers = paramListNode.children.Identifier;
    const types = paramListNode.children.type;

    if (!identifiers || !types) {
      return;
    }

    // Procesamos cada parametro
    for (let i = 0; i < identifiers.length; i++) {
      const idToken = identifiers[i];
      const typeNode = types[i];

      // Obtener el tipo
      this.processType(typeNode);
      const paramType = this.currentType;

      if (!paramType) {
        this.addError('Tipo de parametro no especificado', idToken);
        continue;
      }

      const paramName = idToken.image;

      // Intentar agregar el parámetro
      const added = functionDirectory.addParameter(paramName, paramType);

      if (!added) {
        this.addError(`Parámetro doblemente declarado: ${paramName}`, idToken);
      }
    }
  }

  /**
   * Procesa una asignacion
   * @param assignNode Nodo de asignacion
   */
  public processAssign(assignNode: AssignCstNode) {
    const idToken = assignNode.children.Identifier[0];
    const varName = idToken.image;

    // Verificar si la variable existe
    const variable = functionDirectory.lookupVariable(varName);

    if (!variable) {
      this.addError(`Variable no declarada: ${varName}`, idToken);
      return;
    }

    // Procesar la expresión
    const expressionNode = assignNode.children.expression[0];
    this.processExpression(expressionNode);
    const exprType = this.currentType;

    if (!exprType) {
      return;
    }

    // Verificar compatibilidad de tipos
    const isValid = semanticCube.isValidOperation(
      variable.type,
      Operator.ASSIGN,
      exprType
    );

    if (!isValid) {
      this.addError(
        `Tipo incompatible en asignación: no se puede asignar ${exprType} a ${variable.type}`,
        idToken
      );
      return;
    }

    // Generar el cuádruplo de asignación
    quadrupleGenerator.generateAssignmentQuadruple(varName, variable.type);
  }

  /**
   * Procesa una expresion
   * @param expressionNode Nodo de expresion
   */
  public processExpression(expressionNode: ExpressionCstNode) {
    // Procesar el primer término
    const expNode = expressionNode.children.exp[0];
    this.processExp(expNode);
    let leftType = this.currentType;

    if (!leftType) {
      return;
    }

    // Si hay un operador relacional, procesar el segundo término
    const operators = [
      expressionNode.children.GreaterThan,
      expressionNode.children.LessThan,
      expressionNode.children.GreaterEquals,
      expressionNode.children.LessEquals,
      expressionNode.children.EqualsEquals,
      expressionNode.children.NotEquals
    ];

    const operator = operators.find(op => op && op.length > 0);

    if (operator && operator.length > 0) {
      const opToken = operator[0];
      const opType = opToken.image as Operator;

      // Agregar el operador a la pila
      quadrupleGenerator.pushOperator(opType);

      // Procesar el segundo término
      const rightExpNode = expressionNode.children.exp[1];
      this.processExp(rightExpNode);
      const rightType = this.currentType;

      if (!rightType) {
        return;
      }

      // Verificar compatibilidad de tipos
      const resultType = semanticCube.getResultType(leftType, opType, rightType);

      if (resultType === DataType.ERROR) {
        this.addError(
          `Operación inválida: ${leftType} ${opType} ${rightType}`,
          opToken
        );
        this.currentType = DataType.ERROR;
      } else {
        // Generar el cuádruplo para esta operación relacional
        quadrupleGenerator.generateExpressionQuadruple();

        this.currentType = resultType;
      }
    } else {
      this.currentType = leftType;
    }
  }

  /**
   * Procesa una expresion aritmetica
   * @param expNode Nodo de expresion
   */
  public processExp(expNode: ExpCstNode) {
    // Procesar el primer término
    const termNode = expNode.children.term[0];
    this.processTerm(termNode);
    let leftType = this.currentType;

    if (!leftType) {
      return;
    }

    // Procesar operadores + y -
    const plusOperators = expNode.children.Plus;
    const minusOperators = expNode.children.Minus;
    const terms = expNode.children.term;

    if ((plusOperators && plusOperators.length > 0) ||
      (minusOperators && minusOperators.length > 0)) {

      // Procesar cada operador y término
      let currentType = leftType;
      let opIndex = 0;

      for (let i = 1; i < terms.length; i++) {
        let operator: Operator;
        let opToken: IToken;

        if (plusOperators && opIndex < plusOperators.length &&
          (!minusOperators || plusOperators[opIndex].startOffset < minusOperators[opIndex].startOffset)) {
          operator = Operator.PLUS;
          opToken = plusOperators[opIndex];
          opIndex++;
        } else if (minusOperators && opIndex < minusOperators.length) {
          operator = Operator.MINUS;
          opToken = minusOperators[opIndex];
          opIndex++;
        } else {
          break;
        }

        // Agregar el operador a la pila antes de procesar el siguiente término
        quadrupleGenerator.pushOperator(operator);

        // Procesar el siguiente término
        this.processTerm(terms[i]);
        const rightType = this.currentType;

        if (!rightType) {
          return;
        }

        // Verificar compatibilidad de tipos
        const resultType = semanticCube.getResultType(currentType, operator, rightType);

        if (resultType === DataType.ERROR) {
          this.addError(
            `Operación inválida: ${currentType} ${operator} ${rightType}`,
            opToken
          );
          this.currentType = DataType.ERROR;
          return;
        }

        // Generar el cuádruplo para esta operación
        quadrupleGenerator.generateExpressionQuadruple();

        currentType = resultType;
      }

      this.currentType = currentType;
    } else {
      this.currentType = leftType;
    }
  }

  /**
   * Procesa un termino
   * @param termNode Nodo de termino
   */
  public processTerm(termNode: TermCstNode) {
    // Procesar el primer factor
    const factorNode = termNode.children.factor[0];
    this.processFactor(factorNode);
    let leftType = this.currentType;

    if (!leftType) {
      return;
    }

    // Procesar operadores * y /
    const multiplyOperators = termNode.children.Multiply;
    const divideOperators = termNode.children.Divide;
    const factors = termNode.children.factor;

    if ((multiplyOperators && multiplyOperators.length > 0) ||
      (divideOperators && divideOperators.length > 0)) {

      // Procesar cada operador y factor
      let currentType = leftType;
      let opIndex = 0;

      for (let i = 1; i < factors.length; i++) {
        let operator: Operator;
        let opToken: IToken;

        if (multiplyOperators && opIndex < multiplyOperators.length &&
          (!divideOperators || multiplyOperators[opIndex].startOffset < divideOperators[opIndex].startOffset)) {
          operator = Operator.MULTIPLY;
          opToken = multiplyOperators[opIndex];
          opIndex++;
        } else if (divideOperators && opIndex < divideOperators.length) {
          operator = Operator.DIVIDE;
          opToken = divideOperators[opIndex];
          opIndex++;
        } else {
          break;
        }

        // Agregar el operador a la pila antes de procesar el siguiente factor
        quadrupleGenerator.pushOperator(operator);

        // Procesar el siguiente factor
        this.processFactor(factors[i]);
        const rightType = this.currentType;

        if (!rightType) {
          return;
        }

        // Verificar compatibilidad de tipos
        const resultType = semanticCube.getResultType(currentType, operator, rightType);

        if (resultType === DataType.ERROR) {
          this.addError(
            `Operación inválida: ${currentType} ${operator} ${rightType}`,
            opToken
          );
          this.currentType = DataType.ERROR;
          return;
        }

        // Generar el cuádruplo para esta operación
        quadrupleGenerator.generateExpressionQuadruple();

        currentType = resultType;
      }

      this.currentType = currentType;
    } else {
      this.currentType = leftType;
    }
  }

  /**
   * Procesa un factor
   * @param factorNode Nodo de factor
   */
  public processFactor(factorNode: FactorCstNode) {
    // Verificar si es una expresión entre paréntesis
    if (factorNode.children.expression) {
      this.processExpression(factorNode.children.expression[0]);
      return;
    }

    // Verificar si es un identificador
    if (factorNode.children.Identifier) {
      const idToken = factorNode.children.Identifier[0];
      const varName = idToken.image;

      // Verificar si la variable existe
      const variable = functionDirectory.lookupVariable(varName);

      if (!variable) {
        this.addError(`Variable no declarada: ${varName}`, idToken);
        this.currentType = DataType.ERROR;
        return;
      }

      // Agregar el identificador a la pila de operandos
      quadrupleGenerator.pushOperand(varName, variable.type);

      this.currentType = variable.type;
      return;
    }

    // Verificar si es una constante
    if (factorNode.children.cte) {
      this.processCte(factorNode.children.cte[0]);
      return;
    }

    this.currentType = DataType.ERROR;
  }

  /**
   * Procesa una constante
   * @param cteNode Nodo de constante
   */
  public processCte(cteNode: CteCstNode) {
    if (cteNode.children.CteInt) {
      const intToken = cteNode.children.CteInt[0];
      const intValue = parseInt(intToken.image);

      // Agregar la constante a la pila de operandos
      quadrupleGenerator.pushOperand(intValue, DataType.INT);

      this.currentType = DataType.INT;
      return;
    }

    if (cteNode.children.CteFloat) {
      const floatToken = cteNode.children.CteFloat[0];
      const floatValue = parseFloat(floatToken.image);

      // Agregar la constante a la pila de operandos
      quadrupleGenerator.pushOperand(floatValue, DataType.FLOAT);

      this.currentType = DataType.FLOAT;
      return;
    }

    this.currentType = DataType.ERROR;
  }

  /**
   * Procesa un tipo de datos
   * @param typeNode Nodo de tipo
   */
  public processType(typeNode: TypeCstNode) {
    if (typeNode.children.Int) {
      this.currentType = DataType.INT;
      return;
    }

    if (typeNode.children.Float) {
      this.currentType = DataType.FLOAT;
      return;
    }

    this.currentType = DataType.ERROR;
  }

  /**
   * Procesa una llamada a funcion
   * @param fCallNode Nodo de llamada
   */
  public processFunctionCall(fCallNode: FCallCstNode) {
    const idToken = fCallNode.children.Identifier[0];
    const funcName = idToken.image;

    // Verificar si la función existe
    const func = functionDirectory.lookupFunction(funcName);

    if (!func) {
      this.addError(`Función no declarada: ${funcName}`, idToken);
      return;
    }

    // Procesar argumentos evaluar expresiones antes de crear el contexto
    if (fCallNode.children.argList && fCallNode.children.argList.length > 0) {
      this.processArgList(fCallNode.children.argList[0], func.parameters);
    } else if (func.parameters.length > 0) {
      this.addError(
        `Faltan argumentos en la llamada a la función: ${funcName}`,
        idToken
      );
      return;
    }

    // Generar cuádruplo ERA
    quadrupleGenerator.generateEraQuadruple(funcName);

    // Generar cuádruplos PARAM con los valores ya evaluados
    if (fCallNode.children.argList && fCallNode.children.argList.length > 0) {
      this.generateParamQuadruples(func.parameters.length);
    }

    // Generar cuádruplo GOSUB
    quadrupleGenerator.generateGosubQuadruple(funcName);
  }

  /**
   * Procesa un estatuto de condición (if-else)
   * @param conditionNode Nodo de condición
   */
  public processCondition(conditionNode: ConditionCstNode) {
    // Procesar la expresión de la condición
    this.processExpression(conditionNode.children.expression[0]);
    const conditionType = this.currentType;

    // Verificar que la condición sea de tipo entero
    if (conditionType !== DataType.INT) {
      this.addError(
        `La condición debe ser de tipo entero (booleano), no ${conditionType}`,
        conditionNode.children.expression[0]
      );
    }

    // Generar el cuádruplo GOTOF
    const gotofIndex = quadrupleGenerator.generateGotofQuadruple();

    // Procesar el cuerpo del if
    this.processBody(conditionNode.children.body[0]);

    // Si hay un else
    if (conditionNode.children.Else) {
      // Generar un GOTO para saltar el else después de ejecutar el if
      const gotoIndex = quadrupleGenerator.generateGotoQuadruple();

      // Completar el GOTOF para saltar al else si la condición es falsa
      quadrupleGenerator.fillJump(gotofIndex, quadrupleGenerator.getNextQuadIndex());

      // Procesar el cuerpo del else
      this.processBody(conditionNode.children.body[1]);

      // Completar el GOTO para saltar después del else
      quadrupleGenerator.fillJump(gotoIndex, quadrupleGenerator.getNextQuadIndex());
    } else {
      // Si no hay else, completar el GOTOF para saltar después del if
      quadrupleGenerator.fillJump(gotofIndex, quadrupleGenerator.getNextQuadIndex());
    }
  }

  /**
   * Procesa un estatuto de ciclo (while)
   * @param cycleNode Nodo de ciclo
   */
  public processCycle(cycleNode: CycleCstNode) {
    // Guardar el índice de inicio del ciclo
    const startIndex = quadrupleGenerator.getNextQuadIndex();

    // Procesar la expresión de la condición
    this.processExpression(cycleNode.children.expression[0]);
    const conditionType = this.currentType;

    // Verificar que la condición sea de tipo entero
    if (conditionType !== DataType.INT) {
      this.addError(
        `La condición debe ser de tipo entero (booleano), no ${conditionType}`,
        cycleNode.children.expression[0]
      );
    }

    // Generar el cuádruplo GOTOF
    const gotofIndex = quadrupleGenerator.generateGotofQuadruple();

    // Procesar el cuerpo del ciclo
    this.processBody(cycleNode.children.body[0]);

    // Generar el cuádruplo GOTO para volver al inicio del ciclo
    const gotoIndex = quadrupleGenerator.generateGotoQuadruple();
    quadrupleGenerator.fillJump(gotoIndex, startIndex);

    // Completar el GOTOF para saltar después del ciclo si la condición es falsa
    quadrupleGenerator.fillJump(gotofIndex, quadrupleGenerator.getNextQuadIndex());
  }

  /**
   * Procesa un cuerpo
   * @param bodyNode Nodo de cuerpo
   */
  public processBody(bodyNode: BodyCstNode) {
    // Procesar cada estatuto en el cuerpo
    if (bodyNode.children.statement) {
      for (const statementNode of bodyNode.children.statement) {
        this.processStatement(statementNode);
      }
    }
  }

  /**
   * Procesa un estatuto
   * @param statementNode Nodo de estatuto
   */
  public processStatement(statementNode: StatementCstNode) {
    // Procesar asignación
    if (statementNode.children.assign && statementNode.children.assign.length > 0) {
      this.processAssign(statementNode.children.assign[0]);
    }

    // Procesar condición
    if (statementNode.children.condition && statementNode.children.condition.length > 0) {
      this.processCondition(statementNode.children.condition[0]);
    }

    // Procesar ciclo
    if (statementNode.children.cycle && statementNode.children.cycle.length > 0) {
      this.processCycle(statementNode.children.cycle[0]);
    }

    // Procesar llamada a función
    if (statementNode.children.f_call && statementNode.children.f_call.length > 0) {
      this.processFunctionCall(statementNode.children.f_call[0]);
    }

    // Procesar print
    if (statementNode.children.print && statementNode.children.print.length > 0) {
      this.processPrint(statementNode.children.print[0]);
    }
  }

  /**
   * Procesa un estatuto de impresión
   * @param printNode Nodo de print
   */
  public processPrint(printNode: PrintCstNode) {
    // Si hay una expresión, procesarla
    if (printNode.children.expression && printNode.children.expression.length > 0) {
      this.processExpression(printNode.children.expression[0]);

      // Generar el cuádruplo para imprimir
      quadrupleGenerator.generatePrintQuadruple();
    }
    // Si hay una cadena literal, procesarla
    else if (printNode.children.CteString && printNode.children.CteString.length > 0) {
      const stringToken = printNode.children.CteString[0];
      let stringValue = stringToken.image;

      // Remover las comillas de la cadena
      if (stringValue.startsWith('"') && stringValue.endsWith('"')) {
        stringValue = stringValue.slice(1, -1);
      }

      // Agregar la cadena como operando
      quadrupleGenerator.pushOperand(stringValue, DataType.STRING);

      // Generar el cuádruplo para imprimir
      quadrupleGenerator.generatePrintQuadruple();
    }
  }

  /**
   * Procesa argumentos (solo evalúa expresiones, no genera cuádruplos PARAM)
   * @param argListNode Nodo de argumentos
   * @param parameters Lista de parametros esperados
   */
  public processArgList(argListNode: ArgListCstNode, parameters: Variable[]) {
    const expressions = argListNode.children.expression;

    if (!expressions) {
      return;
    }

    // Verificar número de argumentos
    if (expressions.length !== parameters.length) {
      this.addError(
        `Número incorrecto de argumentos: esperados ${parameters.length}, recibidos ${expressions.length}`,
        argListNode
      );
      return;
    }

    // Verificar tipo de cada argumento
    for (let i = 0; i < expressions.length; i++) {
      this.processExpression(expressions[i]);
      const argType = this.currentType;

      if (!argType || argType === DataType.ERROR) {
        continue;
      }

      const paramType = parameters[i].type;

      // Verificar compatibilidad de tipos
      const isValid = semanticCube.isValidOperation(
        paramType,
        Operator.ASSIGN,
        argType
      );

      if (!isValid) {
        this.addError(
          `Tipo incompatible en argumento ${i + 1}: esperado ${paramType}, recibido ${argType}`,
          expressions[i]
        );
      }
    }
  }

  /**
   * Genera cuádruplos PARAM para los argumentos ya evaluados
   * @param paramCount Número de parámetros
   */
  public generateParamQuadruples(paramCount: number) {
    // Generar cuádruplos PARAM en orden inverso porque están en la pila
    for (let i = paramCount - 1; i >= 0; i--) {
      quadrupleGenerator.generateParamQuadruple(i);
    }
  }

  /**
   * Agrega un error
   * @param message Mensaje de error
   * @param nodeOrToken Donde ocurrio el error
   * @param type Tipo de error
   */
  private addError(
    message: string,
    nodeOrToken: BabyDuckCstNode | IToken | undefined,
    type: 'error' | 'warning' = 'error'
  ) {
    const error: SemanticError = { message, type };

    if (nodeOrToken && 'startLine' in nodeOrToken) {
      error.line = nodeOrToken.startLine ?? undefined;
      error.column = nodeOrToken.startColumn ?? undefined;
    }

    this.errors.push(error);
  }

  /**
   * Dame los errores
   * @returns Lista de errores
   */
  public getErrors() {
    return this.errors;
  }

  /**
   * Limpia los errores
   */
  public clearErrors() {
    this.errors = [];
  }
}

export const semanticAnalyzer = new SemanticAnalyzer();
