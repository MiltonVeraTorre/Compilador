"use strict";
// Funcion integrada para compilar el codigo y mostrar el resultado en base
// a un archivo de txt
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileAndRun = compileAndRun;
const fs_1 = __importDefault(require("fs"));
const index_1 = require("./index");
const virtual_machine_1 = require("./virtual-machine");
function compileAndRun(sourceCode) {
    const result = (0, index_1.parseInput)(sourceCode);
    if (result.lexErrors.length > 0 || result.parseErrors.length > 0) {
        console.error('Compilation failed:', {
            lexErrors: result.lexErrors,
            parseErrors: result.parseErrors
        });
        return {
            output: '',
            memory: {},
            quadruples: [],
            errors: [...result.lexErrors, ...result.parseErrors]
        };
    }
    else if (result.semanticErrors.length > 0) {
        console.error('Semantic errors:', result.semanticErrors);
        return {
            output: '',
            memory: {},
            quadruples: [],
            errors: result.semanticErrors
        };
    }
    else {
        console.log('¡Compilación exitosa!');
        console.log('=== Quadruples ===');
        result.quadruples.forEach((quad, index) => {
            console.log(`${index}: ${JSON.stringify(quad)}`);
        });
        // Ejecutar el código usando la máquina virtual
        const vm = new virtual_machine_1.VirtualMachine();
        vm.loadQuadruples(result.quadruples);
        const output = vm.execute();
        return {
            output: output.join('\n'),
            memory: vm.getMemoryDebugInfo(),
            quadruples: result.quadruples,
            errors: []
        };
    }
}
// Leemos el archivo input.txt y corremos el programa con node
if (require.main === module) {
    const sourceCode = fs_1.default.readFileSync('./input.txt', 'utf8');
    const output = compileAndRun(sourceCode);
    console.log('=== Memory ===');
    console.log(output.memory);
    console.log('=== OUTPUT ===');
    console.log(output.output);
}
//# sourceMappingURL=compiler.js.map