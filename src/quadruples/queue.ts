/**
 * Implementación genérica de una fila (Queue)
 * 
 * Se usa para la fila de cuádruplos
 */
export class Queue<T> {
  private items: T[];

  constructor() {
    this.items = [];
  }

  /**
   * Agrega un elemento al final de la fila
   * @param item Elemento a agregar
   */
  enqueue(item: T): void {
    this.items.push(item);
  }

  /**
   * Quita y devuelve el elemento del frente de la fila
   * @returns El elemento del frente o undefined si está vacía
   */
  dequeue(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items.shift();
  }

  /**
   * Mira el elemento del frente sin quitarlo
   * @returns El elemento del frente o undefined si está vacía
   */
  front(): T | undefined {
    return this.isEmpty() ? undefined : this.items[0];
  }

  /**
   * Verifica si la fila está vacía
   * @returns true si está vacía, false si no
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Devuelve el tamaño de la fila
   * @returns Número de elementos
   */
  size(): number {
    return this.items.length;
  }

  /**
   * Limpia la fila
   */
  clear(): void {
    this.items = [];
  }

  /**
   * Devuelve una copia de los elementos de la fila
   * @returns Array con los elementos
   */
  getItems(): T[] {
    return [...this.items];
  }

  /**
   * Obtiene un elemento por su índice
   * @param index Índice del elemento
   * @returns El elemento o undefined si el índice es inválido
   */
  getAt(index: number): T | undefined {
    if (index < 0 || index >= this.items.length) {
      return undefined;
    }
    return this.items[index];
  }
}
