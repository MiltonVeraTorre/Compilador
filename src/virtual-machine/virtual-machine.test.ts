import { VirtualMachine } from './virtual-machine';
import { createQuadruple, QuadrupleOperator } from '../quadruples/quadruple';
import { Operator } from '../semantic/semantic-cube';
import { executionMemory } from './execution-memory';

describe('VirtualMachine', () => {
  let vm: VirtualMachine;

  beforeEach(() => {
    executionMemory.clear();
    vm = new VirtualMachine(executionMemory);
  });

  describe('Operaciones Aritméticas', () => {
    test('debe ejecutar suma correctamente', () => {
      // Preparar constantes en memoria
      executionMemory.setValue(13000, 5);  // constante 5
      executionMemory.setValue(13001, 3);  // constante 3

      const quadruples = [
        createQuadruple(Operator.PLUS, 13000, 13001, 9000) // 5 + 3 = resultado en temporal 9000
      ];

      vm.loadQuadruples(quadruples);
      vm.execute();

      expect(executionMemory.getValue(9000)).toBe(8);
    });

    test('debe ejecutar resta correctamente', () => {
      executionMemory.setValue(13000, 10);
      executionMemory.setValue(13001, 4);

      const quadruples = [
        createQuadruple(Operator.MINUS, 13000, 13001, 9000)
      ];

      vm.loadQuadruples(quadruples);
      vm.execute();

      expect(executionMemory.getValue(9000)).toBe(6);
    });

    test('debe ejecutar multiplicación correctamente', () => {
      executionMemory.setValue(13000, 6);
      executionMemory.setValue(13001, 7);

      const quadruples = [
        createQuadruple(Operator.MULTIPLY, 13000, 13001, 9000)
      ];

      vm.loadQuadruples(quadruples);
      vm.execute();

      expect(executionMemory.getValue(9000)).toBe(42);
    });

    test('debe ejecutar división correctamente', () => {
      executionMemory.setValue(13000, 15);
      executionMemory.setValue(13001, 3);

      const quadruples = [
        createQuadruple(Operator.DIVIDE, 13000, 13001, 9000)
      ];

      vm.loadQuadruples(quadruples);
      vm.execute();

      expect(executionMemory.getValue(9000)).toBe(5);
    });

    test('debe lanzar error en división por cero', () => {
      executionMemory.setValue(13000, 10);
      executionMemory.setValue(13001, 0);

      const quadruples = [
        createQuadruple(Operator.DIVIDE, 13000, 13001, 9000)
      ];

      vm.loadQuadruples(quadruples);

      expect(() => vm.execute()).toThrow('División por cero');
    });
  });

  describe('Operaciones Relacionales', () => {
    test('debe ejecutar mayor que correctamente', () => {
      executionMemory.setValue(13000, 8);
      executionMemory.setValue(13001, 5);

      const quadruples = [
        createQuadruple(Operator.GREATER_THAN, 13000, 13001, 9000)
      ];

      vm.loadQuadruples(quadruples);
      vm.execute();

      expect(executionMemory.getValue(9000)).toBe(1); // verdadero
    });

    test('debe ejecutar menor que correctamente', () => {
      executionMemory.setValue(13000, 3);
      executionMemory.setValue(13001, 7);

      const quadruples = [
        createQuadruple(Operator.LESS_THAN, 13000, 13001, 9000)
      ];

      vm.loadQuadruples(quadruples);
      vm.execute();

      expect(executionMemory.getValue(9000)).toBe(1); // verdadero
    });

    test('debe ejecutar diferente de correctamente', () => {
      executionMemory.setValue(13000, 5);
      executionMemory.setValue(13001, 8);

      const quadruples = [
        createQuadruple(Operator.NOT_EQUALS, 13000, 13001, 9000)
      ];

      vm.loadQuadruples(quadruples);
      vm.execute();

      expect(executionMemory.getValue(9000)).toBe(1); // verdadero
    });
  });

  describe('Asignación', () => {
    test('debe ejecutar asignación correctamente', () => {
      executionMemory.setValue(13000, 42); // constante

      const quadruples = [
        createQuadruple(Operator.ASSIGN, 13000, null, 1000) // asignar a variable global
      ];

      vm.loadQuadruples(quadruples);
      vm.execute();

      expect(executionMemory.getValue(1000)).toBe(42);
    });
  });

  describe('Operaciones de Control', () => {
    test('debe ejecutar print correctamente', () => {
      executionMemory.setValue(13000, 'Hola mundo');

      const quadruples = [
        createQuadruple(QuadrupleOperator.PRINT, 13000, null, null)
      ];

      vm.loadQuadruples(quadruples);
      const output = vm.execute();

      expect(output).toEqual(['Hola mundo']);
    });

    test('debe ejecutar GOTO correctamente', () => {
      const quadruples = [
        createQuadruple(QuadrupleOperator.GOTO, null, null, 3), // saltar a cuádruplo 3
        createQuadruple(QuadrupleOperator.PRINT, 13000, null, null), // esto no se ejecuta
        createQuadruple(QuadrupleOperator.PRINT, 13001, null, null), // esto tampoco
        createQuadruple(QuadrupleOperator.ENDPROC, null, null, null) // aquí termina
      ];

      executionMemory.setValue(13000, 'No debería aparecer');
      executionMemory.setValue(13001, 'Tampoco esto');

      vm.loadQuadruples(quadruples);
      const output = vm.execute();

      expect(output).toEqual([]);
    });

    test('debe ejecutar GOTOF correctamente', () => {
      executionMemory.setValue(9000, 0); // condición falsa
      executionMemory.setValue(13000, 'Se ejecutó');

      const quadruples = [
        createQuadruple(QuadrupleOperator.GOTOF, 9000, null, 3), // si falso, ir a 3
        createQuadruple(QuadrupleOperator.PRINT, 13000, null, null), // esto no se ejecuta
        createQuadruple(QuadrupleOperator.ENDPROC, null, null, null) // aquí termina
      ];

      vm.loadQuadruples(quadruples);
      const output = vm.execute();

      expect(output).toEqual([]);
    });
  });

  describe('Expresiones Complejas', () => {
    test('debe ejecutar expresión aritmética compleja', () => {
      // Simular: resultado = (5 + 3) * 2
      executionMemory.setValue(13000, 5);  // constante 5
      executionMemory.setValue(13001, 3);  // constante 3
      executionMemory.setValue(13002, 2);  // constante 2

      const quadruples = [
        createQuadruple(Operator.PLUS, 13000, 13001, 9000),      // t1 = 5 + 3
        createQuadruple(Operator.MULTIPLY, 9000, 13002, 9001),   // t2 = t1 * 2
        createQuadruple(Operator.ASSIGN, 9001, null, 1000)       // resultado = t2
      ];

      vm.loadQuadruples(quadruples);
      vm.execute();

      expect(executionMemory.getValue(1000)).toBe(16);
    });

    test('debe ejecutar expresión con comparación', () => {
      // Simular: if (x > 5) print "mayor"
      executionMemory.setValue(1000, 8);   // variable x = 8
      executionMemory.setValue(13000, 5);  // constante 5
      executionMemory.setValue(15000, 'mayor'); // string constante

      const quadruples = [
        createQuadruple(Operator.GREATER_THAN, 1000, 13000, 9000), // t1 = x > 5
        createQuadruple(QuadrupleOperator.GOTOF, 9000, null, 4),    // si falso, saltar
        createQuadruple(QuadrupleOperator.PRINT, 15000, null, null), // print "mayor"
        createQuadruple(QuadrupleOperator.ENDPROC, null, null, null)
      ];

      vm.loadQuadruples(quadruples);
      const output = vm.execute();

      expect(output).toEqual(['mayor']);
    });
  });

  describe('Funciones', () => {
    test('debe ejecutar función simple con parámetros', () => {
      // Simular función: suma(a, b) return a + b
      // Llamada: resultado = suma(5, 3)

      // Preparar constantes
      executionMemory.setValue(13000, 5);  // constante 5
      executionMemory.setValue(13001, 3);  // constante 3

      const quadruples = [
        // Llamada a función
        createQuadruple(QuadrupleOperator.ERA, 2, null, null),        // 0: ERA para suma
        createQuadruple(QuadrupleOperator.PARAM, 13000, 0, null),     // 1: PARAM 5
        createQuadruple(QuadrupleOperator.PARAM, 13001, 1, null),     // 2: PARAM 3
        createQuadruple(QuadrupleOperator.GOSUB, 6, null, 9000),      // 3: GOSUB suma
        createQuadruple(Operator.ASSIGN, 9000, null, 1000),           // 4: resultado = retorno
        createQuadruple(QuadrupleOperator.ENDPROC, null, null, null), // 5: fin programa

        // Función suma (inicia en cuádruplo 6)
        createQuadruple(Operator.PLUS, 5000, 5001, 9001),             // 6: a + b
        createQuadruple(QuadrupleOperator.RETURN, 9001, null, null),  // 7: return resultado
        createQuadruple(QuadrupleOperator.ENDPROC, null, null, null)  // 8: fin función
      ];

      vm.loadQuadruples(quadruples);
      vm.execute();

      expect(executionMemory.getValue(1000)).toBe(8); // 5 + 3 = 8
    });

    test('debe ejecutar función con print', () => {
      // Simular función: saluda() print "Hola"

      executionMemory.setValue(15000, 'Hola'); // string constante

      const quadruples = [
        // Llamada a función
        createQuadruple(QuadrupleOperator.ERA, 0, null, null),        // 0: ERA para saluda
        createQuadruple(QuadrupleOperator.GOSUB, 3, null, null),      // 1: GOSUB saluda
        createQuadruple(QuadrupleOperator.ENDPROC, null, null, null), // 2: fin programa

        // Función saluda (inicia en cuádruplo 3)
        createQuadruple(QuadrupleOperator.PRINT, 15000, null, null),  // 3: print "Hola"
        createQuadruple(QuadrupleOperator.RETURN, null, null, null),  // 4: return
        createQuadruple(QuadrupleOperator.ENDPROC, null, null, null)  // 5: fin función
      ];

      vm.loadQuadruples(quadruples);
      const output = vm.execute();

      expect(output).toEqual(['Hola']);
    });

    test('debe manejar función void correctamente', () => {
      // Simular función void que modifica variable global

      executionMemory.setValue(13000, 42); // constante 42

      const quadruples = [
        // Llamada a función
        createQuadruple(QuadrupleOperator.ERA, 0, null, null),        // 0: ERA
        createQuadruple(QuadrupleOperator.GOSUB, 3, null, null),      // 1: GOSUB
        createQuadruple(QuadrupleOperator.ENDPROC, null, null, null), // 2: fin programa

        // Función void (inicia en cuádruplo 3)
        createQuadruple(Operator.ASSIGN, 13000, null, 1000),          // 3: global = 42
        createQuadruple(QuadrupleOperator.RETURN, null, null, null),  // 4: return
        createQuadruple(QuadrupleOperator.ENDPROC, null, null, null)  // 5: fin función
      ];

      vm.loadQuadruples(quadruples);
      vm.execute();

      expect(executionMemory.getValue(1000)).toBe(42);
    });

    test('debe manejar múltiples funciones con retorno correctamente', () => {
      // Simular dos funciones: suma(a, b) y doble(x)
      // Llamada: resultado = doble(suma(2, 3))

      executionMemory.setValue(13000, 2);  // constante 2
      executionMemory.setValue(13001, 3);  // constante 3
      executionMemory.setValue(13002, 2);  // constante 2 para doble

      const quadruples = [
        // Llamada a suma(2, 3)
        createQuadruple(QuadrupleOperator.ERA, 2, null, null),        // 0: ERA para suma
        createQuadruple(QuadrupleOperator.PARAM, 13000, 0, null),     // 1: PARAM 2
        createQuadruple(QuadrupleOperator.PARAM, 13001, 1, null),     // 2: PARAM 3
        createQuadruple(QuadrupleOperator.GOSUB, 12, null, 9000),     // 3: GOSUB suma, resultado en 9000

        // Llamada a doble(resultado_suma)
        createQuadruple(QuadrupleOperator.ERA, 1, null, null),        // 4: ERA para doble
        createQuadruple(QuadrupleOperator.PARAM, 9000, 0, null),      // 5: PARAM resultado_suma
        createQuadruple(QuadrupleOperator.GOSUB, 16, null, 9001),     // 6: GOSUB doble, resultado en 9001

        // Asignar resultado final
        createQuadruple(Operator.ASSIGN, 9001, null, 1000),           // 7: resultado = doble_resultado
        createQuadruple(QuadrupleOperator.PRINT, 1000, null, null),   // 8: print resultado
        createQuadruple(QuadrupleOperator.ENDPROC, null, null, null), // 9: fin programa

        // Espacios vacíos para alineación
        createQuadruple(QuadrupleOperator.ENDPROC, null, null, null), // 10: padding
        createQuadruple(QuadrupleOperator.ENDPROC, null, null, null), // 11: padding

        // Función suma (inicia en cuádruplo 12)
        createQuadruple(Operator.PLUS, 5000, 5001, 9002),             // 12: a + b
        createQuadruple(QuadrupleOperator.RETURN, 9002, null, null),  // 13: return resultado
        createQuadruple(QuadrupleOperator.ENDPROC, null, null, null), // 14: fin función suma
        createQuadruple(QuadrupleOperator.ENDPROC, null, null, null), // 15: padding

        // Función doble (inicia en cuádruplo 16)
        createQuadruple(Operator.MULTIPLY, 5000, 13002, 9003),        // 16: x * 2
        createQuadruple(QuadrupleOperator.RETURN, 9003, null, null),  // 17: return resultado
        createQuadruple(QuadrupleOperator.ENDPROC, null, null, null)  // 18: fin función doble
      ];

      vm.loadQuadruples(quadruples);
      const output = vm.execute();

      // suma(2, 3) = 5, doble(5) = 10
      expect(executionMemory.getValue(1000)).toBe(10);
      expect(output).toEqual(['10']);
    });
  });
});
