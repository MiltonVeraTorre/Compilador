import { parseInput } from './src/index';
import { quadrupleToString } from './src/quadruples';

// Programa recursivo completo
const testProgram = `
program llamada_recursiva;
var
  numero: int;

void contar_regresivo(n: int) [
  {
    print("Contando:");
    print(n);

    if (n > 0) {
      contar_regresivo(n - 1);
    };

    print("Regresando de:");
    print(n);
  }
];

void potencia(base: int, exponente: int) [
  var
    resultado: int;
    contador: int;
  {
    resultado = 1;
    contador = 0;

    while (contador < exponente) do {
      resultado = resultado * base;
      contador = contador + 1;
    };

    print("Resultado de potencia:");
    print(resultado);
  }
];

main {
  numero = 3;
  print("Iniciando cuenta regresiva desde:");
  print(numero);
  contar_regresivo(numero);

  print("Calculando 2^4:");
  potencia(2, 4);

  print("Llamadas recursivas completadas");
}
end
`;

console.log('🔍 Programa de prueba:');
console.log(testProgram);

const result = parseInput(testProgram);

if (result.lexErrors.length > 0 || result.parseErrors.length > 0) {
  console.error('❌ Errores de compilación:', {
    lexErrors: result.lexErrors,
    parseErrors: result.parseErrors
  });
} else if (result.semanticErrors.length > 0) {
  console.error('❌ Errores semánticos:', result.semanticErrors);
} else {
  console.log('✅ Compilación exitosa');

  console.log('\n📝 Cuádruplos generados:');
  result.quadruples.forEach((quad, index) => {
    console.log(`${index}: ${quadrupleToString(quad)}`);
  });

  console.log('\n🚀 Ejecutando programa...');

  // Importar y ejecutar con la máquina virtual
  import('./src/virtual-machine').then(({ VirtualMachine }) => {
    const vm = new VirtualMachine();
    vm.loadQuadruples(result.quadruples);

    // Agregar un timeout para evitar bucles infinitos
    const timeout = setTimeout(() => {
      console.log('⚠️ TIMEOUT: El programa parece estar en un bucle infinito');
      process.exit(1);
    }, 5000); // 5 segundos

    try {
      const output = vm.execute();
      clearTimeout(timeout);

      console.log('\n📤 Salida del programa:');
      output.forEach(line => console.log(line));

      console.log('\n🔍 Estado final de la memoria:');
      console.log(vm.getMemoryDebugInfo());
    } catch (error) {
      clearTimeout(timeout);
      console.error('❌ Error durante la ejecución:', error);
    }
  });
}
