/**
 * Implementación genérica de una pila (Stack)
 * 
 * Se usa para las pilas de operadores, operandos y tipos
 */
export class Stack<T> {
  private items: T[];

  constructor() {
    this.items = [];
  }

  /**
   * Agrega un elemento al tope de la pila
   * @param item Elemento a agregar
   */
  push(item: T): void {
    this.items.push(item);
  }

  /**
   * Quita y devuelve el elemento del tope de la pila
   * @returns El elemento del tope o undefined si está vacía
   */
  pop(): T | undefined {
    return this.items.pop();
  }

  /**
   * Mira el elemento del tope sin quitarlo
   * @returns El elemento del tope o undefined si está vacía
   */
  peek(): T | undefined {
    return this.items.length > 0 ? this.items[this.items.length - 1] : undefined;
  }

  /**
   * Verifica si la pila está vacía
   * @returns true si está vacía, false si no
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Devuelve el tamaño de la pila
   * @returns Número de elementos
   */
  size(): number {
    return this.items.length;
  }

  /**
   * Limpia la pila
   */
  clear(): void {
    this.items = [];
  }

  /**
   * Devuelve una copia de los elementos de la pila
   * @returns Array con los elementos
   */
  getItems(): T[] {
    return [...this.items];
  }
}
