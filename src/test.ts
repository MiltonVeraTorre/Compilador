import { parseInput } from "./index";
import { VirtualMachine } from "./virtual-machine";

const input = `
    program example;
      var
        x: int;
        y: int;
        z: float;

      void myFunction(a: int, b: float) [
        var
          temp: int;
        {
          temp = a + 5;
          print(temp, b);
        }
      ];

      main {
        x = 5;
        y = 10;
        z = 3.14;

        if (x < y) {
          print("x es menor que y");
        } else {
          print("x no es menor que y");
        };

        while (x > 0) do {
          print(x);
          x = x - 1;
        };

        myFunction(x, z);
      }
      end

`

const result = parseInput(input);

// Verificar errores
if (result.lexErrors.length > 0 || result.parseErrors.length > 0) {
  console.error('Compilation failed:', {
    lexErrors: result.lexErrors,
    parseErrors: result.parseErrors
  });
} else if (result.semanticErrors.length > 0) {
  console.error('Semantic errors:', result.semanticErrors);
} else {
  console.log('¡Compilación exitosa!');
  
  // Ejecutar el código usando la máquina virtual
  const vm = new VirtualMachine();
  vm.loadQuadruples(result.quadruples);
  const output = vm.execute();

  console.log(vm.getMemoryDebugInfo());

  
  console.log('Resultado de la ejecución:');
  console.log(output);
}
