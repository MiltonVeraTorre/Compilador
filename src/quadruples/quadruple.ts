import { virtualMemory } from '../memory/virtual-memory';
import { DataType, Operator } from '../semantic/semantic-cube';

/**
 * Operadores adicionales para cuádruplos
 *
 * Extiende los operadores básicos del cubo semántico
 */
export enum QuadrupleOperator {
  // Operadores heredados del cubo semántico
  PLUS = '+',
  MINUS = '-',
  MULTIPLY = '*',
  DIVIDE = '/',
  GREATER_THAN = '>',
  LESS_THAN = '<',
  GREATER_EQUALS = '>=',
  LESS_EQUALS = '<=',
  EQUALS = '==',
  NOT_EQUALS = '!=',
  AND = '&&',
  OR = '||',
  NOT = '!',
  ASSIGN = '=',

  // Operadores adicionales para cuádruplos
  PRINT = 'print',
  READ = 'read',
  GOTO = 'goto',
  GOTOF = 'gotof', // goto falso
  GOTOT = 'gotot', // goto verdadero
  GOSUB = 'gosub', // goto subrutina
  RETURN = 'return',
  PARAM = 'param',
  ERA = 'era', // espacio de activación
  ENDPROC = 'endproc',
  HALT = 'halt', // terminar programa
}

/**
 * Estructura de un cuádruplo
 *
 * Representa una instrucción de código intermedio
 * Los operandos y resultados ahora son direcciones virtuales (números)
 */
export interface Quadruple {
  operator: QuadrupleOperator | Operator;
  leftOperand: number | null;
  rightOperand: number | null;
  result: number | null;
}

/**
 * Crea un nuevo cuádruplo
 * @param operator Operador
 * @param leftOperand Operando izquierdo (dirección virtual)
 * @param rightOperand Operando derecho (dirección virtual)
 * @param result Resultado (dirección virtual)
 * @returns Cuádruplo creado
 */
export function createQuadruple(
  operator: QuadrupleOperator | Operator,
  leftOperand: number | null = null,
  rightOperand: number | null = null,
  result: number | null = null
): Quadruple {
  return {
    operator,
    leftOperand,
    rightOperand,
    result
  };
}

/**
 * Convierte un cuádruplo a string para mostrar
 * @param quad Cuádruplo
 * @returns Representación en string
 */
export function quadrupleToString(quad: Quadruple): string {
  return `(${quad.operator}, ${quad.leftOperand ?? '_'}, ${quad.rightOperand ?? '_'}, ${quad.result ?? '_'})`;
}

/**
 * Genera una dirección para una variable temporal
 * @param type Tipo de dato
 * @returns Dirección virtual
 */
export function generateTempVar(type: DataType): number {
  return virtualMemory.assignTempAddress(type);
}

/**
 * Reinicia el contador de temporales
 * (Ahora se maneja en la memoria virtual)
 */
export function resetTempCounter(): void {
  // La memoria virtual se encarga de esto ahora
  virtualMemory.reset();
}
