"use strict";
// Exporto todo desde aqui
Object.defineProperty(exports, "__esModule", { value: true });
exports.semanticAnalyzer = exports.SemanticAnalyzer = exports.VariableTable = exports.functionDirectory = exports.FunctionDirectory = exports.semanticCube = exports.Operator = exports.DataType = void 0;
// Cubo semantico
var semantic_cube_1 = require("./semantic-cube");
Object.defineProperty(exports, "DataType", { enumerable: true, get: function () { return semantic_cube_1.DataType; } });
Object.defineProperty(exports, "Operator", { enumerable: true, get: function () { return semantic_cube_1.Operator; } });
Object.defineProperty(exports, "semanticCube", { enumerable: true, get: function () { return semantic_cube_1.semanticCube; } });
// Directorio de funciones
var function_directory_1 = require("./function-directory");
Object.defineProperty(exports, "FunctionDirectory", { enumerable: true, get: function () { return function_directory_1.FunctionDirectory; } });
Object.defineProperty(exports, "functionDirectory", { enumerable: true, get: function () { return function_directory_1.functionDirectory; } });
// Tabla de variables
var variable_table_1 = require("./variable-table");
Object.defineProperty(exports, "VariableTable", { enumerable: true, get: function () { return variable_table_1.VariableTable; } });
// Analizador semantico
var semantic_analyzer_1 = require("./semantic-analyzer");
Object.defineProperty(exports, "SemanticAnalyzer", { enumerable: true, get: function () { return semantic_analyzer_1.SemanticAnalyzer; } });
Object.defineProperty(exports, "semanticAnalyzer", { enumerable: true, get: function () { return semantic_analyzer_1.semanticAnalyzer; } });
