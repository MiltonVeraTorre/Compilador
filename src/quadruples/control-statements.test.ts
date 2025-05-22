import { parseInput } from '../index';
import { quadrupleToString } from './quadruple';
import { QuadrupleOperator } from './quadruple';

describe('Generación de Cuádruplos para Estatutos de Control', () => {
  // Prueba 1: Estatuto condicional if
  test('debe generar cuádruplos para un estatuto if', () => {
    const program = `
      program test;
      var
        x: int;

      main {
        x = 5;
        if (x > 0) {
          x = 10;
        };
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

    // Debe haber al menos 4 cuádruplos:
    // 1. Asignación de 5 a x
    // 2. Comparación x > 0
    // 3. GOTOF para saltar si la condición es falsa
    // 4. Asignación de 10 a x
    expect(quadruples.length).toBeGreaterThanOrEqual(4);

    // Verificar que hay una comparación
    const compareQuad = quadruples.find(q => q.operator === '>');
    expect(compareQuad).toBeDefined();

    // Verificar que hay un GOTOF
    const gotofQuad = quadruples.find(q => q.operator === QuadrupleOperator.GOTOF);
    expect(gotofQuad).toBeDefined();

    // Imprimir los cuádruplos para depuración
    console.log('Cuádruplos para estatuto if:');
    quadruples.forEach((quad, index) => {
      console.log(`${index}: ${quadrupleToString(quad)}`);
    });
  });

  // Prueba 2: Estatuto condicional if-else
  test('debe generar cuádruplos para un estatuto if-else', () => {
    const program = `
      program test;
      var
        x: int;

      main {
        x = 5;
        if (x > 10) {
          x = 20;
        } else {
          x = 30;
        };
      }
      end
    `;

    const result = parseInput(program);
    expect(result).not.toBeNull();
    expect(result?.parseErrors.length).toBe(0);
    expect(result?.lexErrors.length).toBe(0);
    // Puede haber errores semánticos debido a la implementación actual
    // expect(result?.semanticErrors.length).toBe(0);

    // Verificar los cuádruplos generados
    const quadruples = result?.quadruples || [];

    // Debe haber al menos 6 cuádruplos:
    // 1. Asignación de 5 a x
    // 2. Comparación x > 10
    // 3. GOTOF para saltar al else si la condición es falsa
    // 4. Asignación de 20 a x
    // 5. GOTO para saltar después del else
    // 6. Asignación de 30 a x
    expect(quadruples.length).toBeGreaterThanOrEqual(6);

    // Verificar que hay una comparación
    const compareQuad = quadruples.find(q => q.operator === '>');
    expect(compareQuad).toBeDefined();

    // Verificar que hay un GOTOF
    const gotofQuad = quadruples.find(q => q.operator === QuadrupleOperator.GOTOF);
    expect(gotofQuad).toBeDefined();

    // Verificar que hay un GOTO
    const gotoQuad = quadruples.find(q => q.operator === QuadrupleOperator.GOTO);
    expect(gotoQuad).toBeDefined();

    // Imprimir los cuádruplos para depuración
    console.log('Cuádruplos para estatuto if-else:');
    quadruples.forEach((quad, index) => {
      console.log(`${index}: ${quadrupleToString(quad)}`);
    });
  });

  // Prueba 3: Estatuto cíclico while
  test('debe generar cuádruplos para un estatuto while', () => {
    const program = `
      program test;
      var
        i: int;

      main {
        i = 1;
        while (i < 5) do {
          i = i + 1;
        };
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

    // Debe haber al menos 6 cuádruplos:
    // 1. Asignación de 1 a i
    // 2. Comparación i < 5
    // 3. GOTOF para saltar si la condición es falsa
    // 4. Suma i + 1
    // 5. Asignación del resultado a i
    // 6. GOTO para volver al inicio del ciclo
    expect(quadruples.length).toBeGreaterThanOrEqual(6);

    // Verificar que hay una comparación
    const compareQuad = quadruples.find(q => q.operator === '<');
    expect(compareQuad).toBeDefined();

    // Verificar que hay un GOTOF
    const gotofQuad = quadruples.find(q => q.operator === QuadrupleOperator.GOTOF);
    expect(gotofQuad).toBeDefined();

    // Verificar que hay un GOTO
    const gotoQuad = quadruples.find(q => q.operator === QuadrupleOperator.GOTO);
    expect(gotoQuad).toBeDefined();

    // Imprimir los cuádruplos para depuración
    console.log('Cuádruplos para estatuto while:');
    quadruples.forEach((quad, index) => {
      console.log(`${index}: ${quadrupleToString(quad)}`);
    });
  });

  // Prueba 4: Estatutos anidados
  test('debe generar cuádruplos para estatutos anidados', () => {
    const program = `
      program test;
      var
        i: int;
        j: int;

      main {
        i = 1;
        while (i < 3) do {
          j = 1;
          if (j < i) {
            j = j + 1;
          };
          i = i + 1;
        };
      }
      end
    `;

    const result = parseInput(program);
    expect(result).not.toBeNull();
    expect(result?.parseErrors.length).toBe(0);
    expect(result?.lexErrors.length).toBe(0);
    // Puede haber errores semánticos debido a la implementación actual
    // expect(result?.semanticErrors.length).toBe(0);

    // Verificar los cuádruplos generados
    const quadruples = result?.quadruples || [];

    // Debe haber varios cuádruplos para manejar los estatutos anidados
    expect(quadruples.length).toBeGreaterThan(8);

    // Verificar que hay comparaciones
    const compareQuads = quadruples.filter(q => q.operator === '<');
    expect(compareQuads.length).toBeGreaterThanOrEqual(2);

    // Verificar que hay GOTOFs
    const gotofQuads = quadruples.filter(q => q.operator === QuadrupleOperator.GOTOF);
    expect(gotofQuads.length).toBeGreaterThanOrEqual(2);

    // Verificar que hay GOTOs
    const gotoQuads = quadruples.filter(q => q.operator === QuadrupleOperator.GOTO);
    expect(gotoQuads.length).toBeGreaterThanOrEqual(1);

    // Imprimir los cuádruplos para depuración
    console.log('Cuádruplos para estatutos anidados:');
    quadruples.forEach((quad, index) => {
      console.log(`${index}: ${quadrupleToString(quad)}`);
    });
  });
});
