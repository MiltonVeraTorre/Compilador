"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quadrupleGenerator = exports.QuadrupleGenerator = void 0;
const stack_1 = require("./stack");
const queue_1 = require("./queue");
const quadruple_1 = require("./quadruple");
const semantic_cube_1 = require("../semantic/semantic-cube");
const function_directory_1 = require("../semantic/function-directory");
const virtual_memory_1 = require("../memory/virtual-memory");
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
        this.addressMap = new Map();
        this.jumpCounter = 0;
        // Inicializar pilas para funciones
        this.parameterStack = new stack_1.Stack();
        this.callStack = new stack_1.Stack();
        this.returnStack = new stack_1.Stack();
    }
    /**
     * Agrega un operando a la pila
     * @param operand Operando (variable o valor)
     * @param type Tipo de dato
     */
    pushOperand(operand, type) {
        // Convertir el operando a dirección virtual
        let address;
        if (typeof operand === 'string') {
            // Si es una variable, buscar su dirección o asignar una nueva
            if (this.addressMap.has(operand)) {
                address = this.addressMap.get(operand);
            }
            else {
                // Buscar la variable en el directorio de funciones
                const variable = function_directory_1.functionDirectory.lookupVariable(operand);
                if (variable && variable.address !== undefined) {
                    // Si la variable ya tiene dirección, usarla
                    address = variable.address;
                    this.addressMap.set(operand, address);
                }
                else {
                    // Si es una variable temporal (empieza con t)
                    if (operand.startsWith('t')) {
                        address = virtual_memory_1.virtualMemory.assignTempAddress(type);
                    }
                    else {
                        // Determinar si es global o local
                        const currentFunction = function_directory_1.functionDirectory.getCurrentFunction();
                        const isGlobal = currentFunction === 'global';
                        // Asignar dirección según el segmento
                        address = virtual_memory_1.virtualMemory.assignAddress(type, isGlobal ? virtual_memory_1.MemorySegment.GLOBAL : virtual_memory_1.MemorySegment.LOCAL);
                        // Guardar la dirección en la variable
                        if (variable) {
                            function_directory_1.functionDirectory.setVariableAddress(operand, address);
                        }
                    }
                    // Guardar en el mapa
                    this.addressMap.set(operand, address);
                }
            }
        }
        else {
            // Si es un valor literal, asignar dirección de constante
            address = virtual_memory_1.virtualMemory.assignConstantAddress(operand, type);
        }
        this.operandStack.push(address);
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
        const resultAddress = (0, quadruple_1.generateTempVar)(resultType);
        // Crear y agregar el cuádruplo
        const quadruple = (0, quadruple_1.createQuadruple)(operator, leftOperand, rightOperand, resultAddress);
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
    generateAssignmentQuadruple(variable, variableType) {
        // Obtener el valor a asignar
        const valueAddress = this.operandStack.pop();
        const valueType = this.typeStack.pop();
        if (valueAddress === undefined || valueType === undefined) {
            throw new Error('Error en la generación de cuádruplos: valor o tipo faltante');
        }
        // Verificar compatibilidad de tipos
        const isValid = semantic_cube_1.semanticCube.isValidOperation(variableType, semantic_cube_1.Operator.ASSIGN, valueType);
        if (!isValid) {
            throw new Error(`Error en la generación de cuádruplos: no se puede asignar ${valueType} a ${variableType}`);
        }
        // Obtener o asignar dirección para la variable
        let variableAddress;
        if (this.addressMap.has(variable)) {
            variableAddress = this.addressMap.get(variable);
        }
        else {
            // Buscar la variable en el directorio de funciones
            const variableObj = function_directory_1.functionDirectory.lookupVariable(variable);
            if (variableObj && variableObj.address !== undefined) {
                // Si la variable ya tiene dirección, usarla
                variableAddress = variableObj.address;
            }
            else {
                // Determinar si es global o local
                const currentFunction = function_directory_1.functionDirectory.getCurrentFunction();
                const isGlobal = currentFunction === 'global';
                // Asignar dirección según el segmento
                variableAddress = virtual_memory_1.virtualMemory.assignAddress(variableType, isGlobal ? virtual_memory_1.MemorySegment.GLOBAL : virtual_memory_1.MemorySegment.LOCAL);
                // Guardar la dirección en la variable
                if (variableObj) {
                    function_directory_1.functionDirectory.setVariableAddress(variable, variableAddress);
                }
            }
            // Guardar en el mapa
            this.addressMap.set(variable, variableAddress);
        }
        // Crear y agregar el cuádruplo
        const quadruple = (0, quadruple_1.createQuadruple)(semantic_cube_1.Operator.ASSIGN, valueAddress, null, variableAddress);
        this.quadruples.enqueue(quadruple);
    }
    /**
     * Genera un cuádruplo para imprimir
     */
    generatePrintQuadruple() {
        // Obtener el valor a imprimir
        const valueAddress = this.operandStack.pop();
        this.typeStack.pop(); // No necesitamos el tipo para print
        if (valueAddress === undefined) {
            throw new Error('Error en la generación de cuádruplos: valor faltante para print');
        }
        // Crear y agregar el cuádruplo
        const quadruple = (0, quadruple_1.createQuadruple)(quadruple_1.QuadrupleOperator.PRINT, valueAddress, null, null);
        this.quadruples.enqueue(quadruple);
    }
    /**
     * Genera un cuádruplo GOTO (salto incondicional)
     * @returns Índice del cuádruplo generado
     */
    generateGotoQuadruple() {
        const quadruple = (0, quadruple_1.createQuadruple)(quadruple_1.QuadrupleOperator.GOTO, null, null, null);
        this.quadruples.enqueue(quadruple);
        return this.quadruples.size() - 1;
    }
    /**
     * Genera un cuádruplo GOTOF (salto si falso)
     * @returns Índice del cuádruplo generado
     */
    generateGotofQuadruple() {
        // Obtener la condición
        const conditionAddress = this.operandStack.pop();
        const conditionType = this.typeStack.pop();
        if (conditionAddress === undefined || conditionType === undefined) {
            throw new Error('Error en la generación de cuádruplos: condición faltante para GOTOF');
        }
        // Verificar que la condición sea de tipo entero (booleano)
        if (conditionType !== semantic_cube_1.DataType.INT) {
            throw new Error(`Error en la generación de cuádruplos: condición debe ser de tipo entero, no ${conditionType}`);
        }
        // Crear y agregar el cuádruplo
        const quadruple = (0, quadruple_1.createQuadruple)(quadruple_1.QuadrupleOperator.GOTOF, conditionAddress, null, null);
        this.quadruples.enqueue(quadruple);
        return this.quadruples.size() - 1;
    }
    /**
     * Genera un cuádruplo GOTOT (salto si verdadero)
     * @returns Índice del cuádruplo generado
     */
    generateGototQuadruple() {
        // Obtener la condición
        const conditionAddress = this.operandStack.pop();
        const conditionType = this.typeStack.pop();
        if (conditionAddress === undefined || conditionType === undefined) {
            throw new Error('Error en la generación de cuádruplos: condición faltante para GOTOT');
        }
        // Verificar que la condición sea de tipo entero (booleano)
        if (conditionType !== semantic_cube_1.DataType.INT) {
            throw new Error(`Error en la generación de cuádruplos: condición debe ser de tipo entero, no ${conditionType}`);
        }
        // Crear y agregar el cuádruplo
        const quadruple = (0, quadruple_1.createQuadruple)(quadruple_1.QuadrupleOperator.GOTOT, conditionAddress, null, null);
        this.quadruples.enqueue(quadruple);
        return this.quadruples.size() - 1;
    }
    /**
     * Completa un cuádruplo de salto con la dirección de destino
     * @param quadIndex Índice del cuádruplo a completar
     * @param jumpTo Índice de destino del salto
     */
    fillJump(quadIndex, jumpTo) {
        const quad = this.quadruples.getAt(quadIndex);
        if (quad) {
            quad.result = jumpTo;
        }
    }
    /**
     * Obtiene el índice del siguiente cuádruplo
     * @returns Índice del siguiente cuádruplo
     */
    getNextQuadIndex() {
        return this.quadruples.size();
    }
    /**
     * Genera un cuádruplo ERA (Espacio de Activación)
     * @param functionName Nombre de la función
     */
    generateEraQuadruple(functionName) {
        // Buscar la función en el directorio
        const func = function_directory_1.functionDirectory.lookupFunction(functionName);
        if (!func) {
            throw new Error(`Error: función '${functionName}' no encontrada`);
        }
        // Calcular el tamaño del espacio de activación
        // (número de variables locales + parámetros)
        const localVars = func.variableTable.getAllVariables().length;
        const paramCount = func.parameters.length;
        const activationSize = localVars + paramCount;
        // Crear cuádruplo ERA con el tamaño del espacio
        const quadruple = (0, quadruple_1.createQuadruple)(quadruple_1.QuadrupleOperator.ERA, activationSize, null, null);
        this.quadruples.enqueue(quadruple);
        // Guardar el nombre de la función en la pila de llamadas
        this.callStack.push(functionName);
    }
    /**
     * Genera un cuádruplo PARAM para pasar parámetros
     * @param paramIndex Índice del parámetro (0, 1, 2, ...)
     */
    generateParamQuadruple(paramIndex) {
        // Obtener el valor del parámetro de la pila de operandos
        const paramAddress = this.operandStack.pop();
        const paramType = this.typeStack.pop();
        if (paramAddress === undefined || paramType === undefined) {
            throw new Error('Error: valor de parámetro faltante');
        }
        // Crear cuádruplo PARAM
        const quadruple = (0, quadruple_1.createQuadruple)(quadruple_1.QuadrupleOperator.PARAM, paramAddress, paramIndex, null);
        this.quadruples.enqueue(quadruple);
        // Guardar la dirección del parámetro
        this.parameterStack.push(paramAddress);
    }
    /**
     * Genera un cuádruplo GOSUB para llamar a una función
     * @param functionName Nombre de la función
     * @returns Dirección donde se guardará el valor de retorno (si aplica)
     */
    generateGosubQuadruple(functionName) {
        // Buscar la función en el directorio
        const func = function_directory_1.functionDirectory.lookupFunction(functionName);
        if (!func) {
            throw new Error(`Error: función '${functionName}' no encontrada`);
        }
        // Obtener la dirección de inicio de la función
        // (esto se llenará después cuando se procese la función)
        const functionStartAddress = this.getNextQuadIndex() + 1;
        // Si la función retorna un valor, asignar dirección temporal
        let returnAddress = null;
        if (func.type !== semantic_cube_1.DataType.VOID) {
            returnAddress = virtual_memory_1.virtualMemory.assignTempAddress(func.type);
            // Agregar el resultado a las pilas
            this.operandStack.push(returnAddress);
            this.typeStack.push(func.type);
        }
        // Crear cuádruplo GOSUB con la dirección de resultado
        const quadruple = (0, quadruple_1.createQuadruple)(quadruple_1.QuadrupleOperator.GOSUB, functionStartAddress, null, returnAddress // Aquí va la dirección donde guardar el resultado
        );
        this.quadruples.enqueue(quadruple);
        return returnAddress;
    }
    /**
     * Genera un cuádruplo RETURN para retornar de una función
     * @param hasReturnValue Si la función retorna un valor
     */
    generateReturnQuadruple(hasReturnValue = false) {
        let returnValue = null;
        if (hasReturnValue) {
            // Obtener el valor de retorno de la pila
            const returnValueFromStack = this.operandStack.pop();
            const returnType = this.typeStack.pop();
            if (returnValueFromStack === undefined || returnType === undefined) {
                throw new Error('Error: valor de retorno faltante');
            }
            returnValue = returnValueFromStack;
            // Verificar que el tipo coincida con el tipo de retorno de la función
            const currentFunction = function_directory_1.functionDirectory.getCurrentFunction();
            if (currentFunction) {
                const func = function_directory_1.functionDirectory.lookupFunction(currentFunction);
                if (func && func.type !== returnType) {
                    throw new Error(`Error: tipo de retorno incorrecto. Esperado: ${func.type}, Recibido: ${returnType}`);
                }
            }
        }
        // Crear cuádruplo RETURN
        const quadruple = (0, quadruple_1.createQuadruple)(quadruple_1.QuadrupleOperator.RETURN, returnValue, null, null);
        this.quadruples.enqueue(quadruple);
    }
    /**
     * Genera un cuádruplo ENDPROC para marcar el final de una función
     */
    generateEndprocQuadruple() {
        const quadruple = (0, quadruple_1.createQuadruple)(quadruple_1.QuadrupleOperator.ENDPROC, null, null, null);
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
        this.addressMap.clear();
        this.jumpCounter = 0;
        // Limpiar pilas de funciones
        this.parameterStack.clear();
        this.callStack.clear();
        this.returnStack.clear();
    }
}
exports.QuadrupleGenerator = QuadrupleGenerator;
// Exportar un singleton
exports.quadrupleGenerator = new QuadrupleGenerator();
//# sourceMappingURL=quadruple-generator.js.map