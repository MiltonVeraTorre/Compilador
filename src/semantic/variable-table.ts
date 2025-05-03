import { DataType } from './semantic-cube';

/**
 * Estructura de una variable
 */
export interface Variable {
  name: string;
  type: DataType;
  address?: number; // Direccion de memoria
  isParameter?: boolean; // Si es parametro
}

/**
 * Tabla de Variables - Guarda variables de un ambito
 *
 * Cada funcion tiene su propia tabla.
 */
export class VariableTable {
  private variables: Map<string, Variable>;

  constructor() {
    this.variables = new Map<string, Variable>();
  }

  /**
   * Agrega una variable
   * @param name Nombre
   * @param type Tipo
   * @param isParameter Si es parametro
   * @returns true si se agrego bien, false si ya existe
   */
  public addVariable(name: string, type: DataType, isParameter: boolean = false) {
    // Verificar si la variable ya existe
    if (this.variables.has(name)) {
      return false;
    }

    // Agregar la variable a la tabla
    this.variables.set(name, {
      name,
      type,
      isParameter
    });

    return true;
  }

  /**
   * Busca una variable
   * @param name Nombre
   * @returns La variable o undefined
   */
  public lookupVariable(name: string) {
    return this.variables.get(name);
  }

  /**
   * Checa si existe una variable
   * @param name Nombre
   * @returns true si existe, false si no
   */
  public variableExists(name: string) {
    return this.variables.has(name);
  }

  /**
   * Dame el tipo de una variable
   * @param name Nombre
   * @returns Tipo o ERROR si no existe
   */
  public getVariableType(name: string) {
    const variable = this.variables.get(name);
    return variable ? variable.type : DataType.ERROR;
  }

  /**
   * Asigna direccion de memoria
   * @param name Nombre
   * @param address Direccion
   * @returns true si se asigno bien, false si no existe
   */
  public setVariableAddress(name: string, address: number) {
    const variable = this.variables.get(name);
    if (!variable) {
      return false;
    }

    variable.address = address;
    this.variables.set(name, variable);
    return true;
  }

  /**
   * Dame todas las variables
   * @returns Lista de variables
   */
  public getAllVariables() {
    return Array.from(this.variables.values());
  }

  /**
   * Cuantas variables hay
   * @returns Numero de variables
   */
  public size() {
    return this.variables.size;
  }

  /**
   * Borra todo
   */
  public clear() {
    this.variables.clear();
  }
}
