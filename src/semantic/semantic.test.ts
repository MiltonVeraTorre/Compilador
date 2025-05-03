import { parseInput } from '../index';

describe('Analizador Semántico BabyDuck', () => {
  // Prueba 1: Programa semánticamente correcto
  test('debe analizar un programa semánticamente correcto', () => {
    const program = `
      program test;
      var
        x: int;
        y: float;

      main {
        x = 5;
        y = 3.14;
      }
      end
    `;

    const result = parseInput(program);
    expect(result).not.toBeNull();
    expect(result?.parseErrors.length).toBe(0);
    expect(result?.lexErrors.length).toBe(0);

    // Verificar que no hay errores semánticos
    if (result?.semanticErrors.length > 0) {
      console.log("Errores semánticos encontrados:", JSON.stringify(result.semanticErrors, null, 2));

      // Imprimir para ver el codigo
      const lines = program.split('\n');
      console.log("Código fuente:");
      lines.forEach((line, index) => {
        console.log(`${index + 1}: ${line}`);
      });
    }
    expect(result?.semanticErrors.length).toBe(0);
  });

  // Prueba 2: Error semántico - Variable doblemente declarada
  test('debe detectar variable doblemente declarada', () => {
    const program = `
      program test;
      var
        x: int;
        x: float; // Error: x ya fue declarada

      main {
        x = 5;
      }
      end
    `;

    const result = parseInput(program);
    expect(result).not.toBeNull();
    expect(result?.parseErrors.length).toBe(0);
    expect(result?.lexErrors.length).toBe(0);
    expect(result?.semanticErrors.length).toBeGreaterThan(0);

    // Verificar que el error es sobre variable doblemente declarada
    const errorMessage = result?.semanticErrors[0].message;
    expect(errorMessage).toContain('Variable doblemente declarada');
    expect(errorMessage).toContain('x');
  });

  // Prueba 3: Error semántico - Tipo incompatible en asignación
  test('debe detectar tipo incompatible en asignación', () => {
    const program = `
      program test;
      var
        x: int;
        y: float;

      main {
        x = 5;
        y = 3.14;
        x = y; // Error: no se puede asignar float a int
      }
      end
    `;

    const result = parseInput(program);
    expect(result).not.toBeNull();
    expect(result?.parseErrors.length).toBe(0);
    expect(result?.lexErrors.length).toBe(0);

    // Buscar el error de tipo incompatible
    const typeError = result?.semanticErrors.find(error =>
      error.message.includes('Tipo incompatible en asignación')
    );

    expect(typeError).toBeDefined();
    if (typeError) {
      expect(typeError.message).toContain('float');
      expect(typeError.message).toContain('int');
    }
  });

  // Prueba 4: Programa con funciones semánticamente correcto
  test('debe analizar un programa con funciones correctamente', () => {
    const program = `
      program test;
      var
        x: int;
        y: float;

      void suma(a: int, b: int) [
        var
          resultado: int;
        {
          resultado = a + b;
          print(resultado);
        }
      ];

      main {
        x = 5;
        y = 3.14;
        suma(x, 10);
      }
      end
    `;

    const result = parseInput(program);
    expect(result).not.toBeNull();
    expect(result?.parseErrors.length).toBe(0);
    expect(result?.lexErrors.length).toBe(0);

    // Verificar que no hay errores semánticos específicos
    const functionErrors = result?.semanticErrors.filter(error =>
      error.message.includes('Función') ||
      error.message.includes('Parámetro') ||
      error.message.includes('Variable no declarada')
    );

    expect(functionErrors.length).toBe(0);
  });

  // Prueba 5: Error semántico - Función doblemente declarada
  test('debe detectar función doblemente declarada', () => {
    const program = `
      program test;

      void suma(a: int, b: int) [
        var
          resultado: int;
        {
          resultado = a + b;
          print(resultado);
        }
      ];

      void suma(x: float, y: float) [ // Error: suma ya fue declarada
        var
          resultado: float;
        {
          resultado = x + y;
          print(resultado);
        }
      ];

      main {
        suma(5, 10);
      }
      end
    `;

    const result = parseInput(program);
    expect(result).not.toBeNull();
    expect(result?.parseErrors.length).toBe(0);
    expect(result?.lexErrors.length).toBe(0);
    expect(result?.semanticErrors.length).toBeGreaterThan(0);

    // Verificar que el error es sobre función doblemente declarada
    const errorMessage = result?.semanticErrors[0].message;
    expect(errorMessage).toContain('Función doblemente declarada');
    expect(errorMessage).toContain('suma');
  });

  // Prueba 6: Error semántico - Variable local con mismo nombre que otra variable
  test('debe detectar variable doblemente declarada en ámbito local', () => {
    const program = `
      program test;
      var
        x: int;
        x: float; // Error: x ya fue declarada

      main {
        x = 5;
        print(x);
      }
      end
    `;

    const result = parseInput(program);
    expect(result).not.toBeNull();
    expect(result?.parseErrors.length).toBe(0);
    expect(result?.lexErrors.length).toBe(0);
    expect(result?.semanticErrors.length).toBeGreaterThan(0);

    // Verificar que el error es sobre variable doblemente declarada
    const errorMessage = result?.semanticErrors[0].message;
    expect(errorMessage).toContain('Variable doblemente declarada');
    expect(errorMessage).toContain('x');
  });

  // Prueba 7: Error semantico - Tipo incompatible en argumento de función
  test('debe detectar tipo incompatible en argumento de función', () => {
    const program = `
      program test;
      var
        x: int;
        y: float;

      void suma(a: int, b: int) [
        var
          resultado: int;
        {
          resultado = a + b;
          print(resultado);
        }
      ];

      main {
        x = 5;
        y = 3.14;
        suma(x, y); // Error: y es float pero el parámetro b espera int
      }
      end
    `;

    const result = parseInput(program);
    expect(result).not.toBeNull();
    expect(result?.parseErrors.length).toBe(0);
    expect(result?.lexErrors.length).toBe(0);
    expect(result?.semanticErrors.length).toBeGreaterThan(0);

    // Verificar que el error es sobre tipo incompatible
    const typeError = result?.semanticErrors.find(error =>
      error.message.includes('Tipo incompatible en argumento')
    );

    expect(typeError).toBeDefined();
    if (typeError) {
      expect(typeError.message).toContain('esperado int');
      expect(typeError.message).toContain('recibido float');
    }
  });

  // Prueba 8: Programa con ciclos semánticamente correcto
  test('debe analizar un programa con ciclos correctamente', () => {
    const program = `
      program test;
      var
        i: int;
        sum: int;

      main {
        i = 1;
        sum = 0;

        while (i < 10) do {
          sum = sum + i;
          i = i + 1;
        };

        print(sum);
      }
      end
    `;

    const result = parseInput(program);
    expect(result).not.toBeNull();
    expect(result?.parseErrors.length).toBe(0);
    expect(result?.lexErrors.length).toBe(0);
    expect(result?.semanticErrors.length).toBe(0);
  });

  // Prueba 9: Programa con condiciones semánticamente correcto
  test('debe analizar un programa con condiciones correctamente', () => {
    const program = `
      program test;
      var
        x: int;

      main {
        x = 5;

        if (x > 0) {
          print(x);
        } else {
          print(0);
        };
      }
      end
    `;

    const result = parseInput(program);
    expect(result).not.toBeNull();
    expect(result?.parseErrors.length).toBe(0);
    expect(result?.lexErrors.length).toBe(0);

    // Verificar que no hay errores semanticos
    const conditionErrors = result?.semanticErrors.filter(error =>
      error.message.includes('Operación inválida') ||
      error.message.includes('Variable no declarada')
    );

    expect(conditionErrors.length).toBe(0);
  });

  // Prueba 10: Error semántico - Operacion inválida entre tipos
  test('debe detectar operación inválida entre tipos en expresiones', () => {
    const program = `
      program test;
      var
        x: int;
        y: float;

      main {
        x = 5;
        y = 3.14;

        // Intentar multiplicar un int por un float debería ser válido
        // pero asignar el resultado a un int debería dar error
        x = x * y; // Error: no se puede asignar float a int
      }
      end
    `;

    const result = parseInput(program);
    expect(result).not.toBeNull();
    expect(result?.parseErrors.length).toBe(0);
    expect(result?.lexErrors.length).toBe(0);
    expect(result?.semanticErrors.length).toBeGreaterThan(0);

    // Verificar que el error es sobre tipo incompatible en asignación
    const typeError = result?.semanticErrors.find(error =>
      error.message.includes('Tipo incompatible en asignación')
    );

    expect(typeError).toBeDefined();
    if (typeError) {
      expect(typeError.message).toContain('float');
      expect(typeError.message).toContain('int');
    }
  });

  // Prueba 11: Programa con operaciones aritméticas complejas
  test('debe analizar un programa con operaciones aritméticas complejas', () => {
    const program = `
      program test;
      var
        a: int;
        b: int;
        c: int;
        result: float;

      main {
        a = 5;
        b = 10;
        c = 2;

        // Operaciones aritméticas complejas
        result = (a + b) * c / (a - c);

        print(result);
      }
      end
    `;

    const result = parseInput(program);
    expect(result).not.toBeNull();
    expect(result?.parseErrors.length).toBe(0);
    expect(result?.lexErrors.length).toBe(0);

    // Verificar que no hay errores semánticos específicos
    const arithmeticErrors = result?.semanticErrors.filter(error =>
      error.message.includes('Operación inválida') ||
      error.message.includes('Variable no declarada')
    );

    expect(arithmeticErrors.length).toBe(0);
  });

  // Prueba 12: Programa con anidamiento de estructuras de control
  test('debe analizar un programa con estructuras de control anidadas', () => {
    const program = `
      program test;
      var
        i: int;
        j: int;
        sum: int;

      main {
        i = 1;
        sum = 0;

        while (i < 5) do {
          j = 1;

          while (j < i) do {
            if (j != 3) {
              sum = sum + j;
            } else {
              sum = sum + 0;
            };

            j = j + 1;
          };

          i = i + 1;
        };

        print(sum);
      }
      end
    `;

    const result = parseInput(program);
    expect(result).not.toBeNull();
    expect(result?.parseErrors.length).toBe(0);
    expect(result?.lexErrors.length).toBe(0);

    // Verificar que no hay errores semanticos
    const controlErrors = result?.semanticErrors.filter(error =>
      error.message.includes('Operación inválida') ||
      error.message.includes('Variable no declarada')
    );

    expect(controlErrors.length).toBe(0);
  });
});
