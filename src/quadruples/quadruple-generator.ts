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

/**
 * Generador de Cuádruplos
 * 
 * Maneja las pilas de operadores, operandos y tipos,
 * y genera cuádruplos para el código intermedio
 */
export class QuadrupleGenerator {
  // Pilas para el manejo de expresiones
  private operatorStack: Stack<Operator | QuadrupleOperator>;
  private operandStack: Stack<string | number>;
  private typeStack: Stack<DataType>;
  
  // Fila de cuádruplos generados
  private quadruples: Queue<Quadruple>;

  constructor() {
    this.operatorStack = new Stack<Operator | QuadrupleOperator>();
    this.operandStack = new Stack<string | number>();
    this.typeStack = new Stack<DataType>();
    this.quadruples = new Queue<Quadruple>();
  }

  /**
   * Agrega un operando a la pila
   * @param operand Operando (variable o valor)
   * @param type Tipo de dato
   */
  public pushOperand(operand: string | number, type: DataType): void {
    this.operandStack.push(operand);
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
    const resultVar = generateTempVar();

    // Crear y agregar el cuádruplo
    const quadruple = createQuadruple(operator, leftOperand, rightOperand, resultVar);
    this.quadruples.enqueue(quadruple);

    // Agregar el resultado a las pilas
    this.operandStack.push(resultVar);
    this.typeStack.push(resultType);
  }

  /**
   * Genera un cuádruplo de asignación
   * @param variable Variable a asignar
   * @param variableType Tipo de la variable
   */
  public generateAssignmentQuadruple(variable: string, variableType: DataType): void {
    // Obtener el valor a asignar
    const value = this.operandStack.pop();
    const valueType = this.typeStack.pop();

    if (value === undefined || valueType === undefined) {
      throw new Error('Error en la generación de cuádruplos: valor o tipo faltante');
    }

    // Verificar compatibilidad de tipos
    const isValid = semanticCube.isValidOperation(variableType, Operator.ASSIGN, valueType);
    if (!isValid) {
      throw new Error(`Error en la generación de cuádruplos: no se puede asignar ${valueType} a ${variableType}`);
    }

    // Crear y agregar el cuádruplo
    const quadruple = createQuadruple(Operator.ASSIGN, value, null, variable);
    this.quadruples.enqueue(quadruple);
  }

  /**
   * Genera un cuádruplo para imprimir
   */
  public generatePrintQuadruple(): void {
    // Obtener el valor a imprimir
    const value = this.operandStack.pop();
    this.typeStack.pop(); // No necesitamos el tipo para print

    if (value === undefined) {
      throw new Error('Error en la generación de cuádruplos: valor faltante para print');
    }

    // Crear y agregar el cuádruplo
    const quadruple = createQuadruple(QuadrupleOperator.PRINT, value, null, null);
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
  }
}

// Exportar un singleton
export const quadrupleGenerator = new QuadrupleGenerator();
