"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.virtualMemory = exports.VirtualMemory = exports.MEMORY_RANGES = exports.MemorySegment = void 0;
const semantic_cube_1 = require("../semantic/semantic-cube");
/**
 * Segmentos de memoria
 *
 * Cada segmento tiene un rango específico de direcciones
 */
var MemorySegment;
(function (MemorySegment) {
    MemorySegment["GLOBAL"] = "global";
    MemorySegment["LOCAL"] = "local";
    MemorySegment["PARAMETER"] = "parameter";
    MemorySegment["TEMPORAL"] = "temporal";
    MemorySegment["CONSTANT"] = "constant"; // Constantes
})(MemorySegment || (exports.MemorySegment = MemorySegment = {}));
/**
 * Rangos de direcciones para cada segmento y tipo
 *
 * Cada tipo de dato en cada segmento tiene un rango específico
 */
exports.MEMORY_RANGES = {
    // Variables globales: 1000-4999
    [MemorySegment.GLOBAL]: {
        [semantic_cube_1.DataType.INT]: { start: 1000, end: 1999 },
        [semantic_cube_1.DataType.FLOAT]: { start: 2000, end: 2999 },
        [semantic_cube_1.DataType.STRING]: { start: 3000, end: 3999 }
    },
    // Variables locales: 5100-8999
    [MemorySegment.LOCAL]: {
        [semantic_cube_1.DataType.INT]: { start: 5100, end: 5999 },
        [semantic_cube_1.DataType.FLOAT]: { start: 6000, end: 6999 },
        [semantic_cube_1.DataType.STRING]: { start: 7000, end: 7999 }
    },
    // Parámetros de funciones: 5000-5099
    [MemorySegment.PARAMETER]: {
        [semantic_cube_1.DataType.INT]: { start: 5000, end: 5099 },
        [semantic_cube_1.DataType.FLOAT]: { start: 5000, end: 5099 },
        [semantic_cube_1.DataType.STRING]: { start: 5000, end: 5099 }
    },
    // Variables temporales: 9000-12999
    [MemorySegment.TEMPORAL]: {
        [semantic_cube_1.DataType.INT]: { start: 9000, end: 9999 },
        [semantic_cube_1.DataType.FLOAT]: { start: 10000, end: 10999 },
        [semantic_cube_1.DataType.STRING]: { start: 11000, end: 11999 }
    },
    // Constantes: 13000-16999
    [MemorySegment.CONSTANT]: {
        [semantic_cube_1.DataType.INT]: { start: 13000, end: 13999 },
        [semantic_cube_1.DataType.FLOAT]: { start: 14000, end: 14999 },
        [semantic_cube_1.DataType.STRING]: { start: 15000, end: 15999 }
    }
};
/**
 * Administrador de Memoria Virtual
 *
 * Maneja la asignación de direcciones virtuales para variables,
 * constantes y temporales
 */
class VirtualMemory {
    constructor() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        // Inicializar contadores con los valores iniciales
        this.counters = {
            [MemorySegment.GLOBAL]: {
                [semantic_cube_1.DataType.INT]: ((_a = exports.MEMORY_RANGES[MemorySegment.GLOBAL][semantic_cube_1.DataType.INT]) === null || _a === void 0 ? void 0 : _a.start) || 1000,
                [semantic_cube_1.DataType.FLOAT]: ((_b = exports.MEMORY_RANGES[MemorySegment.GLOBAL][semantic_cube_1.DataType.FLOAT]) === null || _b === void 0 ? void 0 : _b.start) || 2000,
                [semantic_cube_1.DataType.STRING]: ((_c = exports.MEMORY_RANGES[MemorySegment.GLOBAL][semantic_cube_1.DataType.STRING]) === null || _c === void 0 ? void 0 : _c.start) || 3000
            },
            [MemorySegment.LOCAL]: {
                [semantic_cube_1.DataType.INT]: ((_d = exports.MEMORY_RANGES[MemorySegment.LOCAL][semantic_cube_1.DataType.INT]) === null || _d === void 0 ? void 0 : _d.start) || 5100,
                [semantic_cube_1.DataType.FLOAT]: ((_e = exports.MEMORY_RANGES[MemorySegment.LOCAL][semantic_cube_1.DataType.FLOAT]) === null || _e === void 0 ? void 0 : _e.start) || 6000,
                [semantic_cube_1.DataType.STRING]: ((_f = exports.MEMORY_RANGES[MemorySegment.LOCAL][semantic_cube_1.DataType.STRING]) === null || _f === void 0 ? void 0 : _f.start) || 7000
            },
            [MemorySegment.PARAMETER]: {
                [semantic_cube_1.DataType.INT]: ((_g = exports.MEMORY_RANGES[MemorySegment.PARAMETER][semantic_cube_1.DataType.INT]) === null || _g === void 0 ? void 0 : _g.start) || 5000,
                [semantic_cube_1.DataType.FLOAT]: ((_h = exports.MEMORY_RANGES[MemorySegment.PARAMETER][semantic_cube_1.DataType.FLOAT]) === null || _h === void 0 ? void 0 : _h.start) || 5000,
                [semantic_cube_1.DataType.STRING]: ((_j = exports.MEMORY_RANGES[MemorySegment.PARAMETER][semantic_cube_1.DataType.STRING]) === null || _j === void 0 ? void 0 : _j.start) || 5000
            },
            [MemorySegment.TEMPORAL]: {
                [semantic_cube_1.DataType.INT]: ((_k = exports.MEMORY_RANGES[MemorySegment.TEMPORAL][semantic_cube_1.DataType.INT]) === null || _k === void 0 ? void 0 : _k.start) || 9000,
                [semantic_cube_1.DataType.FLOAT]: ((_l = exports.MEMORY_RANGES[MemorySegment.TEMPORAL][semantic_cube_1.DataType.FLOAT]) === null || _l === void 0 ? void 0 : _l.start) || 10000,
                [semantic_cube_1.DataType.STRING]: ((_m = exports.MEMORY_RANGES[MemorySegment.TEMPORAL][semantic_cube_1.DataType.STRING]) === null || _m === void 0 ? void 0 : _m.start) || 11000
            },
            [MemorySegment.CONSTANT]: {
                [semantic_cube_1.DataType.INT]: ((_o = exports.MEMORY_RANGES[MemorySegment.CONSTANT][semantic_cube_1.DataType.INT]) === null || _o === void 0 ? void 0 : _o.start) || 13000,
                [semantic_cube_1.DataType.FLOAT]: ((_p = exports.MEMORY_RANGES[MemorySegment.CONSTANT][semantic_cube_1.DataType.FLOAT]) === null || _p === void 0 ? void 0 : _p.start) || 14000,
                [semantic_cube_1.DataType.STRING]: ((_q = exports.MEMORY_RANGES[MemorySegment.CONSTANT][semantic_cube_1.DataType.STRING]) === null || _q === void 0 ? void 0 : _q.start) || 15000
            }
        };
        this.constantMap = new Map();
    }
    /**
     * Asigna una dirección virtual para una variable
     * @param type Tipo de dato
     * @param segment Segmento de memoria
     * @returns Dirección virtual asignada
     */
    assignAddress(type, segment) {
        var _a;
        // Verificar que el tipo sea válido
        if (type === semantic_cube_1.DataType.VOID || type === semantic_cube_1.DataType.ERROR) {
            throw new Error(`No se puede asignar memoria para el tipo ${type}`);
        }
        // Obtener el contador actual
        const counter = this.counters[segment][type];
        // Verificar que no se haya excedido el límite
        const end = ((_a = exports.MEMORY_RANGES[segment][type]) === null || _a === void 0 ? void 0 : _a.end) || 0;
        if (counter > end) {
            throw new Error(`Memoria agotada para el segmento ${segment} y tipo ${type}`);
        }
        // Incrementar el contador y devolver la dirección
        this.counters[segment][type]++;
        return counter;
    }
    /**
     * Asigna una dirección virtual para una constante
     * @param value Valor de la constante
     * @param type Tipo de dato
     * @returns Dirección virtual asignada
     */
    assignConstantAddress(value, type) {
        // Crear una clave única para la constante
        const key = `${type}:${value}`;
        // Verificar si la constante ya existe
        if (this.constantMap.has(key)) {
            return this.constantMap.get(key);
        }
        // Asignar una nueva dirección
        const address = this.assignAddress(type, MemorySegment.CONSTANT);
        // Guardar la constante en el mapa
        this.constantMap.set(key, address);
        return address;
    }
    /**
     * Asigna una dirección virtual para una variable temporal
     * @param type Tipo de dato
     * @returns Dirección virtual asignada
     */
    assignTempAddress(type) {
        return this.assignAddress(type, MemorySegment.TEMPORAL);
    }
    /**
     * Determina el tipo de dato basado en una dirección virtual
     * @param address Dirección virtual
     * @returns Tipo de dato
     */
    getTypeFromAddress(address) {
        // Recorrer todos los segmentos y tipos
        const segments = Object.keys(exports.MEMORY_RANGES);
        for (const segment of segments) {
            const types = Object.keys(exports.MEMORY_RANGES[segment]);
            for (const type of types) {
                const range = exports.MEMORY_RANGES[segment][type];
                if (range && address >= range.start && address <= range.end) {
                    return type;
                }
            }
        }
        throw new Error(`Dirección inválida: ${address}`);
    }
    /**
     * Determina el segmento basado en una dirección virtual
     * @param address Dirección virtual
     * @returns Segmento de memoria
     */
    getSegmentFromAddress(address) {
        // Recorrer todos los segmentos
        const segments = Object.keys(exports.MEMORY_RANGES);
        for (const segment of segments) {
            const types = Object.keys(exports.MEMORY_RANGES[segment]);
            for (const type of types) {
                const range = exports.MEMORY_RANGES[segment][type];
                if (range && address >= range.start && address <= range.end) {
                    return segment;
                }
            }
        }
        throw new Error(`Dirección inválida: ${address}`);
    }
    /**
     * Obtiene todas las constantes registradas
     * @returns Mapa de constantes con sus direcciones
     */
    getConstants() {
        return new Map(this.constantMap);
    }
    /**
     * Obtiene las constantes como un array de objetos con valor, tipo y dirección
     * @returns Array de constantes
     */
    getConstantsArray() {
        const constants = [];
        for (const [key, address] of this.constantMap) {
            const [typeStr, value] = key.split(':');
            const type = typeStr;
            // Convertir el valor al tipo apropiado
            let convertedValue = value;
            if (type === semantic_cube_1.DataType.INT) {
                convertedValue = parseInt(value, 10);
            }
            else if (type === semantic_cube_1.DataType.FLOAT) {
                convertedValue = parseFloat(value);
            }
            constants.push({
                value: convertedValue,
                type,
                address
            });
        }
        return constants;
    }
    /**
     * Reinicia los contadores de memoria
     */
    reset() {
        // Reiniciar todos los contadores a sus valores iniciales
        const segments = Object.keys(exports.MEMORY_RANGES);
        for (const segment of segments) {
            const types = Object.keys(exports.MEMORY_RANGES[segment]);
            for (const type of types) {
                const range = exports.MEMORY_RANGES[segment][type];
                if (range) {
                    this.counters[segment][type] = range.start;
                }
            }
        }
        // Limpiar el mapa de constantes
        this.constantMap.clear();
    }
}
exports.VirtualMemory = VirtualMemory;
// Exportar un singleton
exports.virtualMemory = new VirtualMemory();
//# sourceMappingURL=virtual-memory.js.map