import { createQuadruple, QuadrupleOperator } from '../quadruples/quadruple';
import { Operator } from '../semantic/semantic-cube';
import { executionMemory } from './execution-memory';
import { VirtualMachine } from './virtual-machine';

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

  describe('Expresiones Complejas con Operadores Relacionales', () => {
    test('debe ejecutar expresión relacional compleja', () => {
      // Simular: resultado = (a >= 5)
      executionMemory.setValue(1000, 8);   // variable a = 8
      executionMemory.setValue(13000, 5);  // constante 5

      const quadruples = [
        createQuadruple(Operator.GREATER_EQUALS, 1000, 13000, 9000), // t1 = a >= 5
        createQuadruple(Operator.ASSIGN, 9000, null, 1002)           // resultado = t1
      ];

      vm.loadQuadruples(quadruples);
      vm.execute();

      expect(executionMemory.getValue(1002)).toBe(1); // verdadero (8 >= 5)
    });

    test('debe ejecutar expresión con comparación de igualdad', () => {
      // Simular: resultado = (a == b)
      executionMemory.setValue(1000, 5);   // variable a = 5
      executionMemory.setValue(1001, 5);   // variable b = 5

      const quadruples = [
        createQuadruple(Operator.EQUALS, 1000, 1001, 9000),  // t1 = a == b
        createQuadruple(Operator.ASSIGN, 9000, null, 1002)   // resultado = t1
      ];

      vm.loadQuadruples(quadruples);
      vm.execute();

      expect(executionMemory.getValue(1002)).toBe(1); // verdadero (5 == 5)
    });

    test('debe ejecutar expresión con comparación menor que', () => {
      // Simular: resultado = (a < b)
      executionMemory.setValue(1000, 5);   // variable a = 5
      executionMemory.setValue(1001, 12);  // variable b = 12

      const quadruples = [
        createQuadruple(Operator.LESS_THAN, 1000, 1001, 9000),  // t1 = a < b
        createQuadruple(Operator.ASSIGN, 9000, null, 1002)      // resultado = t1
      ];

      vm.loadQuadruples(quadruples);
      vm.execute();

      expect(executionMemory.getValue(1002)).toBe(1); // verdadero (5 < 12)
    });
  });
});
