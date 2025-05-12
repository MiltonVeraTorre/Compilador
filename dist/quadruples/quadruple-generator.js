"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quadrupleGenerator = exports.QuadrupleGenerator = void 0;
const stack_1 = require("./stack");
const queue_1 = require("./queue");
const quadruple_1 = require("./quadruple");
const semantic_cube_1 = require("../semantic/semantic-cube");
/**
 * Generador de Cuádruplos
 *
 * Maneja las pilas de operadores, operandos y tipos,
 * y genera cuádruplos para el código intermedio
 */
class QuadrupleGenerator {
    constructor() {
        this.operatorStack = new stack_1.Stack();
        this.operandStack = new stack_1.Stack();
        this.typeStack = new stack_1.Stack();
        this.quadruples = new queue_1.Queue();
    }
    /**
     * Agrega un operando a la pila
     * @param operand Operando (variable o valor)
     * @param type Tipo de dato
     */
    pushOperand(operand, type) {
        this.operandStack.push(operand);
        this.typeStack.push(type);
    }
    /**
     * Agrega un operador a la pila
     * @param operator Operador
     */
    pushOperator(operator) {
        this.operatorStack.push(operator);
    }
    /**
     * Genera cuádruplos para operaciones aritméticas y relacionales
     * basado en las pilas actuales
     */
    generateExpressionQuadruple() {
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
        const resultType = semantic_cube_1.semanticCube.getResultType(leftType, operator, rightType);
        if (resultType === semantic_cube_1.DataType.ERROR) {
            throw new Error(`Error en la generación de cuádruplos: tipos incompatibles ${leftType} ${operator} ${rightType}`);
        }
        // Generar variable temporal para el resultado
        const resultVar = (0, quadruple_1.generateTempVar)();
        // Crear y agregar el cuádruplo
        const quadruple = (0, quadruple_1.createQuadruple)(operator, leftOperand, rightOperand, resultVar);
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
    generateAssignmentQuadruple(variable, variableType) {
        // Obtener el valor a asignar
        const value = this.operandStack.pop();
        const valueType = this.typeStack.pop();
        if (value === undefined || valueType === undefined) {
            throw new Error('Error en la generación de cuádruplos: valor o tipo faltante');
        }
        // Verificar compatibilidad de tipos
        const isValid = semantic_cube_1.semanticCube.isValidOperation(variableType, semantic_cube_1.Operator.ASSIGN, valueType);
        if (!isValid) {
            throw new Error(`Error en la generación de cuádruplos: no se puede asignar ${valueType} a ${variableType}`);
        }
        // Crear y agregar el cuádruplo
        const quadruple = (0, quadruple_1.createQuadruple)(semantic_cube_1.Operator.ASSIGN, value, null, variable);
        this.quadruples.enqueue(quadruple);
    }
    /**
     * Genera un cuádruplo para imprimir
     */
    generatePrintQuadruple() {
        // Obtener el valor a imprimir
        const value = this.operandStack.pop();
        this.typeStack.pop(); // No necesitamos el tipo para print
        if (value === undefined) {
            throw new Error('Error en la generación de cuádruplos: valor faltante para print');
        }
        // Crear y agregar el cuádruplo
        const quadruple = (0, quadruple_1.createQuadruple)(quadruple_1.QuadrupleOperator.PRINT, value, null, null);
        this.quadruples.enqueue(quadruple);
    }
    /**
     * Obtiene todos los cuádruplos generados
     * @returns Lista de cuádruplos
     */
    getQuadruples() {
        return this.quadruples.getItems();
    }
    /**
     * Limpia todas las pilas y la fila
     */
    clear() {
        this.operatorStack.clear();
        this.operandStack.clear();
        this.typeStack.clear();
        this.quadruples.clear();
    }
}
exports.QuadrupleGenerator = QuadrupleGenerator;
// Exportar un singleton
exports.quadrupleGenerator = new QuadrupleGenerator();
