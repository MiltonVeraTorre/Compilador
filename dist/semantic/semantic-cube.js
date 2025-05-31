"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.semanticCube = exports.SemanticCube = exports.Operator = exports.DataType = void 0;
/**
 * Tipos de datos que soporta BabyDuck
 */
var DataType;
(function (DataType) {
    DataType["INT"] = "int";
    DataType["FLOAT"] = "float";
    DataType["VOID"] = "void";
    DataType["STRING"] = "string";
    DataType["ERROR"] = "error";
})(DataType || (exports.DataType = DataType = {}));
/**
 * Operadores que soporta BabyDuck
 */
var Operator;
(function (Operator) {
    // Aritmeticos
    Operator["PLUS"] = "+";
    Operator["MINUS"] = "-";
    Operator["MULTIPLY"] = "*";
    Operator["DIVIDE"] = "/";
    // Relacionales
    Operator["GREATER_THAN"] = ">";
    Operator["LESS_THAN"] = "<";
    Operator["GREATER_EQUALS"] = ">=";
    Operator["LESS_EQUALS"] = "<=";
    Operator["EQUALS"] = "==";
    Operator["NOT_EQUALS"] = "!=";
    // Asignacion
    Operator["ASSIGN"] = "=";
})(Operator || (exports.Operator = Operator = {}));
/**
 * Cubo Semantico - Define reglas de compatibilidad de tipos
 *
 * Dice que tipo resulta cuando haces operaciones entre diferentes tipos
 */
class SemanticCube {
    constructor() {
        this.cube = new Map();
        this.initCube();
    }
    /**
     * Inicializa el cubo con todas las operaciones validas
     */
    initCube() {
        // Operaciones aritméticas: +, -, *, /
        // int + int = int
        this.setCubeValue(DataType.INT, Operator.PLUS, DataType.INT, DataType.INT);
        // int - int = int
        this.setCubeValue(DataType.INT, Operator.MINUS, DataType.INT, DataType.INT);
        // int * int = int
        this.setCubeValue(DataType.INT, Operator.MULTIPLY, DataType.INT, DataType.INT);
        // int / int = float
        this.setCubeValue(DataType.INT, Operator.DIVIDE, DataType.INT, DataType.FLOAT);
        // int + float = float
        this.setCubeValue(DataType.INT, Operator.PLUS, DataType.FLOAT, DataType.FLOAT);
        // int - float = float
        this.setCubeValue(DataType.INT, Operator.MINUS, DataType.FLOAT, DataType.FLOAT);
        // int * float = float
        this.setCubeValue(DataType.INT, Operator.MULTIPLY, DataType.FLOAT, DataType.FLOAT);
        // int / float = float
        this.setCubeValue(DataType.INT, Operator.DIVIDE, DataType.FLOAT, DataType.FLOAT);
        // float + int = float
        this.setCubeValue(DataType.FLOAT, Operator.PLUS, DataType.INT, DataType.FLOAT);
        // float - int = float
        this.setCubeValue(DataType.FLOAT, Operator.MINUS, DataType.INT, DataType.FLOAT);
        // float * int = float
        this.setCubeValue(DataType.FLOAT, Operator.MULTIPLY, DataType.INT, DataType.FLOAT);
        // float / int = float
        this.setCubeValue(DataType.FLOAT, Operator.DIVIDE, DataType.INT, DataType.FLOAT);
        // float + float = float
        this.setCubeValue(DataType.FLOAT, Operator.PLUS, DataType.FLOAT, DataType.FLOAT);
        // float - float = float
        this.setCubeValue(DataType.FLOAT, Operator.MINUS, DataType.FLOAT, DataType.FLOAT);
        // float * float = float
        this.setCubeValue(DataType.FLOAT, Operator.MULTIPLY, DataType.FLOAT, DataType.FLOAT);
        // float / float = float
        this.setCubeValue(DataType.FLOAT, Operator.DIVIDE, DataType.FLOAT, DataType.FLOAT);
        // Operaciones relacionales: >, <, >=, <=, ==, !=
        // int > int = int (representando booleano)
        this.setCubeValue(DataType.INT, Operator.GREATER_THAN, DataType.INT, DataType.INT);
        // int < int = int (representando booleano)
        this.setCubeValue(DataType.INT, Operator.LESS_THAN, DataType.INT, DataType.INT);
        // int >= int = int (representando booleano)
        this.setCubeValue(DataType.INT, Operator.GREATER_EQUALS, DataType.INT, DataType.INT);
        // int <= int = int (representando booleano)
        this.setCubeValue(DataType.INT, Operator.LESS_EQUALS, DataType.INT, DataType.INT);
        // int == int = int (representando booleano)
        this.setCubeValue(DataType.INT, Operator.EQUALS, DataType.INT, DataType.INT);
        // int != int = int (representando booleano)
        this.setCubeValue(DataType.INT, Operator.NOT_EQUALS, DataType.INT, DataType.INT);
        // int > float = int (representando booleano)
        this.setCubeValue(DataType.INT, Operator.GREATER_THAN, DataType.FLOAT, DataType.INT);
        // int < float = int (representando booleano)
        this.setCubeValue(DataType.INT, Operator.LESS_THAN, DataType.FLOAT, DataType.INT);
        // int >= float = int (representando booleano)
        this.setCubeValue(DataType.INT, Operator.GREATER_EQUALS, DataType.FLOAT, DataType.INT);
        // int <= float = int (representando booleano)
        this.setCubeValue(DataType.INT, Operator.LESS_EQUALS, DataType.FLOAT, DataType.INT);
        // int == float = int (representando booleano)
        this.setCubeValue(DataType.INT, Operator.EQUALS, DataType.FLOAT, DataType.INT);
        // int != float = int (representando booleano)
        this.setCubeValue(DataType.INT, Operator.NOT_EQUALS, DataType.FLOAT, DataType.INT);
        // float > int = int (representando booleano)
        this.setCubeValue(DataType.FLOAT, Operator.GREATER_THAN, DataType.INT, DataType.INT);
        // float < int = int (representando booleano)
        this.setCubeValue(DataType.FLOAT, Operator.LESS_THAN, DataType.INT, DataType.INT);
        // float >= int = int (representando booleano)
        this.setCubeValue(DataType.FLOAT, Operator.GREATER_EQUALS, DataType.INT, DataType.INT);
        // float <= int = int (representando booleano)
        this.setCubeValue(DataType.FLOAT, Operator.LESS_EQUALS, DataType.INT, DataType.INT);
        // float == int = int (representando booleano)
        this.setCubeValue(DataType.FLOAT, Operator.EQUALS, DataType.INT, DataType.INT);
        // float != int = int (representando booleano)
        this.setCubeValue(DataType.FLOAT, Operator.NOT_EQUALS, DataType.INT, DataType.INT);
        // float > float = int (representando booleano)
        this.setCubeValue(DataType.FLOAT, Operator.GREATER_THAN, DataType.FLOAT, DataType.INT);
        // float < float = int (representando booleano)
        this.setCubeValue(DataType.FLOAT, Operator.LESS_THAN, DataType.FLOAT, DataType.INT);
        // float >= float = int (representando booleano)
        this.setCubeValue(DataType.FLOAT, Operator.GREATER_EQUALS, DataType.FLOAT, DataType.INT);
        // float <= float = int (representando booleano)
        this.setCubeValue(DataType.FLOAT, Operator.LESS_EQUALS, DataType.FLOAT, DataType.INT);
        // float == float = int (representando booleano)
        this.setCubeValue(DataType.FLOAT, Operator.EQUALS, DataType.FLOAT, DataType.INT);
        // float != float = int (representando booleano)
        this.setCubeValue(DataType.FLOAT, Operator.NOT_EQUALS, DataType.FLOAT, DataType.INT);
        // Operaciones de asignación: =
        // int = int
        this.setCubeValue(DataType.INT, Operator.ASSIGN, DataType.INT, DataType.INT);
        // int = float
        this.setCubeValue(DataType.INT, Operator.ASSIGN, DataType.FLOAT, DataType.ERROR);
        // float = int
        this.setCubeValue(DataType.FLOAT, Operator.ASSIGN, DataType.INT, DataType.FLOAT);
        // float = float
        this.setCubeValue(DataType.FLOAT, Operator.ASSIGN, DataType.FLOAT, DataType.FLOAT);
    }
    /**
     * Guarda el tipo que resulta de una operacion
     * @param leftType Tipo izquierdo
     * @param operator Operador
     * @param rightType Tipo derecho
     * @param resultType Tipo resultado
     */
    setCubeValue(leftType, operator, rightType, resultType) {
        const key = `${leftType}${operator}${rightType}`;
        this.cube.set(key, resultType);
    }
    /**
     * Dame el tipo que resulta de una operacion
     * @param leftType Tipo izquierdo
     * @param operator Operador
     * @param rightType Tipo derecho
     * @returns Tipo resultado o ERROR si no es valida
     */
    getResultType(leftType, operator, rightType) {
        const key = `${leftType}${operator}${rightType}`;
        return this.cube.get(key) || DataType.ERROR;
    }
    /**
     * Checa si una operacion es valida
     * @param leftType Tipo izquierdo
     * @param operator Operador
     * @param rightType Tipo derecho
     * @returns true si es valida, false si no
     */
    isValidOperation(leftType, operator, rightType) {
        return this.getResultType(leftType, operator, rightType) !== DataType.ERROR;
    }
}
exports.SemanticCube = SemanticCube;
exports.semanticCube = new SemanticCube();
//# sourceMappingURL=semantic-cube.js.map