import { parseInput } from './index';

describe('Analizador BabyDuck', () => {
  test('debe analizar un programa simple', () => {
    const program = `
      program test;
      main {
      }
      end
    `;
    const result = parseInput(program);
    expect(result).not.toBeNull();
    expect(result?.parseErrors.length).toBe(0);
    expect(result?.lexErrors.length).toBe(0);
  });

  test('debe analizar un programa con variables', () => {
    const program = `
      program test;
      var
        x: int;
        y: float;
      main {
      }
      end
    `;
    const result = parseInput(program);
    expect(result).not.toBeNull();
    expect(result?.parseErrors.length).toBe(0);
    expect(result?.lexErrors.length).toBe(0);
  });

  test('debe analizar un programa con sentencias', () => {
    const program = `
      program test;
      var
        x: int;
      main {
        x = 5;
        print(x);
        if (x > 0) {
          print("positivo");
        } else {
          print("no positivo");
        };
      }
      end
    `;
    const result = parseInput(program);
    expect(result).not.toBeNull();
    expect(result?.parseErrors.length).toBe(0);
    expect(result?.lexErrors.length).toBe(0);
  });

  test('debe analizar un programa con funciones', () => {
    const program = `
      program test;
      var
        x: int;

      void increment(a: int) [
        {
          a = a + 1;
          print(a);
        }
      ];

      main {
        x = 5;
        increment(x);
      }
      end
    `;
    const result = parseInput(program);
    expect(result).not.toBeNull();
    expect(result?.parseErrors.length).toBe(0);
    expect(result?.lexErrors.length).toBe(0);
  });

  test('debe analizar un programa completo', () => {
    const program = `
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
    `;
    const result = parseInput(program);
    expect(result).not.toBeNull();
    expect(result?.parseErrors.length).toBe(0);
    expect(result?.lexErrors.length).toBe(0);
  });

  // Prueba para detectar errores léxicos
  test('debe detectar errores léxicos correctamente', () => {
    // Programa con un carácter no válido (@) que no está definido en los tokens
    const program = `
      program test;
      var
        x@y: int; // El carácter @ no es válido en BabyDuck
      main {
        x = 5;
      }
      end
    `;
    const result = parseInput(program);
    expect(result).not.toBeNull();
    expect(result?.lexErrors.length).toBeGreaterThan(0);
    // Verificamos que el error léxico contiene información sobre el carácter no reconocido
    expect(result?.lexErrors[0].message).toContain('unexpected character');
  });

  // Prueba para detectar errores sintácticos
  test('debe detectar errores sintácticos correctamente', () => {
    // Programa con una estructura sintáctica incorrecta (falta el punto y coma después de la asignación)
    const program = `
      program test;
      var
        x: int;
      main {
        x = 5  // Falta el punto y coma
        print(x);
      }
      end
    `;
    const result = parseInput(program);
    expect(result).not.toBeNull();
    expect(result?.parseErrors.length).toBeGreaterThan(0);
    // Verificamos que el error de análisis contiene información sobre el token esperado
    expect(result?.parseErrors[0].message).toContain('Expecting');
  });
});
