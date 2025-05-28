/**
 * Contexto de Activación
 *
 * Representa el espacio de memoria para una función durante su ejecución
 */
export interface ActivationContext {
  functionName: string;
  returnAddress: number; // Dirección de retorno en los cuádruplos
  localMemory: Map<number, any>; // Mapa de direcciones locales a valores
  parameterMemory: Map<number, any>; // Mapa de direcciones de parámetros a valores
  returnValue?: any; // Valor de retorno (si aplica)
  resultAddress?: number; // Dirección donde guardar el resultado de la función
}

/**
 * Pila de Contextos de Activación
 *
 * Maneja los contextos de activación durante la ejecución de funciones
 */
export class ActivationStack {
  private stack: ActivationContext[];

  constructor() {
    this.stack = [];
  }

  /**
   * Crea un nuevo contexto de activación
   * @param functionName Nombre de la función
   * @param returnAddress Dirección de retorno
   * @returns El contexto creado
   */
  public createContext(functionName: string, returnAddress: number): ActivationContext {
    const context: ActivationContext = {
      functionName,
      returnAddress,
      localMemory: new Map<number, any>(),
      parameterMemory: new Map<number, any>()
    };

    this.stack.push(context);
    return context;
  }

  /**
   * Obtiene el contexto actual (tope de la pila)
   * @returns El contexto actual o undefined si la pila está vacía
   */
  public getCurrentContext(): ActivationContext | undefined {
    return this.stack.length > 0 ? this.stack[this.stack.length - 1] : undefined;
  }

  /**
   * Elimina el contexto actual de la pila
   * @returns El contexto eliminado o undefined si la pila está vacía
   */
  public popContext(): ActivationContext | undefined {
    return this.stack.pop();
  }

  /**
   * Verifica si la pila está vacía
   * @returns true si está vacía, false en caso contrario
   */
  public isEmpty(): boolean {
    return this.stack.length === 0;
  }

  /**
   * Obtiene el tamaño de la pila
   * @returns Número de contextos en la pila
   */
  public size(): number {
    return this.stack.length;
  }

  /**
   * Limpia la pila de contextos
   */
  public clear(): void {
    this.stack = [];
  }

  /**
   * Establece un valor en la memoria local del contexto actual
   * @param address Dirección de memoria
   * @param value Valor a establecer
   */
  public setLocalValue(address: number, value: any): void {
    const context = this.getCurrentContext();
    if (context) {
      context.localMemory.set(address, value);
    } else {
      throw new Error('No hay contexto de activación actual');
    }
  }

  /**
   * Obtiene un valor de la memoria local del contexto actual
   * @param address Dirección de memoria
   * @returns El valor almacenado o undefined si no existe
   */
  public getLocalValue(address: number): any {
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
  public setParameterValue(address: number, value: any): void {
    const context = this.getCurrentContext();
    if (context) {
      context.parameterMemory.set(address, value);
    } else {
      throw new Error('No hay contexto de activación actual');
    }
  }

  /**
   * Obtiene un valor de la memoria de parámetros del contexto actual
   * @param address Dirección de memoria
   * @returns El valor almacenado o undefined si no existe
   */
  public getParameterValue(address: number): any {
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
  public setReturnValue(value: any): void {
    const context = this.getCurrentContext();
    if (context) {
      context.returnValue = value;
    } else {
      throw new Error('No hay contexto de activación actual');
    }
  }

  /**
   * Obtiene el valor de retorno del contexto actual
   * @returns El valor de retorno o undefined si no existe
   */
  public getReturnValue(): any {
    const context = this.getCurrentContext();
    return context ? context.returnValue : undefined;
  }
}
