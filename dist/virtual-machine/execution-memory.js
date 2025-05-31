"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executionMemory = exports.ExecutionMemory = void 0;
const semantic_cube_1 = require("../semantic/semantic-cube");
const virtual_memory_1 = require("../memory/virtual-memory");
const activation_context_1 = require("./activation-context");
/**
 * Mapa de Memoria de Ejecución
 *
 * Maneja la memoria durante la ejecución de la máquina virtual
 */
class ExecutionMemory {
    constructor() {
        this.globalMemory = new Map();
        this.constantMemory = new Map();
        this.temporalMemory = new Map();
        this.activationStack = new activation_context_1.ActivationStack();
    }
    /**
     * Establece un valor en la memoria
     * @param address Dirección virtual
     * @param value Valor a establecer
     */
    setValue(address, value) {
        const segment = virtual_memory_1.virtualMemory.getSegmentFromAddress(address);
        switch (segment) {
            case virtual_memory_1.MemorySegment.GLOBAL:
                this.globalMemory.set(address, value);
                break;
            case virtual_memory_1.MemorySegment.LOCAL:
                // Si no hay contexto de activación, crear uno temporal
                if (this.activationStack.isEmpty()) {
                    this.activationStack.createContext('temp', 0);
                }
                this.activationStack.setLocalValue(address, value);
                break;
            case virtual_memory_1.MemorySegment.TEMPORAL:
                this.temporalMemory.set(address, value);
                break;
            case virtual_memory_1.MemorySegment.CONSTANT:
                this.constantMemory.set(address, value);
                break;
            default:
                throw new Error(`Segmento de memoria desconocido para la dirección ${address}`);
        }
    }
    /**
     * Obtiene un valor de la memoria
     * @param address Dirección virtual
     * @returns El valor almacenado
     */
    getValue(address) {
        const segment = virtual_memory_1.virtualMemory.getSegmentFromAddress(address);
        switch (segment) {
            case virtual_memory_1.MemorySegment.GLOBAL:
                return this.globalMemory.get(address);
            case virtual_memory_1.MemorySegment.LOCAL:
                // Si no hay contexto de activación, retornar undefined
                if (this.activationStack.isEmpty()) {
                    return undefined;
                }
                return this.activationStack.getLocalValue(address);
            case virtual_memory_1.MemorySegment.TEMPORAL:
                return this.temporalMemory.get(address);
            case virtual_memory_1.MemorySegment.CONSTANT:
                return this.constantMemory.get(address);
            default:
                throw new Error(`Segmento de memoria desconocido para la dirección ${address}`);
        }
    }
    /**
     * Verifica si existe un valor en la dirección especificada
     * @param address Dirección virtual
     * @returns true si existe, false en caso contrario
     */
    hasValue(address) {
        const segment = virtual_memory_1.virtualMemory.getSegmentFromAddress(address);
        switch (segment) {
            case virtual_memory_1.MemorySegment.GLOBAL:
                return this.globalMemory.has(address);
            case virtual_memory_1.MemorySegment.LOCAL:
                return this.activationStack.getLocalValue(address) !== undefined;
            case virtual_memory_1.MemorySegment.TEMPORAL:
                return this.temporalMemory.has(address);
            case virtual_memory_1.MemorySegment.CONSTANT:
                return this.constantMemory.has(address);
            default:
                return false;
        }
    }
    /**
     * Crea un nuevo contexto de activación para una función
     * @param functionName Nombre de la función
     * @param returnAddress Dirección de retorno
     */
    createActivationContext(functionName, returnAddress) {
        this.activationStack.createContext(functionName, returnAddress);
    }
    /**
     * Obtiene el contexto de activación actual
     * @returns El contexto actual o undefined si no hay ninguno
     */
    getCurrentActivationContext() {
        return this.activationStack.getCurrentContext();
    }
    /**
     * Elimina el contexto de activación actual
     * @returns La dirección de retorno del contexto eliminado
     */
    popActivationContext() {
        const context = this.activationStack.popContext();
        return context ? context.returnAddress : undefined;
    }
    /**
     * Establece un parámetro en el contexto actual
     * @param paramIndex Índice del parámetro
     * @param value Valor del parámetro
     */
    setParameter(paramIndex, value) {
        // Los parámetros se almacenan con direcciones especiales
        // basadas en el índice del parámetro
        const paramAddress = 5000 + paramIndex; // Rango de parámetros
        this.activationStack.setParameterValue(paramAddress, value);
    }
    /**
     * Obtiene un parámetro del contexto actual
     * @param paramIndex Índice del parámetro
     * @returns El valor del parámetro
     */
    getParameter(paramIndex) {
        const paramAddress = 5000 + paramIndex;
        return this.activationStack.getParameterValue(paramAddress);
    }
    /**
     * Establece el valor de retorno del contexto actual
     * @param value Valor de retorno
     */
    setReturnValue(value) {
        this.activationStack.setReturnValue(value);
    }
    /**
     * Obtiene el valor de retorno del contexto actual
     * @returns El valor de retorno
     */
    getReturnValue() {
        return this.activationStack.getReturnValue();
    }
    /**
     * Obtiene todas las memorias
     * @returns Todas las memorias
     */
    getAllMemory() {
        return JSON.stringify(this.getDebugInfo());
    }
    /**
     * Inicializa una constante en la memoria
     * @param address Dirección de la constante
     * @param value Valor de la constante
     * @param type Tipo de dato
     */
    initializeConstant(address, value, type) {
        // Convertir el valor al tipo apropiado
        let convertedValue = value;
        switch (type) {
            case semantic_cube_1.DataType.INT:
                convertedValue = parseInt(value.toString(), 10);
                break;
            case semantic_cube_1.DataType.FLOAT:
                convertedValue = parseFloat(value.toString());
                break;
            case semantic_cube_1.DataType.STRING:
                convertedValue = value.toString();
                break;
        }
        this.constantMemory.set(address, convertedValue);
    }
    /**
     * Limpia toda la memoria
     */
    clear() {
        this.globalMemory.clear();
        this.constantMemory.clear();
        this.temporalMemory.clear();
        this.activationStack.clear();
    }
    /**
     * Obtiene información de debug sobre el estado de la memoria
     * @returns Objeto con información de debug
     */
    getDebugInfo() {
        return {
            globalMemorySize: this.globalMemory.size,
            constantMemorySize: this.constantMemory.size,
            temporalMemorySize: this.temporalMemory.size,
            activationStackSize: this.activationStack.size(),
            globalMemory: Object.fromEntries(this.globalMemory),
            constantMemory: Object.fromEntries(this.constantMemory),
            temporalMemory: Object.fromEntries(this.temporalMemory)
        };
    }
}
exports.ExecutionMemory = ExecutionMemory;
// Exportar un singleton
exports.executionMemory = new ExecutionMemory();
//# sourceMappingURL=execution-memory.js.map