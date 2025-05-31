"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualMachine = void 0;
const virtual_memory_1 = require("../memory/virtual-memory");
const quadruple_1 = require("../quadruples/quadruple");
const semantic_cube_1 = require("../semantic/semantic-cube");
const execution_memory_1 = require("./execution-memory");
/**
 * Máquina Virtual de BabyDuck
 *
 * Ejecuta los cuádruplos generados por el compilador
 */
class VirtualMachine {
    constructor(memory) {
        this.memory = memory || execution_memory_1.executionMemory;
        this.instructionPointer = 0;
        this.quadruples = [];
        this.output = [];
        this.running = false;
    }
    /**
     * Carga los cuádruplos para ejecutar
     * @param quadruples Lista de cuádruplos
     */
    loadQuadruples(quadruples) {
        this.quadruples = quadruples;
        this.instructionPointer = 0;
        this.output = [];
        this.running = false;
    }
    /**
     * Ejecuta los cuádruplos cargados
     * @returns La salida generada durante la ejecución
     */
    execute() {
        this.running = true;
        this.instructionPointer = 0;
        // Inicializar las constantes en la memoria antes de ejecutar
        this.initializeConstants();
        while (this.running && this.instructionPointer < this.quadruples.length) {
            const quad = this.quadruples[this.instructionPointer];
            this.executeQuadruple(quad);
            this.instructionPointer++;
        }
        return this.output;
    }
    /**
     * Inicializa las constantes en la memoria de ejecución
     */
    initializeConstants() {
        const constants = virtual_memory_1.virtualMemory.getConstantsArray();
        for (const constant of constants) {
            this.memory.initializeConstant(constant.address, constant.value, constant.type);
        }
    }
    /**
     * Ejecuta un cuádruplo individual
     * @param quad Cuádruplo a ejecutar
     */
    executeQuadruple(quad) {
        switch (quad.operator) {
            // Operaciones aritméticas
            case semantic_cube_1.Operator.PLUS:
            case quadruple_1.QuadrupleOperator.PLUS:
                this.executeArithmetic(quad, (a, b) => a + b);
                break;
            case semantic_cube_1.Operator.MINUS:
            case quadruple_1.QuadrupleOperator.MINUS:
                this.executeArithmetic(quad, (a, b) => a - b);
                break;
            case semantic_cube_1.Operator.MULTIPLY:
            case quadruple_1.QuadrupleOperator.MULTIPLY:
                this.executeArithmetic(quad, (a, b) => a * b);
                break;
            case semantic_cube_1.Operator.DIVIDE:
            case quadruple_1.QuadrupleOperator.DIVIDE:
                this.executeArithmetic(quad, (a, b) => {
                    if (b === 0) {
                        throw new Error('Error de ejecución: División por cero');
                    }
                    return a / b;
                });
                break;
            // Operaciones relacionales
            case semantic_cube_1.Operator.GREATER_THAN:
            case quadruple_1.QuadrupleOperator.GREATER_THAN:
                this.executeRelational(quad, (a, b) => a > b ? 1 : 0);
                break;
            case semantic_cube_1.Operator.LESS_THAN:
            case quadruple_1.QuadrupleOperator.LESS_THAN:
                this.executeRelational(quad, (a, b) => a < b ? 1 : 0);
                break;
            case semantic_cube_1.Operator.NOT_EQUALS:
            case quadruple_1.QuadrupleOperator.NOT_EQUALS:
                this.executeRelational(quad, (a, b) => a !== b ? 1 : 0);
                break;
            case semantic_cube_1.Operator.GREATER_EQUALS:
            case quadruple_1.QuadrupleOperator.GREATER_EQUALS:
                this.executeRelational(quad, (a, b) => a >= b ? 1 : 0);
                break;
            case semantic_cube_1.Operator.LESS_EQUALS:
            case quadruple_1.QuadrupleOperator.LESS_EQUALS:
                this.executeRelational(quad, (a, b) => a <= b ? 1 : 0);
                break;
            case semantic_cube_1.Operator.EQUALS:
            case quadruple_1.QuadrupleOperator.EQUALS:
                this.executeRelational(quad, (a, b) => a === b ? 1 : 0);
                break;
            // Operaciones lógicas
            case semantic_cube_1.Operator.AND:
            case quadruple_1.QuadrupleOperator.AND:
                this.executeLogical(quad, (a, b) => (a && b) ? 1 : 0);
                break;
            case semantic_cube_1.Operator.OR:
            case quadruple_1.QuadrupleOperator.OR:
                this.executeLogical(quad, (a, b) => (a || b) ? 1 : 0);
                break;
            case semantic_cube_1.Operator.NOT:
            case quadruple_1.QuadrupleOperator.NOT:
                this.executeUnary(quad, (a) => (!a || a === 0) ? 1 : 0);
                break;
            // Asignación
            case semantic_cube_1.Operator.ASSIGN:
            case quadruple_1.QuadrupleOperator.ASSIGN:
                this.executeAssignment(quad);
                break;
            // Operaciones de control
            case quadruple_1.QuadrupleOperator.PRINT:
                this.executePrint(quad);
                break;
            case quadruple_1.QuadrupleOperator.READ:
                this.executeRead(quad);
                break;
            case quadruple_1.QuadrupleOperator.GOTO:
                this.executeGoto(quad);
                break;
            case quadruple_1.QuadrupleOperator.GOTOF:
                this.executeGotof(quad);
                break;
            case quadruple_1.QuadrupleOperator.GOTOT:
                this.executeGotot(quad);
                break;
            // Operaciones de funciones
            case quadruple_1.QuadrupleOperator.ERA:
                this.executeEra(quad);
                break;
            case quadruple_1.QuadrupleOperator.PARAM:
                this.executeParam(quad);
                break;
            case quadruple_1.QuadrupleOperator.GOSUB:
                this.executeGosub(quad);
                break;
            case quadruple_1.QuadrupleOperator.RETURN:
                this.executeReturn(quad);
                break;
            case quadruple_1.QuadrupleOperator.ENDPROC:
                this.executeEndproc(quad);
                break;
            case quadruple_1.QuadrupleOperator.HALT:
                this.executeHalt(quad);
                break;
            default:
                throw new Error(`Operador desconocido: ${quad.operator}`);
        }
    }
    /**
     * Ejecuta una operación aritmética
     * @param quad Cuádruplo
     * @param operation Función de operación
     */
    executeArithmetic(quad, operation) {
        const leftValue = this.memory.getValue(quad.leftOperand);
        const rightValue = this.memory.getValue(quad.rightOperand);
        const result = operation(leftValue, rightValue);
        this.memory.setValue(quad.result, result);
    }
    /**
     * Ejecuta una operación relacional
     * @param quad Cuádruplo
     * @param operation Función de operación
     */
    executeRelational(quad, operation) {
        const leftValue = this.memory.getValue(quad.leftOperand);
        const rightValue = this.memory.getValue(quad.rightOperand);
        const result = operation(leftValue, rightValue);
        this.memory.setValue(quad.result, result);
    }
    /**
     * Ejecuta una asignación
     * @param quad Cuádruplo
     */
    executeAssignment(quad) {
        const value = this.memory.getValue(quad.leftOperand);
        this.memory.setValue(quad.result, value);
    }
    /**
     * Ejecuta una operación de impresión
     * @param quad Cuádruplo
     */
    executePrint(quad) {
        const value = this.memory.getValue(quad.leftOperand);
        if (value !== undefined) {
            this.output.push(value.toString());
        }
        else {
            this.output.push('undefined');
        }
    }
    /**
     * Ejecuta un salto incondicional
     * @param quad Cuádruplo
     */
    executeGoto(quad) {
        this.instructionPointer = quad.result - 1; // -1 porque se incrementará después
    }
    /**
     * Ejecuta un salto condicional (si falso)
     * @param quad Cuádruplo
     */
    executeGotof(quad) {
        const condition = this.memory.getValue(quad.leftOperand);
        if (!condition || condition === 0) {
            this.instructionPointer = quad.result - 1;
        }
    }
    /**
     * Ejecuta un salto condicional (si verdadero)
     * @param quad Cuádruplo
     */
    executeGotot(quad) {
        const condition = this.memory.getValue(quad.leftOperand);
        if (condition && condition !== 0) {
            this.instructionPointer = quad.result - 1;
        }
    }
    /**
     * Ejecuta la creación de un espacio de activación
     * @param quad Cuádruplo
     */
    executeEra(quad) {
        // El tamaño del espacio está en leftOperand (no se usa actualmente pero se mantiene para compatibilidad)
        // Crear el contexto de activación inmediatamente
        this.memory.createActivationContext('function', this.instructionPointer + 1);
    }
    /**
     * Ejecuta el paso de un parámetro
     * @param quad Cuádruplo
     */
    executeParam(quad) {
        const paramValue = this.memory.getValue(quad.leftOperand);
        const paramIndex = quad.rightOperand;
        // Los parámetros van en direcciones específicas dentro del contexto actual
        // Cada contexto de activación tiene su propio espacio de parámetros
        const paramAddress = 5000 + paramIndex;
        // Usar el contexto de activación actual para almacenar el parámetro
        const context = this.memory.getCurrentActivationContext();
        if (context) {
            context.parameterMemory.set(paramAddress, paramValue);
        }
        else {
            // Si no hay contexto, usar el método normal (para compatibilidad)
            this.memory.setValue(paramAddress, paramValue);
        }
    }
    /**
     * Ejecuta una llamada a subrutina
     * @param quad Cuádruplo
     */
    executeGosub(quad) {
        // Obtener el contexto actual y actualizar la dirección de retorno
        const context = this.memory.getCurrentActivationContext();
        console.log(`[DEBUG] GOSUB: IP actual: ${this.instructionPointer}, contexto: ${context === null || context === void 0 ? void 0 : context.functionName}`);
        if (context) {
            context.returnAddress = this.instructionPointer + 1;
            console.log(`[DEBUG] GOSUB: returnAddress establecido a: ${context.returnAddress}`);
            // Si hay dirección de resultado (quad.result), guardarla en el contexto
            if (quad.result !== null) {
                context.resultAddress = quad.result;
            }
        }
        // Saltar a la función
        this.instructionPointer = quad.leftOperand - 1;
        console.log(`[DEBUG] GOSUB: saltando a IP: ${this.instructionPointer}`);
    }
    /**
     * Ejecuta un retorno de función
     * @param quad Cuádruplo
     */
    executeReturn(quad) {
        // Obtener el contexto actual antes de eliminarlo
        const context = this.memory.getCurrentActivationContext();
        // Si hay valor de retorno, guardarlo en la dirección especificada en GOSUB
        if (quad.leftOperand !== null && context && context.resultAddress !== undefined) {
            const returnValue = this.memory.getValue(quad.leftOperand);
            // Guardar el valor de retorno en la dirección especificada en GOSUB
            this.memory.setValue(context.resultAddress, returnValue);
        }
        // Regresar a la dirección de retorno
        const returnAddress = this.memory.popActivationContext();
        if (returnAddress !== undefined) {
            this.instructionPointer = returnAddress - 1;
        }
    }
    /**
     * Ejecuta el final de un procedimiento
     * @param quad Cuádruplo
     */
    executeEndproc(_quad) {
        // Obtener el contexto actual antes de eliminarlo
        const context = this.memory.getCurrentActivationContext();
        console.log(`[DEBUG] ENDPROC: contexto actual: ${context === null || context === void 0 ? void 0 : context.functionName}, returnAddress: ${context === null || context === void 0 ? void 0 : context.returnAddress}`);
        if (context) {
            // Regresar a la dirección de retorno
            const returnAddress = this.memory.popActivationContext();
            console.log(`[DEBUG] ENDPROC: returnAddress obtenido: ${returnAddress}`);
            if (returnAddress !== undefined) {
                // Establecer la dirección de retorno menos 1 porque el bucle principal incrementará
                // returnAddress apunta al siguiente cuádruple después del GOSUB
                this.instructionPointer = returnAddress - 1;
                console.log(`[DEBUG] ENDPROC: IP establecido a: ${this.instructionPointer} (returnAddress=${returnAddress})`);
            }
            else {
                // Si no hay dirección de retorno, terminar la ejecución
                console.log(`[DEBUG] ENDPROC: Sin dirección de retorno, terminando`);
                this.running = false;
            }
        }
        else {
            // Si no hay contexto, terminar la ejecución (programa principal)
            console.log(`[DEBUG] ENDPROC: Sin contexto, terminando`);
            this.running = false;
        }
    }
    /**
     * Ejecuta la terminación del programa
     * @param _quad Cuádruplo
     */
    executeHalt(_quad) {
        console.log(`[DEBUG] HALT: Terminando programa`);
        this.running = false;
    }
    /**
     * Obtiene la salida generada
     * @returns Array de strings con la salida
     */
    getOutput() {
        return this.output;
    }
    /**
     * Ejecuta una operación lógica
     * @param quad Cuádruplo
     * @param operation Función de operación lógica
     */
    executeLogical(quad, operation) {
        const leftValue = this.memory.getValue(quad.leftOperand);
        const rightValue = this.memory.getValue(quad.rightOperand);
        const result = operation(leftValue, rightValue);
        this.memory.setValue(quad.result, result);
    }
    /**
     * Ejecuta una operación unaria
     * @param quad Cuádruplo
     * @param operation Función de operación unaria
     */
    executeUnary(quad, operation) {
        const value = this.memory.getValue(quad.leftOperand);
        const result = operation(value);
        this.memory.setValue(quad.result, result);
    }
    /**
     * Ejecuta una operación de lectura (READ)
     * @param quad Cuádruplo
     */
    executeRead(quad) {
        // Por simplicidad, simulamos la entrada del usuario con valores predefinidos
        // En una implementación real, esto leería de stdin o una interfaz de usuario
        const address = quad.result;
        // Simulamos entrada del usuario - en tests se puede configurar
        let inputValue = 0;
        // Si hay un valor en leftOperand, lo usamos como valor por defecto para testing
        if (quad.leftOperand !== null) {
            inputValue = this.memory.getValue(quad.leftOperand);
        }
        this.memory.setValue(address, inputValue);
    }
    /**
     * Limpia la máquina virtual
     */
    clear() {
        this.memory.clear();
        this.instructionPointer = 0;
        this.quadruples = [];
        this.output = [];
        this.running = false;
    }
    getMemoryDebugInfo() {
        return this.memory.getDebugInfo();
    }
}
exports.VirtualMachine = VirtualMachine;
//# sourceMappingURL=virtual-machine.js.map