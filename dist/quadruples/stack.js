"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stack = void 0;
/**
 * Implementación genérica de una pila (Stack)
 *
 * Se usa para las pilas de operadores, operandos y tipos
 */
class Stack {
    constructor() {
        this.items = [];
    }
    /**
     * Agrega un elemento al tope de la pila
     * @param item Elemento a agregar
     */
    push(item) {
        this.items.push(item);
    }
    /**
     * Quita y devuelve el elemento del tope de la pila
     * @returns El elemento del tope o undefined si está vacía
     */
    pop() {
        return this.items.pop();
    }
    /**
     * Mira el elemento del tope sin quitarlo
     * @returns El elemento del tope o undefined si está vacía
     */
    peek() {
        return this.items.length > 0 ? this.items[this.items.length - 1] : undefined;
    }
    /**
     * Verifica si la pila está vacía
     * @returns true si está vacía, false si no
     */
    isEmpty() {
        return this.items.length === 0;
    }
    /**
     * Devuelve el tamaño de la pila
     * @returns Número de elementos
     */
    size() {
        return this.items.length;
    }
    /**
     * Limpia la pila
     */
    clear() {
        this.items = [];
    }
    /**
     * Devuelve una copia de los elementos de la pila
     * @returns Array con los elementos
     */
    getItems() {
        return [...this.items];
    }
}
exports.Stack = Stack;
//# sourceMappingURL=stack.js.map