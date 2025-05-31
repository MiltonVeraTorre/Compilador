#!/usr/bin/env ts-node

import { readFileSync } from 'fs';
import { compileAndRun } from './src/compiler';

const filename = process.argv[2] || 'input.txt';

try {
  console.log('🔍 Programa de prueba:\n');

  const sourceCode = readFileSync(filename, 'utf-8');
  console.log(sourceCode);

  console.log('\n🚀 Compilando y ejecutando...');

  // Agregar un timeout para evitar bucles infinitos
  const timeout = setTimeout(() => {
    console.log('⚠️ TIMEOUT: El programa parece estar en un bucle infinito');
    process.exit(1);
  }, 10000); // 10 segundos

  try {
    const result = compileAndRun(sourceCode);
    clearTimeout(timeout);

    if (result.errors.length > 0) {
      console.error('❌ Errores de compilación:', result.errors);
      process.exit(1);
    }

    console.log('\n📤 Salida del programa:');
    console.log(result.output);

    console.log('\n🔍 Estado final de la memoria:');
    console.log(result.memory);
  } catch (error) {
    clearTimeout(timeout);
    console.error('❌ Error durante la ejecución:', error);
  }
} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}
