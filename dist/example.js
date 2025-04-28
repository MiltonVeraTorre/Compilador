"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
// Programa de ejemplo en BabyDuck
const sourceCode = `
program example;
var
  x: int;
  y: int;

main {
  x = 5;
  y = 10;
  print(x + y);
}
end
`;
const result = (0, index_1.parseInput)(sourceCode);
if (result.lexErrors.length > 0 || result.parseErrors.length > 0) {
    console.error('Compilation failed:', {
        lexErrors: result.lexErrors,
        parseErrors: result.parseErrors
    });
}
else {
    console.log('¡Compilación exitosa!');
    console.log('CST:', JSON.stringify(result.cst, null, 2)); // Árbol de Sintaxis Concreto
}
