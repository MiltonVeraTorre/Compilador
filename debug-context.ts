#!/usr/bin/env ts-node

import { readFileSync } from 'fs';
import { parseInput } from './src/index';
import { VirtualMachine } from './src/virtual-machine';

const filename = 'test-simple-function.txt';

try {
  console.log('🔍 Debug específico de contextos de activación');
  
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
  
  console.log('\n🚀 Ejecutando paso a paso...');
  
  const vm = new VirtualMachine();
  vm.loadQuadruples(result.quadruples);
  
  // Interceptar la ejecución
  const memory = (vm as any).memory;
  const quadruples = (vm as any).quadruples;
  let instructionPointer = 0;
  let running = true;
  
  // Inicializar constantes
  (vm as any).initializeConstants();
  
  let stepCount = 0;
  const maxSteps = 15;
  
  while (running && instructionPointer < quadruples.length && stepCount < maxSteps) {
    const quad = quadruples[instructionPointer];
    
    console.log(`\n--- Paso ${stepCount + 1} ---`);
    console.log(`IP: ${instructionPointer}, Cuádruple: (${quad.operator}, ${quad.leftOperand ?? '_'}, ${quad.rightOperand ?? '_'}, ${quad.result ?? '_'})`);
    
    // Mostrar estado de la pila de contextos
    const stackSize = memory.activationStack.size();
    console.log(`  Tamaño de pila de contextos: ${stackSize}`);
    
    if (stackSize > 0) {
      const context = memory.getCurrentActivationContext();
      console.log(`  Contexto actual: ${context?.functionName}, returnAddress: ${context?.returnAddress}`);
      console.log(`  Parámetros:`, Object.fromEntries(context?.parameterMemory || new Map()));
      console.log(`  Locales:`, Object.fromEntries(context?.localMemory || new Map()));
    }
    
    // Ejecutar el cuádruple
    try {
      (vm as any).executeQuadruple(quad);
      
      // Obtener nuevo IP
      const newIP = (vm as any).instructionPointer;
      console.log(`  IP cambió de ${instructionPointer} a ${newIP}`);
      
      // Simular el incremento del bucle principal
      instructionPointer = newIP + 1;
      (vm as any).instructionPointer = instructionPointer;
      
    } catch (error) {
      console.error('❌ Error ejecutando cuádruple:', error);
      break;
    }
    
    // Mostrar estado después
    const stackSizeAfter = memory.activationStack.size();
    console.log(`  Tamaño de pila después: ${stackSizeAfter}`);
    
    if (stackSizeAfter > 0) {
      const contextAfter = memory.getCurrentActivationContext();
      console.log(`  Contexto después: ${contextAfter?.functionName}, returnAddress: ${contextAfter?.returnAddress}`);
    }
    
    stepCount++;
    running = (vm as any).running;
  }
  
  console.log('\n📤 Salida generada:');
  const finalOutput = (vm as any).getOutput();
  finalOutput.forEach((line: string) => console.log(line));
  
} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}
