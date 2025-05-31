// Funcion integrada para compilar el codigo y mostrar el resultado en base
// a un archivo de txt

import fs from "fs";
import { parseInput } from "./index";
import { VirtualMachine } from "./virtual-machine";

export function compileAndRun(sourceCode: string): {
    output: string;
    memory: any;
    quadruples: any[];
    errors: any[];
} {
    const result = parseInput(sourceCode);

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
        }

    } else if (result.semanticErrors.length > 0) {
        console.error('Semantic errors:', result.semanticErrors);
        return {
            output: '',
            memory: {},
            quadruples: [],
            errors: result.semanticErrors
        }
    } else {
        console.log('¡Compilación exitosa!');

        console.log('=== Quadruples ===');
        result.quadruples.forEach((quad, index) => {
            console.log(`${index}: ${JSON.stringify(quad)}`);
        });

        // Ejecutar el código usando la máquina virtual
        const vm = new VirtualMachine();
        vm.loadQuadruples(result.quadruples);
        const output = vm.execute();
        return {
            output: output.join('\n'),
            memory: vm.getMemoryDebugInfo(),
            quadruples: result.quadruples,
            errors: []

        }
    }

}

// Leemos el archivo input.txt y corremos el programa con node
if (require.main === module) {
    const sourceCode = fs.readFileSync('./input.txt', 'utf8');
    const output = compileAndRun(sourceCode);
    console.log('=== Memory ===');
    console.log(output.memory)

    console.log('=== OUTPUT ===');
    console.log(output.output);
}



