import { Stack } from './stack';
import { Queue } from './queue';
import {
  Quadruple,
  QuadrupleOperator,
  createQuadruple,
  generateTempVar
} from './quadruple';
import { DataType, Operator, semanticCube } from '../semantic/semantic-cube';
import { functionDirectory } from '../semantic/function-directory';
import { virtualMemory, MemorySegment } from '../memory/virtual-memory';

/**
 * Generador de Cuádruplos
 *
 * Maneja las pilas de operadores, operandos y tipos,
 * y genera cuádruplos para el código intermedio
 */
export class QuadrupleGenerator {
  // Pilas para el manejo de expresiones
  private operatorStack: Stack<Operator | QuadrupleOperator>;
  private operandStack: Stack<number>; // Ahora guarda direcciones virtuales
  private typeStack: Stack<DataType>;

  // Fila de cuádruplos generados
  private quadruples: Queue<Quadruple>;

  // Mapa para variables y sus direcciones
  private addressMap: Map<string, number>;

  // Contador para saltos
  private jumpCounter: number;

  // Pilas para manejo de funciones
  private parameterStack: Stack<number>; // Direcciones de parámetros
  private callStack: Stack<string>; // Nombres de funciones llamadas
  private returnStack: Stack<number>; // Direcciones de retorno

  constructor() {
    this.operatorStack = new Stack<Operator | QuadrupleOperator>();
    this.operandStack = new Stack<number>();
    this.typeStack = new Stack<DataType>();
    this.quadruples = new Queue<Quadruple>();
    this.addressMap = new Map<string, number>();
    this.jumpCounter = 0;

    // Inicializar pilas para funciones
    this.parameterStack = new Stack<number>();
    this.callStack = new Stack<string>();
    this.returnStack = new Stack<number>();
  }

  /**
   * Agrega un operando a la pila
   * @param operand Operando (variable o valor)
   * @param type Tipo de dato
   */
  public pushOperand(operand: string | number, type: DataType): void {
    // Convertir el operando a dirección virtual
    let address: number;

    if (typeof operand === 'string') {
      // Si es una variable, buscar su dirección o asignar una nueva
      if (this.addressMap.has(operand)) {
        address = this.addressMap.get(operand)!;
      } else {
        // Buscar la variable en el directorio de funciones
        const variable = functionDirectory.lookupVariable(operand);

        if (variable && variable.address !== undefined) {
          // Si la variable ya tiene dirección, usarla
          address = variable.address;
          this.addressMap.set(operand, address);
        } else {
          // Si es una variable temporal (empieza con t)
          if (operand.startsWith('t')) {
            address = virtualMemory.assignTempAddress(type);
          } else {
            // Determinar si es global o local
            const currentFunction = functionDirectory.getCurrentFunction();
            const isGlobal = currentFunction === 'global';

            // Asignar dirección según el segmento
            address = virtualMemory.assignAddress(
              type,
              isGlobal ? MemorySegment.GLOBAL : MemorySegment.LOCAL
            );

            // Guardar la dirección en la variable
            if (variable) {
              functionDirectory.setVariableAddress(operand, address);
            }
          }

          // Guardar en el mapa
          this.addressMap.set(operand, address);
        }
      }
    } else {
      // Si es un valor literal, asignar dirección de constante
      address = virtualMemory.assignConstantAddress(operand, type);
    }

    this.operandStack.push(address);
    this.typeStack.push(type);
  }

  /**
   * Agrega un operador a la pila
   * @param operator Operador
   */
  public pushOperator(operator: Operator | QuadrupleOperator): void {
    this.operatorStack.push(operator);
  }

  /**
   * Genera cuádruplos para operaciones aritméticas y relacionales
   * basado en las pilas actuales
   */
  public generateExpressionQuadruple(): void {
    // Obtener el operador
    const operator = this.operatorStack.pop();
    if (!operator) {
      return;
    }

    // Obtener operandos y tipos
    const rightOperand = this.operandStack.pop();
    const rightType = this.typeStack.pop();
    const leftOperand = this.operandStack.pop();
    const leftType = this.typeStack.pop();

    if (rightOperand === undefined || rightType === undefined ||
        leftOperand === undefined || leftType === undefined) {
      throw new Error('Error en la generación de cuádruplos: operandos o tipos faltantes');
    }

    // Verificar compatibilidad de tipos
    const resultType = semanticCube.getResultType(leftType, operator as Operator, rightType);
    if (resultType === DataType.ERROR) {
      throw new Error(`Error en la generación de cuádruplos: tipos incompatibles ${leftType} ${operator} ${rightType}`);
    }

    // Generar variable temporal para el resultado
    const resultAddress = generateTempVar(resultType);

    // Crear y agregar el cuádruplo
    const quadruple = createQuadruple(operator, leftOperand, rightOperand, resultAddress);
    this.quadruples.enqueue(quadruple);

    // Agregar el resultado a las pilas
    this.operandStack.push(resultAddress);
    this.typeStack.push(resultType);
  }

  /**
   * Genera un cuádruplo de asignación
   * @param variable Variable a asignar
   * @param variableType Tipo de la variable
   */
  public generateAssignmentQuadruple(variable: string, variableType: DataType): void {
    // Obtener el valor a asignar
    const valueAddress = this.operandStack.pop();
    const valueType = this.typeStack.pop();

    if (valueAddress === undefined || valueType === undefined) {
      throw new Error('Error en la generación de cuádruplos: valor o tipo faltante');
    }

    // Verificar compatibilidad de tipos
    const isValid = semanticCube.isValidOperation(variableType, Operator.ASSIGN, valueType);
    if (!isValid) {
      throw new Error(`Error en la generación de cuádruplos: no se puede asignar ${valueType} a ${variableType}`);
    }

    // Obtener o asignar dirección para la variable
    let variableAddress: number;

    if (this.addressMap.has(variable)) {
      variableAddress = this.addressMap.get(variable)!;
    } else {
      // Buscar la variable en el directorio de funciones
      const variableObj = functionDirectory.lookupVariable(variable);

      if (variableObj && variableObj.address !== undefined) {
        // Si la variable ya tiene dirección, usarla
        variableAddress = variableObj.address;
      } else {
        // Determinar si es global o local
        const currentFunction = functionDirectory.getCurrentFunction();
        const isGlobal = currentFunction === 'global';

        // Asignar dirección según el segmento
        variableAddress = virtualMemory.assignAddress(
          variableType,
          isGlobal ? MemorySegment.GLOBAL : MemorySegment.LOCAL
        );

        // Guardar la dirección en la variable
        if (variableObj) {
          functionDirectory.setVariableAddress(variable, variableAddress);
        }
      }

      // Guardar en el mapa
      this.addressMap.set(variable, variableAddress);
    }

    // Crear y agregar el cuádruplo
    const quadruple = createQuadruple(Operator.ASSIGN, valueAddress, null, variableAddress);
    this.quadruples.enqueue(quadruple);
  }

  /**
   * Genera un cuádruplo para imprimir
   */
  public generatePrintQuadruple(): void {
    // Obtener el valor a imprimir
    const valueAddress = this.operandStack.pop();
    this.typeStack.pop(); // No necesitamos el tipo para print

    if (valueAddress === undefined) {
      throw new Error('Error en la generación de cuádruplos: valor faltante para print');
    }

    // Crear y agregar el cuádruplo
    const quadruple = createQuadruple(QuadrupleOperator.PRINT, valueAddress, null, null);
    this.quadruples.enqueue(quadruple);
  }

  /**
   * Genera un cuádruplo GOTO (salto incondicional)
   * @returns Índice del cuádruplo generado
   */
  public generateGotoQuadruple(): number {
    const quadruple = createQuadruple(QuadrupleOperator.GOTO, null, null, null);
    this.quadruples.enqueue(quadruple);
    return this.quadruples.size() - 1;
  }

  /**
   * Genera un cuádruplo GOTOF (salto si falso)
   * @returns Índice del cuádruplo generado
   */
  public generateGotofQuadruple(): number {
    // Obtener la condición
    const conditionAddress = this.operandStack.pop();
    const conditionType = this.typeStack.pop();

    if (conditionAddress === undefined || conditionType === undefined) {
      throw new Error('Error en la generación de cuádruplos: condición faltante para GOTOF');
    }

    // Verificar que la condición sea de tipo entero (booleano)
    if (conditionType !== DataType.INT) {
      throw new Error(`Error en la generación de cuádruplos: condición debe ser de tipo entero, no ${conditionType}`);
    }

    // Crear y agregar el cuádruplo
    const quadruple = createQuadruple(QuadrupleOperator.GOTOF, conditionAddress, null, null);
    this.quadruples.enqueue(quadruple);
    return this.quadruples.size() - 1;
  }

  /**
   * Genera un cuádruplo GOTOT (salto si verdadero)
   * @returns Índice del cuádruplo generado
   */
  public generateGototQuadruple(): number {
    // Obtener la condición
    const conditionAddress = this.operandStack.pop();
    const conditionType = this.typeStack.pop();

    if (conditionAddress === undefined || conditionType === undefined) {
      throw new Error('Error en la generación de cuádruplos: condición faltante para GOTOT');
    }

    // Verificar que la condición sea de tipo entero (booleano)
    if (conditionType !== DataType.INT) {
      throw new Error(`Error en la generación de cuádruplos: condición debe ser de tipo entero, no ${conditionType}`);
    }

    // Crear y agregar el cuádruplo
    const quadruple = createQuadruple(QuadrupleOperator.GOTOT, conditionAddress, null, null);
    this.quadruples.enqueue(quadruple);
    return this.quadruples.size() - 1;
  }

  /**
   * Completa un cuádruplo de salto con la dirección de destino
   * @param quadIndex Índice del cuádruplo a completar
   * @param jumpTo Índice de destino del salto
   */
  public fillJump(quadIndex: number, jumpTo: number): void {
    const quad = this.quadruples.getAt(quadIndex);
    if (quad) {
      quad.result = jumpTo;
    }
  }

  /**
   * Obtiene el índice del siguiente cuádruplo
   * @returns Índice del siguiente cuádruplo
   */
  public getNextQuadIndex(): number {
    return this.quadruples.size();
  }

  /**
   * Genera un cuádruplo ERA (Espacio de Activación)
   * @param functionName Nombre de la función
   */
  public generateEraQuadruple(functionName: string): void {
    // Buscar la función en el directorio
    const func = functionDirectory.lookupFunction(functionName);
    if (!func) {
      throw new Error(`Error: función '${functionName}' no encontrada`);
    }

    // Calcular el tamaño del espacio de activación
    // (número de variables locales + parámetros)
    const localVars = func.variableTable.getAllVariables().length;
    const paramCount = func.parameters.length;
    const activationSize = localVars + paramCount;

    // Crear cuádruplo ERA con el tamaño del espacio
    const quadruple = createQuadruple(
      QuadrupleOperator.ERA,
      activationSize,
      null,
      null
    );
    this.quadruples.enqueue(quadruple);

    // Guardar el nombre de la función en la pila de llamadas
    this.callStack.push(functionName);
  }

  /**
   * Genera un cuádruplo PARAM para pasar parámetros
   * @param paramIndex Índice del parámetro (0, 1, 2, ...)
   */
  public generateParamQuadruple(paramIndex: number): void {
    // Obtener el valor del parámetro de la pila de operandos
    const paramAddress = this.operandStack.pop();
    const paramType = this.typeStack.pop();

    if (paramAddress === undefined || paramType === undefined) {
      throw new Error('Error: valor de parámetro faltante');
    }

    // Crear cuádruplo PARAM
    const quadruple = createQuadruple(
      QuadrupleOperator.PARAM,
      paramAddress,
      paramIndex,
      null
    );
    this.quadruples.enqueue(quadruple);

    // Guardar la dirección del parámetro
    this.parameterStack.push(paramAddress);
  }

  /**
   * Genera un cuádruplo GOSUB para llamar a una función
   * @param functionName Nombre de la función
   * @returns Dirección donde se guardará el valor de retorno (si aplica)
   */
  public generateGosubQuadruple(functionName: string): number | null {
    // Buscar la función en el directorio
    const func = functionDirectory.lookupFunction(functionName);
    if (!func) {
      throw new Error(`Error: función '${functionName}' no encontrada`);
    }

    // Obtener la dirección de inicio de la función
    // (esto se llenará después cuando se procese la función)
    const functionStartAddress = this.getNextQuadIndex() + 1;

    // Si la función retorna un valor, asignar dirección temporal
    let returnAddress: number | null = null;
    if (func.type !== DataType.VOID) {
      returnAddress = virtualMemory.assignTempAddress(func.type);

      // Agregar el resultado a las pilas
      this.operandStack.push(returnAddress);
      this.typeStack.push(func.type);
    }

    // Crear cuádruplo GOSUB con la dirección de resultado
    const quadruple = createQuadruple(
      QuadrupleOperator.GOSUB,
      functionStartAddress,
      null,
      returnAddress  // Aquí va la dirección donde guardar el resultado
    );
    this.quadruples.enqueue(quadruple);

    return returnAddress;
  }

  /**
   * Genera un cuádruplo RETURN para retornar de una función
   * @param hasReturnValue Si la función retorna un valor
   */
  public generateReturnQuadruple(hasReturnValue: boolean = false): void {
    let returnValue: number | null = null;

    if (hasReturnValue) {
      // Obtener el valor de retorno de la pila
      const returnValueFromStack = this.operandStack.pop();
      const returnType = this.typeStack.pop();

      if (returnValueFromStack === undefined || returnType === undefined) {
        throw new Error('Error: valor de retorno faltante');
      }

      returnValue = returnValueFromStack;

      // Verificar que el tipo coincida con el tipo de retorno de la función
      const currentFunction = functionDirectory.getCurrentFunction();
      if (currentFunction) {
        const func = functionDirectory.lookupFunction(currentFunction);
        if (func && func.type !== returnType) {
          throw new Error(`Error: tipo de retorno incorrecto. Esperado: ${func.type}, Recibido: ${returnType}`);
        }
      }
    }

    // Crear cuádruplo RETURN
    const quadruple = createQuadruple(
      QuadrupleOperator.RETURN,
      returnValue,
      null,
      null
    );
    this.quadruples.enqueue(quadruple);
  }

  /**
   * Genera un cuádruplo ENDPROC para marcar el final de una función
   */
  public generateEndprocQuadruple(): void {
    const quadruple = createQuadruple(
      QuadrupleOperator.ENDPROC,
      null,
      null,
      null
    );
    this.quadruples.enqueue(quadruple);
  }

  /**
   * Obtiene todos los cuádruplos generados
   * @returns Lista de cuádruplos
   */
  public getQuadruples(): Quadruple[] {
    return this.quadruples.getItems();
  }

  /**
   * Limpia todas las pilas y la fila
   */
  public clear(): void {
    this.operatorStack.clear();
    this.operandStack.clear();
    this.typeStack.clear();
    this.quadruples.clear();
    this.addressMap.clear();
    this.jumpCounter = 0;

    // Limpiar pilas de funciones
    this.parameterStack.clear();
    this.callStack.clear();
    this.returnStack.clear();
  }
}

// Exportar un singleton
export const quadrupleGenerator = new QuadrupleGenerator();
