#!/usr/bin/env ts-node

import { readFileSync } from 'fs';
import { parseInput } from './src/index';
import { VirtualMachine } from './src/virtual-machine';

const filename = process.argv[2] || 'input.txt';

try {
  console.log('🔍 Debug de memoria para:', filename);

  const sourceCode = readFileSync(filename, 'utf-8');
  const result = parseInput(sourceCode);

  if (result.lexErrors.length > 0 || result.parseErrors.length > 0 || result.semanticErrors.length > 0) {
    console.error('❌ Errores de compilación:', {
      lexErrors: result.lexErrors,
      parseErrors: result.parseErrors,
      semanticErrors: result.semanticErrors
    });
    process.exit(1);
  }

  console.log('✅ Compilación exitosa\n');

  // Mostrar cuádruplos relevantes
  console.log('📝 Cuádruplos relevantes:');
  result.quadruples.forEach((quad, index) => {
    if (index >= 10 && index <= 25) { // Función sumar_hasta
      console.log(`${index}: (${quad.operator}, ${quad.leftOperand ?? '_'}, ${quad.rightOperand ?? '_'}, ${quad.result ?? '_'})`);
    }
  });

  console.log('\n🚀 Ejecutando con debug de memoria...');

  const vm = new VirtualMachine();
  vm.loadQuadruples(result.quadruples);

  // Crear una versión modificada de execute que muestre debug
  const originalExecute = vm.execute.bind(vm);
  let stepCount = 0;
  const maxSteps = 50; // Limitar pasos para evitar bucle infinito

  // Interceptar la ejecución para mostrar debug
  const executeWithDebug = function () {
    const memory = (vm as any).memory;
    const quadruples = (vm as any).quadruples;
    let instructionPointer = 0;
    let running = true;
    const output: string[] = [];

    // Inicializar constantes
    (vm as any).initializeConstants();

    console.log('\n🔍 Estado inicial de memoria:');
    console.log('Constantes:', memory.constantMemory);
    console.log('Globales:', memory.globalMemory);

    while (running && instructionPointer < quadruples.length && stepCount < maxSteps) {
      const quad = quadruples[instructionPointer];

      console.log(`\n--- Paso ${stepCount + 1} ---`);
      console.log(`IP: ${instructionPointer}, Cuádruple: (${quad.operator}, ${quad.leftOperand ?? '_'}, ${quad.rightOperand ?? '_'}, ${quad.result ?? '_'})`);

      // Mostrar valores antes de ejecutar (solo para operaciones que usan direcciones)
      if (quad.leftOperand !== null && !['era', 'goto', 'gotof', 'gotot', 'gosub', 'endproc'].includes(quad.operator)) {
        try {
          const leftValue = memory.getValue(quad.leftOperand);
          console.log(`  Operando izq [${quad.leftOperand}] = ${leftValue}`);
        } catch (e) {
          console.log(`  Operando izq [${quad.leftOperand}] = <dirección inválida>`);
        }
      }
      if (quad.rightOperand !== null && !['era', 'goto', 'gotof', 'gotot', 'gosub', 'endproc'].includes(quad.operator)) {
        try {
          const rightValue = memory.getValue(quad.rightOperand);
          console.log(`  Operando der [${quad.rightOperand}] = ${rightValue}`);
        } catch (e) {
          console.log(`  Operando der [${quad.rightOperand}] = <dirección inválida>`);
        }
      }

      // Ejecutar el cuádruple
      try {
        (vm as any).executeQuadruple(quad);
        instructionPointer = (vm as any).instructionPointer + 1;
        (vm as any).instructionPointer = instructionPointer;
      } catch (error) {
        console.error('❌ Error ejecutando cuádruple:', error);
        break;
      }

      // Mostrar resultado después de ejecutar
      if (quad.result !== null) {
        const resultValue = memory.getValue(quad.result);
        console.log(`  Resultado [${quad.result}] = ${resultValue}`);
      }

      // Mostrar contexto de activación si existe
      const context = memory.getCurrentActivationContext();
      if (context) {
        console.log(`  Contexto: ${context.functionName}`);
        console.log(`  Parámetros:`, Object.fromEntries(context.parameterMemory));
        console.log(`  Locales:`, Object.fromEntries(context.localMemory));
      }

      stepCount++;

      // Parar en bucles infinitos
      if (quad.operator === 'goto' && stepCount > 20) {
        console.log('⚠️ Detectado posible bucle infinito, deteniendo...');
        break;
      }
    }

    return output;
  };

  executeWithDebug();

} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}
