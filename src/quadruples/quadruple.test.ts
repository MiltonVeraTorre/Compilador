import { parseInput } from '../index';
import { quadrupleToString } from './quadruple';

describe('Generación de Cuádruplos BabyDuck', () => {
  // Prueba 1: Expresiones aritméticas simples
  test('debe generar cuádruplos para expresiones aritméticas simples', () => {
    const program = `
      program test;
      var
        x: int;
        y: int;
        z: int;

      main {
        x = 5;
        y = 10;
        z = x + y;
      }
      end
    `;

    const result = parseInput(program);
    expect(result).not.toBeNull();
    expect(result?.parseErrors.length).toBe(0);
    expect(result?.lexErrors.length).toBe(0);
    expect(result?.semanticErrors.length).toBe(0);

    // Verificar los cuádruplos generados
    const quadruples = result?.quadruples || [];

    // Debe haber al menos 3 cuádruplos: asignación de 5 a x, 10 a y, y x+y a z
    expect(quadruples.length).toBeGreaterThanOrEqual(3);

    // Verificar asignación de constantes
    expect(quadruples[0].operator).toBe('=');
    // Ahora result es una dirección virtual, no un nombre
    expect(typeof quadruples[0].result).toBe('number');

    expect(quadruples[1].operator).toBe('=');
    expect(typeof quadruples[1].result).toBe('number');

    // Verificar suma y asignación
    const sumQuad = quadruples.find(q => q.operator === '+');
    expect(sumQuad).toBeDefined();

    const lastAssign = quadruples[quadruples.length - 1];
    expect(lastAssign.operator).toBe('=');
    // Ahora result es una dirección virtual, no un nombre
    expect(typeof lastAssign.result).toBe('number');
  });

  // Prueba 2: Expresiones aritméticas complejas
  test('debe generar cuádruplos para expresiones aritméticas complejas', () => {
    const program = `
      program test;
      var
        a: int;
        b: int;
        c: int;
        result: int;

      main {
        a = 5;
        b = 10;
        c = 2;
        result = (a + b) * c;
      }
      end
    `;

    const result = parseInput(program);
    expect(result).not.toBeNull();
    expect(result?.parseErrors.length).toBe(0);
    expect(result?.lexErrors.length).toBe(0);
    expect(result?.semanticErrors.length).toBe(0);

    // Verificar los cuádruplos generados
    const quadruples = result?.quadruples || [];

    // Debe haber al menos 5 cuádruplos: 3 asignaciones, 1 suma, 1 multiplicación
    expect(quadruples.length).toBeGreaterThanOrEqual(5);

    // Verificar que hay una suma y una multiplicación
    const sumQuad = quadruples.find(q => q.operator === '+');
    expect(sumQuad).toBeDefined();

    const multQuad = quadruples.find(q => q.operator === '*');
    expect(multQuad).toBeDefined();

    // La última asignación debe ser a result
    const lastAssign = quadruples[quadruples.length - 1];
    expect(lastAssign.operator).toBe('=');
    // Ahora result es una dirección virtual, no un nombre
    expect(typeof lastAssign.result).toBe('number');
  });

  // Prueba 3: Expresiones relacionales
  test('debe generar cuádruplos para expresiones relacionales', () => {
    const program = `
      program test;
      var
        x: int;
        y: int;
        z: int;

      main {
        x = 5;
        y = 10;
        z = x < y;
      }
      end
    `;

    const result = parseInput(program);
    expect(result).not.toBeNull();
    expect(result?.parseErrors.length).toBe(0);
    expect(result?.lexErrors.length).toBe(0);

    // Verificar los cuádruplos generados
    const quadruples = result?.quadruples || [];

    // Verificar que hay una comparación
    const compareQuad = quadruples.find(q => q.operator === '<');
    expect(compareQuad).toBeDefined();
  });

  // Prueba 4: Operaciones mixtas
  test('debe generar cuádruplos para operaciones mixtas', () => {
    const program = `
      program test;
      var
        a: int;
        b: int;
        c: int;

      main {
        a = 5;
        b = 10;
        c = a / b;
      }
      end
    `;

    const result = parseInput(program);
    expect(result).not.toBeNull();
    expect(result?.parseErrors.length).toBe(0);
    expect(result?.lexErrors.length).toBe(0);

    // Verificar los cuádruplos generados
    const quadruples = result?.quadruples || [];

    // Verificar que hay una división
    const divQuad = quadruples.find(q => q.operator === '/');
    expect(divQuad).toBeDefined();

    // Imprimir los cuádruplos para depuración
    console.log('Cuádruplos para operaciones mixtas:');
    quadruples.forEach((quad, index) => {
      console.log(`${index}: ${quadrupleToString(quad)}`);
    });
  });
});
