import { DataType } from './semantic-cube';
import { Variable, VariableTable } from './variable-table';

/**
 * Estructura de una funcion
 */
export interface Function {
  name: string;
  type: DataType;
  parameters: Variable[];
  variableTable: VariableTable;
  startAddress?: number;
}

/**
 * Directorio de Funciones - Guarda todas las funciones
 *
 * Tiene info de todas las funciones con sus parametros y variables
 */
export class FunctionDirectory {
  private functions: Map<string, Function>;
  private globalVariableTable: VariableTable;
  private currentFunction: string | null;

  constructor() {
    this.functions = new Map<string, Function>();
    this.globalVariableTable = new VariableTable();
    this.currentFunction = null;

    // Inicializar con el ámbito global
    this.addFunction('global', DataType.VOID);
  }

  /**
   * Agrega una funcion
   * @param name Nombre
   * @param type Tipo de retorno
   * @returns true si se agrego bien, false si ya existe
   */
  public addFunction(name: string, type: DataType) {
    // Verificar si la función ya existe
    if (this.functions.has(name)) {
      return false;
    }

    // Crear una nueva tabla de variables
    const variableTable = new VariableTable();

    // Agregar la función al directorio
    this.functions.set(name, {
      name,
      type,
      parameters: [],
      variableTable
    });

    // Establecer como función actual
    this.currentFunction = name;

    return true;
  }

  /**
   * Agrega un parametro
   * @param name Nombre
   * @param type Tipo
   * @returns true si se agrego bien, false si hubo error
   */
  public addParameter(name: string, type: DataType) {
    if (!this.currentFunction) {
      return false;
    }

    const func = this.functions.get(this.currentFunction);
    if (!func) {
      return false;
    }

    // Verificar si el parámetro ya existe
    if (func.variableTable.variableExists(name)) {
      return false;
    }

    // Calcular la dirección del parámetro basada en su índice
    // Los parámetros van en direcciones 5000 + índice
    const paramIndex = func.parameters.length;
    const paramAddress = 5000 + paramIndex;

    // Agregar el parametro a la tabla de variables de la función con dirección específica
    func.variableTable.addVariable(name, type, true);
    func.variableTable.setVariableAddress(name, paramAddress);

    // Agregar el parametro a la lista de parámetros
    func.parameters.push({
      name,
      type,
      isParameter: true,
      address: paramAddress
    });

    return true;
  }

  /**
   * Agrega una variable
   * @param name Nombre
   * @param type Tipo
   * @param isGlobal Si es global o no
   * @returns true si se agrego bien, false si ya existe
   */
  public addVariable(name: string, type: DataType, isGlobal: boolean = false) {
    if (isGlobal) {
      return this.globalVariableTable.addVariable(name, type);
    }

    if (!this.currentFunction) {
      return false;
    }

    const func = this.functions.get(this.currentFunction);
    if (!func) {
      return false;
    }

    return func.variableTable.addVariable(name, type);
  }

  /**
   * Busca una variable
   * @param name Nombre
   * @returns La variable o undefined
   */
  public lookupVariable(name: string) {
    // Primero buscar en el ámbito actual
    if (this.currentFunction) {
      const func = this.functions.get(this.currentFunction);
      if (func) {
        const localVar = func.variableTable.lookupVariable(name);
        if (localVar) {
          return localVar;
        }
      }
    }

    // Si no se encuentra, buscar globalmente
    return this.globalVariableTable.lookupVariable(name);
  }

  /**
   * Asigna una dirección de memoria a una variable
   * @param name Nombre de la variable
   * @param address Dirección de memoria
   * @returns true si se asignó correctamente, false si no se encontró la variable
   */
  public setVariableAddress(name: string, address: number): boolean {
    // Primero buscar en el ámbito actual
    if (this.currentFunction) {
      const func = this.functions.get(this.currentFunction);
      if (func) {
        if (func.variableTable.variableExists(name)) {
          return func.variableTable.setVariableAddress(name, address);
        }
      }
    }

    // Si no se encuentra, buscar globalmente
    if (this.globalVariableTable.variableExists(name)) {
      return this.globalVariableTable.setVariableAddress(name, address);
    }

    return false;
  }

  /**
   * Busca una funcion
   * @param name Nombre
   * @returns La funcion o undefined
   */
  public lookupFunction(name: string) {
    return this.functions.get(name);
  }

  /**
   * Checa si existe una funcion
   * @param name Nombre
   * @returns true si existe, false si no
   */
  public functionExists(name: string) {
    return this.functions.has(name);
  }

  /**
   * Cambia la funcion actual
   * @param name Nombre
   * @returns true si se cambio bien, false si no existe
   */
  public setCurrentFunction(name: string) {
    if (!this.functions.has(name)) {
      return false;
    }

    this.currentFunction = name;
    return true;
  }

  /**
   * Dame la funcion actual
   * @returns Nombre de la funcion o null
   */
  public getCurrentFunction() {
    return this.currentFunction;
  }

  /**
   * Dame la tabla de variables actual
   * @returns Tabla de variables o undefined
   */
  public getCurrentVariableTable() {
    if (!this.currentFunction) {
      return undefined;
    }

    const func = this.functions.get(this.currentFunction);
    return func ? func.variableTable : undefined;
  }

  /**
   * Dame la tabla global
   * @returns Tabla global
   */
  public getGlobalVariableTable() {
    return this.globalVariableTable;
  }

  /**
   * Dame todas las funciones
   * @returns Lista de funciones
   */
  public getAllFunctions() {
    return Array.from(this.functions.values());
  }
}

export const functionDirectory = new FunctionDirectory();
