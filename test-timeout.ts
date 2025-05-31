#!/usr/bin/env ts-node

import { readFileSync } from 'fs';
import { compileAndRun } from './src/compiler';

const filename = 'input.txt';

try {
  console.log('🔍 Test con timeout corto');

  const sourceCode = readFileSync(filename, 'utf-8');

  // Agregar un timeout muy corto
  const timeout = setTimeout(() => {
    console.log('⚠️ TIMEOUT: Programa colgado después de 2 segundos');
    process.exit(1);
  }, 2000); // 2 segundos

  try {
    const result = compileAndRun(sourceCode);
    clearTimeout(timeout);

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
