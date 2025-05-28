import { VirtualMachine } from './virtual-machine';
import { createQuadruple, QuadrupleOperator } from '../quadruples/quadruple';
import { Operator } from '../semantic/semantic-cube';
import { executionMemory } from './execution-memory';

describe('VirtualMachine - Operadores Extendidos', () => {
  let vm: VirtualMachine;

  beforeEach(() => {
    executionMemory.clear();
    vm = new VirtualMachine(executionMemory);
  });

  describe('Operadores Relacionales Extendidos', () => {
    test('debe ejecutar mayor o igual (>=) correctamente', () => {
      executionMemory.setValue(13000, 8);
      executionMemory.setValue(13001, 5);
      executionMemory.setValue(13002, 8);

      const quadruples = [
        createQuadruple(Operator.GREATER_EQUALS, 13000, 13001, 9000), // 8 >= 5 = true
        createQuadruple(Operator.GREATER_EQUALS, 13000, 13002, 9001), // 8 >= 8 = true
        createQuadruple(Operator.GREATER_EQUALS, 13001, 13000, 9002)  // 5 >= 8 = false
      ];

      vm.loadQuadruples(quadruples);
      vm.execute();

      expect(executionMemory.getValue(9000)).toBe(1); // verdadero
      expect(executionMemory.getValue(9001)).toBe(1); // verdadero
      expect(executionMemory.getValue(9002)).toBe(0); // falso
    });

    test('debe ejecutar menor o igual (<=) correctamente', () => {
      executionMemory.setValue(13000, 3);
      executionMemory.setValue(13001, 7);
      executionMemory.setValue(13002, 3);

      const quadruples = [
        createQuadruple(Operator.LESS_EQUALS, 13000, 13001, 9000), // 3 <= 7 = true
        createQuadruple(Operator.LESS_EQUALS, 13000, 13002, 9001), // 3 <= 3 = true
        createQuadruple(Operator.LESS_EQUALS, 13001, 13000, 9002)  // 7 <= 3 = false
      ];

      vm.loadQuadruples(quadruples);
      vm.execute();

      expect(executionMemory.getValue(9000)).toBe(1); // verdadero
      expect(executionMemory.getValue(9001)).toBe(1); // verdadero
      expect(executionMemory.getValue(9002)).toBe(0); // falso
    });

    test('debe ejecutar igual (==) correctamente', () => {
      executionMemory.setValue(13000, 5);
      executionMemory.setValue(13001, 5);
      executionMemory.setValue(13002, 8);

      const quadruples = [
        createQuadruple(Operator.EQUALS, 13000, 13001, 9000), // 5 == 5 = true
        createQuadruple(Operator.EQUALS, 13000, 13002, 9001)  // 5 == 8 = false
      ];

      vm.loadQuadruples(quadruples);
      vm.execute();

      expect(executionMemory.getValue(9000)).toBe(1); // verdadero
      expect(executionMemory.getValue(9001)).toBe(0); // falso
    });
  });

  describe('Operadores Lógicos', () => {
    test('debe ejecutar AND (&&) correctamente', () => {
      executionMemory.setValue(13000, 1); // verdadero
      executionMemory.setValue(13001, 1); // verdadero
      executionMemory.setValue(13002, 0); // falso

      const quadruples = [
        createQuadruple(Operator.AND, 13000, 13001, 9000), // true && true = true
        createQuadruple(Operator.AND, 13000, 13002, 9001), // true && false = false
        createQuadruple(Operator.AND, 13002, 13002, 9002)  // false && false = false
      ];

      vm.loadQuadruples(quadruples);
      vm.execute();

      expect(executionMemory.getValue(9000)).toBe(1); // verdadero
      expect(executionMemory.getValue(9001)).toBe(0); // falso
      expect(executionMemory.getValue(9002)).toBe(0); // falso
    });

    test('debe ejecutar OR (||) correctamente', () => {
      executionMemory.setValue(13000, 1); // verdadero
      executionMemory.setValue(13001, 1); // verdadero
      executionMemory.setValue(13002, 0); // falso

      const quadruples = [
        createQuadruple(Operator.OR, 13000, 13001, 9000), // true || true = true
        createQuadruple(Operator.OR, 13000, 13002, 9001), // true || false = true
        createQuadruple(Operator.OR, 13002, 13002, 9002)  // false || false = false
      ];

      vm.loadQuadruples(quadruples);
      vm.execute();

      expect(executionMemory.getValue(9000)).toBe(1); // verdadero
      expect(executionMemory.getValue(9001)).toBe(1); // verdadero
      expect(executionMemory.getValue(9002)).toBe(0); // falso
    });

    test('debe ejecutar NOT (!) correctamente', () => {
      executionMemory.setValue(13000, 1); // verdadero
      executionMemory.setValue(13001, 0); // falso

      const quadruples = [
        createQuadruple(Operator.NOT, 13000, null, 9000), // !true = false
        createQuadruple(Operator.NOT, 13001, null, 9001)  // !false = true
      ];

      vm.loadQuadruples(quadruples);
      vm.execute();

      expect(executionMemory.getValue(9000)).toBe(0); // falso
      expect(executionMemory.getValue(9001)).toBe(1); // verdadero
    });
  });

  describe('Operador READ', () => {
    test('debe ejecutar READ con valor por defecto', () => {
      executionMemory.setValue(13000, 42); // valor por defecto

      const quadruples = [
        createQuadruple(QuadrupleOperator.READ, 13000, null, 1000) // leer valor a variable 1000
      ];

      vm.loadQuadruples(quadruples);
      vm.execute();

      expect(executionMemory.getValue(1000)).toBe(42);
    });

    test('debe ejecutar read sin valor por defecto', () => {
      const quadruples = [
        createQuadruple(QuadrupleOperator.READ, null, null, 1000) // leer valor a variable 1000
      ];

      vm.loadQuadruples(quadruples);
      vm.execute();

      expect(executionMemory.getValue(1000)).toBe(0); // valor por defecto es 0
    });
  });

  describe('Expresiones Complejas con Nuevos Operadores', () => {
    test('debe ejecutar expresión lógica compleja', () => {
      // Simular: resultado = (a >= 5) && (b <= 10)
      executionMemory.setValue(1000, 8);   // variable a = 8
      executionMemory.setValue(1001, 7);   // variable b = 7
      executionMemory.setValue(13000, 5);  // constante 5
      executionMemory.setValue(13001, 10); // constante 10

      const quadruples = [
        createQuadruple(Operator.GREATER_EQUALS, 1000, 13000, 9000), // t1 = a >= 5
        createQuadruple(Operator.LESS_EQUALS, 1001, 13001, 9001),    // t2 = b <= 10
        createQuadruple(Operator.AND, 9000, 9001, 9002),             // t3 = t1 && t2
        createQuadruple(Operator.ASSIGN, 9002, null, 1002)           // resultado = t3
      ];

      vm.loadQuadruples(quadruples);
      vm.execute();

      expect(executionMemory.getValue(1002)).toBe(1); // verdadero (8 >= 5 && 7 <= 10)
    });

    test('debe ejecutar expresión con negación', () => {
      // Simular: resultado = !(a == b)
      executionMemory.setValue(1000, 5);   // variable a = 5
      executionMemory.setValue(1001, 8);   // variable b = 8

      const quadruples = [
        createQuadruple(Operator.EQUALS, 1000, 1001, 9000),  // t1 = a == b
        createQuadruple(Operator.NOT, 9000, null, 9001),     // t2 = !t1
        createQuadruple(Operator.ASSIGN, 9001, null, 1002)   // resultado = t2
      ];

      vm.loadQuadruples(quadruples);
      vm.execute();

      expect(executionMemory.getValue(1002)).toBe(1); // verdadero (!(5 == 8) = !false = true)
    });

    test('debe ejecutar expresión con OR y comparaciones', () => {
      // Simular: resultado = (a < 3) || (b > 10)
      executionMemory.setValue(1000, 5);   // variable a = 5
      executionMemory.setValue(1001, 12);  // variable b = 12
      executionMemory.setValue(13000, 3);  // constante 3
      executionMemory.setValue(13001, 10); // constante 10

      const quadruples = [
        createQuadruple(Operator.LESS_THAN, 1000, 13000, 9000),  // t1 = a < 3
        createQuadruple(Operator.GREATER_THAN, 1001, 13001, 9001), // t2 = b > 10
        createQuadruple(Operator.OR, 9000, 9001, 9002),          // t3 = t1 || t2
        createQuadruple(Operator.ASSIGN, 9002, null, 1002)       // resultado = t3
      ];

      vm.loadQuadruples(quadruples);
      vm.execute();

      expect(executionMemory.getValue(1002)).toBe(1); // verdadero (false || true = true)
    });
  });
});
