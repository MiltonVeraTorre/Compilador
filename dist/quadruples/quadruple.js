"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuadrupleOperator = void 0;
exports.createQuadruple = createQuadruple;
exports.quadrupleToString = quadrupleToString;
exports.generateTempVar = generateTempVar;
exports.resetTempCounter = resetTempCounter;
const virtual_memory_1 = require("../memory/virtual-memory");
var QuadrupleOperator;
(function (QuadrupleOperator) {
    // Operadores del cubo semántico
    QuadrupleOperator["PLUS"] = "+";
    QuadrupleOperator["MINUS"] = "-";
    QuadrupleOperator["MULTIPLY"] = "*";
    QuadrupleOperator["DIVIDE"] = "/";
    QuadrupleOperator["GREATER_THAN"] = ">";
    QuadrupleOperator["LESS_THAN"] = "<";
    QuadrupleOperator["GREATER_EQUALS"] = ">=";
    QuadrupleOperator["LESS_EQUALS"] = "<=";
    QuadrupleOperator["EQUALS"] = "==";
    QuadrupleOperator["NOT_EQUALS"] = "!=";
    QuadrupleOperator["ASSIGN"] = "=";
    // Operadores adicionales para cuádruplos
    QuadrupleOperator["PRINT"] = "print";
    QuadrupleOperator["READ"] = "read";
    QuadrupleOperator["GOTO"] = "goto";
    QuadrupleOperator["GOTOF"] = "gotof";
    QuadrupleOperator["GOTOT"] = "gotot";
    QuadrupleOperator["GOSUB"] = "gosub";
    QuadrupleOperator["RETURN"] = "return";
    QuadrupleOperator["PARAM"] = "param";
    QuadrupleOperator["ERA"] = "era";
    QuadrupleOperator["ENDPROC"] = "endproc";
    QuadrupleOperator["HALT"] = "halt";
})(QuadrupleOperator || (exports.QuadrupleOperator = QuadrupleOperator = {}));
/**
 * Crea un nuevo cuádruplo
 * @param operator Operador
 * @param leftOperand Operando izquierdo (dirección virtual)
 * @param rightOperand Operando derecho (dirección virtual)
 * @param result Resultado (dirección virtual)
 * @returns Cuádruplo creado
 */
function createQuadruple(operator, leftOperand = null, rightOperand = null, result = null) {
    return {
        operator,
        leftOperand,
        rightOperand,
        result
    };
}
/**
 * Convierte un cuádruplo a string para mostrar
 * @param quad Cuádruplo
 * @returns Representación en string
 */
function quadrupleToString(quad) {
    var _a, _b, _c;
    return `(${quad.operator}, ${(_a = quad.leftOperand) !== null && _a !== void 0 ? _a : '_'}, ${(_b = quad.rightOperand) !== null && _b !== void 0 ? _b : '_'}, ${(_c = quad.result) !== null && _c !== void 0 ? _c : '_'})`;
}
/**
 * Genera una dirección para una variable temporal
 * @param type Tipo de dato
 * @returns Dirección virtual
 */
function generateTempVar(type) {
    return virtual_memory_1.virtualMemory.assignTempAddress(type);
}
/**
 * Reinicia el contador de temporales
 */
function resetTempCounter() {
    // La memoria virtual se encarga de esto
    virtual_memory_1.virtualMemory.reset();
}
//# sourceMappingURL=quadruple.js.map