#!/usr/bin/env ts-node

import { readFileSync } from 'fs';
import { parseInput } from './src/index';
import { VirtualMachine } from './src/virtual-machine';

const filename = 'test-simple-function.txt';

try {
  console.log('🔍 Debug específico de GOSUB/ENDPROC');

  const sourceCode = readFileSync(filename, 'utf-8');
  const result = parseInput(sourceCode);

  if (result.lexErrors.length > 0 || result.parseErrors.length > 0 || result.semanticErrors.length > 0) {
    console.error('❌ Errores de compilación');
    process.exit(1);
  }

  console.log('✅ Compilación exitosa\n');

  // Mostrar cuádruplos
  console.log('📝 Cuádruplos:');
  result.quadruples.forEach((quad, index) => {
    console.log(`${index}: (${quad.operator}, ${quad.leftOperand ?? '_'}, ${quad.rightOperand ?? '_'}, ${quad.result ?? '_'})`);
  });

  console.log('\n🚀 Ejecutando con debug detallado...');

  const vm = new VirtualMachine();
  vm.loadQuadruples(result.quadruples);

  // Interceptar la ejecución
  const memory = (vm as any).memory;
  const quadruples = (vm as any).quadruples;
  let instructionPointer = 0;
  let running = true;
  const output: string[] = [];

  // Inicializar constantes
  (vm as any).initializeConstants();

  let stepCount = 0;
  const maxSteps = 20;

  while (running && instructionPointer < quadruples.length && stepCount < maxSteps) {
    const quad = quadruples[instructionPointer];

    console.log(`\n--- Paso ${stepCount + 1} ---`);
    console.log(`IP: ${instructionPointer}, Cuádruple: (${quad.operator}, ${quad.leftOperand ?? '_'}, ${quad.rightOperand ?? '_'}, ${quad.result ?? '_'})`);

    // Mostrar contexto antes
    const contextBefore = memory.getCurrentActivationContext();
    if (contextBefore) {
      console.log(`  Contexto antes: ${contextBefore.functionName}, returnAddress: ${contextBefore.returnAddress}`);
    } else {
      console.log(`  Sin contexto antes`);
    }

    // Guardar IP antes de ejecutar
    const ipBefore = instructionPointer;

    // Ejecutar el cuádruple
    try {
      (vm as any).executeQuadruple(quad);

      // Obtener IP después de ejecutar
      const ipAfter = (vm as any).instructionPointer;
      console.log(`  IP antes: ${ipBefore}, después: ${ipAfter}`);

      // Si el IP cambió, usar el nuevo valor, sino incrementar
      if (ipAfter !== ipBefore) {
        instructionPointer = ipAfter;
      } else {
        instructionPointer = ipBefore + 1;
      }

      // Actualizar el IP en la VM
      (vm as any).instructionPointer = instructionPointer;

      console.log(`  IP final: ${instructionPointer}`);

    } catch (error) {
      console.error('❌ Error ejecutando cuádruple:', error);
      break;
    }

    // Mostrar contexto después
    const contextAfter = memory.getCurrentActivationContext();
    if (contextAfter) {
      console.log(`  Contexto después: ${contextAfter.functionName}, returnAddress: ${contextAfter.returnAddress}`);
    } else {
      console.log(`  Sin contexto después`);
    }

    stepCount++;

    // Verificar si la ejecución debe continuar
    running = (vm as any).running;
  }

  console.log('\n📤 Salida generada:');
  const finalOutput = (vm as any).getOutput();
  finalOutput.forEach((line: string) => console.log(line));

} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}
