import { MemorySegment, virtualMemory } from '../memory/virtual-memory';
import { DataType } from '../semantic/semantic-cube';
import { ActivationContext, ActivationStack } from './activation-context';

/**
 * Mapa de Memoria de Ejecución
 *
 * Maneja la memoria durante la ejecución de la máquina virtual
 */
export class ExecutionMemory {
  // Memoria global (variables globales)
  private globalMemory: Map<number, any>;

  // Memoria de constantes
  private constantMemory: Map<number, any>;

  // Memoria temporal (variables temporales)
  private temporalMemory: Map<number, any>;

  // Pila de contextos de activación para funciones
  private activationStack: ActivationStack;

  constructor() {
    this.globalMemory = new Map<number, any>();
    this.constantMemory = new Map<number, any>();
    this.temporalMemory = new Map<number, any>();
    this.activationStack = new ActivationStack();
  }

  /**
   * Establece un valor en la memoria
   * @param address Dirección virtual
   * @param value Valor a establecer
   */
  public setValue(address: number, value: any): void {
    const segment = virtualMemory.getSegmentFromAddress(address);

    switch (segment) {
      case MemorySegment.GLOBAL:
        this.globalMemory.set(address, value);
        break;

      case MemorySegment.LOCAL:
        // Si no hay contexto de activación, crear uno temporal
        if (this.activationStack.isEmpty()) {
          this.activationStack.createContext('temp', 0);
        }
        this.activationStack.setLocalValue(address, value);
        break;

      case MemorySegment.PARAMETER:
        // Los parámetros se manejan como parte del contexto de activación
        if (this.activationStack.isEmpty()) {
          this.activationStack.createContext('temp', 0);
        }
        this.activationStack.setParameterValue(address, value);
        break;

      case MemorySegment.TEMPORAL:
        this.temporalMemory.set(address, value);
        break;

      case MemorySegment.CONSTANT:
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
  public getValue(address: number): any {
    const segment = virtualMemory.getSegmentFromAddress(address);

    switch (segment) {
      case MemorySegment.GLOBAL:
        return this.globalMemory.get(address);

      case MemorySegment.LOCAL:
        // Si no hay contexto de activación, retornar undefined
        if (this.activationStack.isEmpty()) {
          return undefined;
        }
        return this.activationStack.getLocalValue(address);

      case MemorySegment.PARAMETER:
        // Si no hay contexto de activación, retornar undefined
        if (this.activationStack.isEmpty()) {
          return undefined;
        }
        return this.activationStack.getParameterValue(address);

      case MemorySegment.TEMPORAL:
        return this.temporalMemory.get(address);

      case MemorySegment.CONSTANT:
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
  public hasValue(address: number): boolean {
    const segment = virtualMemory.getSegmentFromAddress(address);

    switch (segment) {
      case MemorySegment.GLOBAL:
        return this.globalMemory.has(address);

      case MemorySegment.LOCAL:
        return this.activationStack.getLocalValue(address) !== undefined;

      case MemorySegment.PARAMETER:
        return this.activationStack.getParameterValue(address) !== undefined;

      case MemorySegment.TEMPORAL:
        return this.temporalMemory.has(address);

      case MemorySegment.CONSTANT:
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
  public createActivationContext(functionName: string, returnAddress: number): void {
    this.activationStack.createContext(functionName, returnAddress);
  }

  /**
   * Obtiene el contexto de activación actual
   * @returns El contexto actual o undefined si no hay ninguno
   */
  public getCurrentActivationContext(): ActivationContext | undefined {
    return this.activationStack.getCurrentContext();
  }

  /**
   * Elimina el contexto de activación actual
   * @returns La dirección de retorno del contexto eliminado
   */
  public popActivationContext(): number | undefined {
    const context = this.activationStack.popContext();
    return context ? context.returnAddress : undefined;
  }

  /**
   * Establece un parámetro en el contexto actual
   * @param paramIndex Índice del parámetro
   * @param value Valor del parámetro
   */
  public setParameter(paramIndex: number, value: any): void {
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
  public getParameter(paramIndex: number): any {
    const paramAddress = 5000 + paramIndex;
    return this.activationStack.getParameterValue(paramAddress);
  }

  /**
   * Establece el valor de retorno del contexto actual
   * @param value Valor de retorno
   */
  public setReturnValue(value: any): void {
    this.activationStack.setReturnValue(value);
  }

  /**
   * Obtiene el valor de retorno del contexto actual
   * @returns El valor de retorno
   */
  public getReturnValue(): any {
    return this.activationStack.getReturnValue();
  }

  /**
   * Obtiene todas las memorias
   * @returns Todas las memorias
   */
  public getAllMemory(): any {
    return JSON.stringify(this.getDebugInfo());
  }

  /**
   * Inicializa una constante en la memoria
   * @param address Dirección de la constante
   * @param value Valor de la constante
   * @param type Tipo de dato
   */
  public initializeConstant(address: number, value: any, type: DataType): void {
    // Convertir el valor al tipo apropiado
    let convertedValue = value;

    switch (type) {
      case DataType.INT:
        convertedValue = parseInt(value.toString(), 10);
        break;
      case DataType.FLOAT:
        convertedValue = parseFloat(value.toString());
        break;
      case DataType.STRING:
        convertedValue = value.toString();
        break;
    }

    this.constantMemory.set(address, convertedValue);
  }

  /**
   * Limpia toda la memoria
   */
  public clear(): void {
    this.globalMemory.clear();
    this.constantMemory.clear();
    this.temporalMemory.clear();
    this.activationStack.clear();
  }

  /**
   * Obtiene información de debug sobre el estado de la memoria
   * @returns Objeto con información de debug
   */
  public getDebugInfo(): any {
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

// Exportar un singleton
export const executionMemory = new ExecutionMemory();
