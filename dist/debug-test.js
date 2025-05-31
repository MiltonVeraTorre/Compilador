"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Archivo de prueba para verificar que el debug funciona correctamente
const index_1 = require("./index");
function testDebug() {
    console.log("🔍 Iniciando prueba de debug...");
    const simpleProgram = `
    program test;
      var
        x: int;
      main {
        x = 42;
        print(x);
      }
    end
  `;
    console.log("📝 Programa a compilar:");
    console.log(simpleProgram);
    // Pon un breakpoint en la siguiente línea para probar el debug
    const result = (0, index_1.parseInput)(simpleProgram);
    console.log("✅ Resultado de la compilación:");
    console.log({
        lexErrors: result.lexErrors.length,
        parseErrors: result.parseErrors.length,
        semanticErrors: result.semanticErrors.length,
        quadruplesCount: result.quadruples.length
    });
    if (result.lexErrors.length === 0 &&
        result.parseErrors.length === 0 &&
        result.semanticErrors.length === 0) {
        console.log("🎉 ¡Compilación exitosa!");
        // Pon otro breakpoint aquí para inspeccionar los cuádruplos
        console.log("📋 Primeros 5 cuádruplos:");
        result.quadruples.slice(0, 5).forEach((quad, index) => {
            console.log(`${index}: ${quad.toString()}`);
        });
    }
    else {
        console.log("❌ Errores encontrados:");
        if (result.lexErrors.length > 0) {
            console.log("Errores léxicos:", result.lexErrors);
        }
        if (result.parseErrors.length > 0) {
            console.log("Errores de sintaxis:", result.parseErrors);
        }
        if (result.semanticErrors.length > 0) {
            console.log("Errores semánticos:", result.semanticErrors);
        }
    }
    console.log("🏁 Prueba de debug completada");
}
// Ejecutar la prueba
testDebug();
//# sourceMappingURL=debug-test.js.map