"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuadrupleOperator = void 0;
exports.createQuadruple = createQuadruple;
exports.quadrupleToString = quadrupleToString;
exports.generateTempVar = generateTempVar;
exports.resetTempCounter = resetTempCounter;
/**
 * Operadores adicionales para cuádruplos
 *
 * Extiende los operadores básicos del cubo semántico
 */
var QuadrupleOperator;
(function (QuadrupleOperator) {
    // Operadores heredados del cubo semántico
    QuadrupleOperator["PLUS"] = "+";
    QuadrupleOperator["MINUS"] = "-";
    QuadrupleOperator["MULTIPLY"] = "*";
    QuadrupleOperator["DIVIDE"] = "/";
    QuadrupleOperator["GREATER_THAN"] = ">";
    QuadrupleOperator["LESS_THAN"] = "<";
    QuadrupleOperator["NOT_EQUALS"] = "!=";
    QuadrupleOperator["ASSIGN"] = "=";
    // Operadores adicionales para cuádruplos
    QuadrupleOperator["PRINT"] = "print";
    QuadrupleOperator["GOTO"] = "goto";
    QuadrupleOperator["GOTOF"] = "gotof";
    QuadrupleOperator["GOTOT"] = "gotot";
    QuadrupleOperator["GOSUB"] = "gosub";
    QuadrupleOperator["RETURN"] = "return";
    QuadrupleOperator["PARAM"] = "param";
    QuadrupleOperator["ERA"] = "era";
    QuadrupleOperator["ENDPROC"] = "endproc";
})(QuadrupleOperator || (exports.QuadrupleOperator = QuadrupleOperator = {}));
/**
 * Crea un nuevo cuádruplo
 * @param operator Operador
 * @param leftOperand Operando izquierdo
 * @param rightOperand Operando derecho
 * @param result Resultado
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
 * Contador para generar temporales únicos
 */
let tempCounter = 0;
/**
 * Genera un nombre de variable temporal único
 * @returns Nombre de variable temporal
 */
function generateTempVar() {
    return `t${tempCounter++}`;
}
/**
 * Reinicia el contador de temporales
 */
function resetTempCounter() {
    tempCounter = 0;
}
