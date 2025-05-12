import { Operator } from '../semantic/semantic-cube';

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
  NOT_EQUALS = '!=',
  ASSIGN = '=',

  // Operadores adicionales para cuádruplos
  PRINT = 'print',
  GOTO = 'goto',
  GOTOF = 'gotof', // goto falso
  GOTOT = 'gotot', // goto verdadero
  GOSUB = 'gosub', // goto subrutina
  RETURN = 'return',
  PARAM = 'param',
  ERA = 'era', // espacio de activación
  ENDPROC = 'endproc',
}

/**
 * Estructura de un cuádruplo
 * 
 * Representa una instrucción de código intermedio
 */
export interface Quadruple {
  operator: QuadrupleOperator | Operator;
  leftOperand: string | number | null;
  rightOperand: string | number | null;
  result: string | number | null;
}

/**
 * Crea un nuevo cuádruplo
 * @param operator Operador
 * @param leftOperand Operando izquierdo
 * @param rightOperand Operando derecho
 * @param result Resultado
 * @returns Cuádruplo creado
 */
export function createQuadruple(
  operator: QuadrupleOperator | Operator,
  leftOperand: string | number | null = null,
  rightOperand: string | number | null = null,
  result: string | number | null = null
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
 * Contador para generar temporales únicos
 */
let tempCounter = 0;

/**
 * Genera un nombre de variable temporal único
 * @returns Nombre de variable temporal
 */
export function generateTempVar(): string {
  return `t${tempCounter++}`;
}

/**
 * Reinicia el contador de temporales
 */
export function resetTempCounter(): void {
  tempCounter = 0;
}
