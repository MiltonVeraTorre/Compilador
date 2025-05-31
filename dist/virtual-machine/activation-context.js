"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivationStack = void 0;
/**
 * Pila de Contextos de Activación
 *
 * Maneja los contextos de activación durante la ejecución de funciones
 */
class ActivationStack {
    constructor() {
        this.stack = [];
    }
    /**
     * Crea un nuevo contexto de activación
     * @param functionName Nombre de la función
     * @param returnAddress Dirección de retorno
     * @returns El contexto creado
     */
    createContext(functionName, returnAddress) {
        const context = {
            functionName,
            returnAddress,
            localMemory: new Map(),
            parameterMemory: new Map()
        };
        this.stack.push(context);
        return context;
    }
    /**
     * Obtiene el contexto actual
     * @returns El contexto actual o undefined si la pila está vacía
     */
    getCurrentContext() {
        return this.stack.length > 0 ? this.stack[this.stack.length - 1] : undefined;
    }
    /**
     * Elimina el contexto actual de la pila
     * @returns El contexto eliminado o undefined si la pila está vacía
     */
    popContext() {
        return this.stack.pop();
    }
    /**
     * Verifica si la pila está vacía
     * @returns true si está vacía, false en caso contrario
     */
    isEmpty() {
        return this.stack.length === 0;
    }
    /**
     * Obtiene el tamaño de la pila
     * @returns Número de contextos en la pila
     */
    size() {
        return this.stack.length;
    }
    /**
     * Limpia la pila de contextos
     */
    clear() {
        this.stack = [];
    }
    /**
     * Establece un valor en la memoria local del contexto actual
     * @param address Dirección de memoria
     * @param value Valor a establecer
     */
    setLocalValue(address, value) {
        const context = this.getCurrentContext();
        if (context) {
            context.localMemory.set(address, value);
        }
        else {
            throw new Error('No hay contexto de activación actual');
        }
    }
    /**
     * Obtiene un valor de la memoria local del contexto actual
     * @param address Dirección de memoria
     * @returns El valor almacenado o undefined si no existe
     */
    getLocalValue(address) {
        const context = this.getCurrentContext();
        if (context) {
            return context.localMemory.get(address);
        }
        return undefined;
    }
    /**
     * Establece un valor en la memoria de parámetros del contexto actual
     * @param address Dirección de memoria
     * @param value Valor a establecer
     */
    setParameterValue(address, value) {
        const context = this.getCurrentContext();
        if (context) {
            context.parameterMemory.set(address, value);
        }
        else {
            throw new Error('No hay contexto de activación actual');
        }
    }
    /**
     * Obtiene un valor de la memoria de parámetros del contexto actual
     * @param address Dirección de memoria
     * @returns El valor almacenado o undefined si no existe
     */
    getParameterValue(address) {
        const context = this.getCurrentContext();
        if (context) {
            return context.parameterMemory.get(address);
        }
        return undefined;
    }
    /**
     * Establece el valor de retorno del contexto actual
     * @param value Valor de retorno
     */
    setReturnValue(value) {
        const context = this.getCurrentContext();
        if (context) {
            context.returnValue = value;
        }
        else {
            throw new Error('No hay contexto de activación actual');
        }
    }
    /**
     * Obtiene el valor de retorno del contexto actual
     * @returns El valor de retorno o undefined si no existe
     */
    getReturnValue() {
        const context = this.getCurrentContext();
        return context ? context.returnValue : undefined;
    }
}
exports.ActivationStack = ActivationStack;
//# sourceMappingURL=activation-context.js.map