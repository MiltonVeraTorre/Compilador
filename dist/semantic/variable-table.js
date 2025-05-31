"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariableTable = void 0;
const semantic_cube_1 = require("./semantic-cube");
/**
 * Tabla de Variables - Guarda variables de un ambito
 *
 * Cada funcion tiene su propia tabla.
 */
class VariableTable {
    constructor() {
        this.variables = new Map();
    }
    /**
     * Agrega una variable
     * @param name Nombre
     * @param type Tipo
     * @param isParameter Si es parametro
     * @returns true si se agrego bien, false si ya existe
     */
    addVariable(name, type, isParameter = false) {
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
    lookupVariable(name) {
        return this.variables.get(name);
    }
    /**
     * Checa si existe una variable
     * @param name Nombre
     * @returns true si existe, false si no
     */
    variableExists(name) {
        return this.variables.has(name);
    }
    /**
     * Dame el tipo de una variable
     * @param name Nombre
     * @returns Tipo o ERROR si no existe
     */
    getVariableType(name) {
        const variable = this.variables.get(name);
        return variable ? variable.type : semantic_cube_1.DataType.ERROR;
    }
    /**
     * Asigna direccion de memoria
     * @param name Nombre
     * @param address Direccion
     * @returns true si se asigno bien, false si no existe
     */
    setVariableAddress(name, address) {
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
    getAllVariables() {
        return Array.from(this.variables.values());
    }
    /**
     * Cuantas variables hay
     * @returns Numero de variables
     */
    size() {
        return this.variables.size;
    }
    /**
     * Borra todo
     */
    clear() {
        this.variables.clear();
    }
}
exports.VariableTable = VariableTable;
//# sourceMappingURL=variable-table.js.map