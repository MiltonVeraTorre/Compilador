"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
/**
 * Implementación genérica de una fila (Queue)
 *
 * Se usa para la fila de cuádruplos
 */
class Queue {
    constructor() {
        this.items = [];
    }
    /**
     * Agrega un elemento al final de la fila
     * @param item Elemento a agregar
     */
    enqueue(item) {
        this.items.push(item);
    }
    /**
     * Quita y devuelve el elemento del frente de la fila
     * @returns El elemento del frente o undefined si está vacía
     */
    dequeue() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items.shift();
    }
    /**
     * Mira el elemento del frente sin quitarlo
     * @returns El elemento del frente o undefined si está vacía
     */
    front() {
        return this.isEmpty() ? undefined : this.items[0];
    }
    /**
     * Verifica si la fila está vacía
     * @returns true si está vacía, false si no
     */
    isEmpty() {
        return this.items.length === 0;
    }
    /**
     * Devuelve el tamaño de la fila
     * @returns Número de elementos
     */
    size() {
        return this.items.length;
    }
    /**
     * Limpia la fila
     */
    clear() {
        this.items = [];
    }
    /**
     * Devuelve una copia de los elementos de la fila
     * @returns Array con los elementos
     */
    getItems() {
        return [...this.items];
    }
    /**
     * Obtiene un elemento por su índice
     * @param index Índice del elemento
     * @returns El elemento o undefined si el índice es inválido
     */
    getAt(index) {
        if (index < 0 || index >= this.items.length) {
            return undefined;
        }
        return this.items[index];
    }
}
exports.Queue = Queue;
//# sourceMappingURL=queue.js.map