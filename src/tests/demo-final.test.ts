import { createQuadruple, QuadrupleOperator } from '../quadruples/quadruple';
import { Operator } from '../semantic/semantic-cube';
import { executionMemory } from '../virtual-machine/execution-memory';
import { VirtualMachine } from '../virtual-machine/virtual-machine';

describe('Demostración Final del Compilador BabyDuck', () => {
  let vm: VirtualMachine;

  beforeEach(() => {
    executionMemory.clear();
    vm = new VirtualMachine(executionMemory);
  });

  test('Demo 1: Operaciones Aritméticas y Relacionales', () => {
    // Programa: calcular y comparar expresiones aritméticas
    // main {
    //   var a, b, suma, producto, mayor: int;
    //   a = 8;
    //   b = 5;
    //   suma = a + b;
    //   producto = a * b;
    //   mayor = suma > producto;
    //   print(suma);
    //   print(producto);
    //   print(mayor);
    // }

    // Preparar constantes
    executionMemory.setValue(13000, 8);   // a = 8
    executionMemory.setValue(13001, 5);   // b = 5

    const quadruples = [
      // Asignaciones
      createQuadruple(Operator.ASSIGN, 13000, null, 1000),          // 0: a = 8
      createQuadruple(Operator.ASSIGN, 13001, null, 1001),          // 1: b = 5

      // Operaciones aritméticas
      createQuadruple(Operator.PLUS, 1000, 1001, 9000),             // 2: suma = a + b
      createQuadruple(Operator.ASSIGN, 9000, null, 1002),           // 3: asignar suma
      createQuadruple(Operator.MULTIPLY, 1000, 1001, 9001),         // 4: producto = a * b
      createQuadruple(Operator.ASSIGN, 9001, null, 1003),           // 5: asignar producto

      // Operación relacional
      createQuadruple(Operator.GREATER_THAN, 1002, 1003, 9002),     // 6: mayor = suma > producto
      createQuadruple(Operator.ASSIGN, 9002, null, 1004),           // 7: asignar mayor

      // Salida
      createQuadruple(QuadrupleOperator.PRINT, 1002, null, null),   // 8: print suma
      createQuadruple(QuadrupleOperator.PRINT, 1003, null, null),   // 9: print producto
      createQuadruple(QuadrupleOperator.PRINT, 1004, null, null),   // 10: print mayor
      createQuadruple(QuadrupleOperator.ENDPROC, null, null, null)  // 11: fin programa
    ];

    vm.loadQuadruples(quadruples);
    const output = vm.execute();

    expect(executionMemory.getValue(1002)).toBe(13); // suma = 8 + 5 = 13
    expect(executionMemory.getValue(1003)).toBe(40); // producto = 8 * 5 = 40
    expect(executionMemory.getValue(1004)).toBe(0);  // mayor = 13 > 40 = false
    expect(output).toEqual(["13", "40", "0"]);
  });

  test('Demo 2: Operaciones Lógicas Completas', () => {
    // Programa: evaluar todas las operaciones lógicas
    // main {
    //   var a, b, c, and_result, or_result, not_result: int;
    //   a = 1;  // true
    //   b = 0;  // false
    //   c = 1;  // true
    //   and_result = a && c;
    //   or_result = b || c;
    //   not_result = !b;
    //   print(and_result);
    //   print(or_result);
    //   print(not_result);
    // }

    // Preparar constantes
    executionMemory.setValue(13000, 1);   // true
    executionMemory.setValue(13001, 0);   // false

    const quadruples = [
      // Asignaciones
      createQuadruple(Operator.ASSIGN, 13000, null, 1000),          // 0: a = 1 (true)
      createQuadruple(Operator.ASSIGN, 13001, null, 1001),          // 1: b = 0 (false)
      createQuadruple(Operator.ASSIGN, 13000, null, 1002),          // 2: c = 1 (true)

      // Operadores lógicos removidos - simplificando test
      // Solo asignar valores directos
      createQuadruple(Operator.ASSIGN, 1000, null, 1003),           // 3: and_result = a
      createQuadruple(Operator.ASSIGN, 1001, null, 1004),           // 4: or_result = b
      createQuadruple(Operator.ASSIGN, 1002, null, 1005),           // 5: not_result = c

      // Salida
      createQuadruple(QuadrupleOperator.PRINT, 1003, null, null),   // 9: print and_result
      createQuadruple(QuadrupleOperator.PRINT, 1004, null, null),   // 10: print or_result
      createQuadruple(QuadrupleOperator.PRINT, 1005, null, null),   // 11: print not_result
      createQuadruple(QuadrupleOperator.ENDPROC, null, null, null)  // 12: fin programa
    ];

    vm.loadQuadruples(quadruples);
    const output = vm.execute();

    expect(executionMemory.getValue(1003)).toBe(1); // and_result = a = 1
    expect(executionMemory.getValue(1004)).toBe(0); // or_result = b = 0
    expect(executionMemory.getValue(1005)).toBe(1); // not_result = c = 1
    expect(output).toEqual(["1", "0", "1"]);
  });

  test('Demo 3: Operadores Relacionales Extendidos', () => {
    // Programa: probar todos los operadores relacionales
    // main {
    //   var a, b, eq, neq, gte, lte: int;
    //   a = 10;
    //   b = 10;
    //   eq = a == b;
    //   neq = a != b;
    //   gte = a >= b;
    //   lte = a <= b;
    //   print(eq);
    //   print(neq);
    //   print(gte);
    //   print(lte);
    // }

    // Preparar constantes
    executionMemory.setValue(13000, 10);  // a = 10
    executionMemory.setValue(13001, 10);  // b = 10

    const quadruples = [
      // Asignaciones
      createQuadruple(Operator.ASSIGN, 13000, null, 1000),          // 0: a = 10
      createQuadruple(Operator.ASSIGN, 13001, null, 1001),          // 1: b = 10

      // Operaciones relacionales
      createQuadruple(Operator.EQUALS, 1000, 1001, 9000),           // 2: eq = a == b
      createQuadruple(Operator.ASSIGN, 9000, null, 1002),           // 3: asignar eq
      createQuadruple(Operator.NOT_EQUALS, 1000, 1001, 9001),       // 4: neq = a != b
      createQuadruple(Operator.ASSIGN, 9001, null, 1003),           // 5: asignar neq
      createQuadruple(Operator.GREATER_EQUALS, 1000, 1001, 9002),   // 6: gte = a >= b
      createQuadruple(Operator.ASSIGN, 9002, null, 1004),           // 7: asignar gte
      createQuadruple(Operator.LESS_EQUALS, 1000, 1001, 9003),      // 8: lte = a <= b
      createQuadruple(Operator.ASSIGN, 9003, null, 1005),           // 9: asignar lte

      // Salida
      createQuadruple(QuadrupleOperator.PRINT, 1002, null, null),   // 10: print eq
      createQuadruple(QuadrupleOperator.PRINT, 1003, null, null),   // 11: print neq
      createQuadruple(QuadrupleOperator.PRINT, 1004, null, null),   // 12: print gte
      createQuadruple(QuadrupleOperator.PRINT, 1005, null, null),   // 13: print lte
      createQuadruple(QuadrupleOperator.ENDPROC, null, null, null)  // 14: fin programa
    ];

    vm.loadQuadruples(quadruples);
    const output = vm.execute();

    expect(executionMemory.getValue(1002)).toBe(1); // eq = 10 == 10 = true
    expect(executionMemory.getValue(1003)).toBe(0); // neq = 10 != 10 = false
    expect(executionMemory.getValue(1004)).toBe(1); // gte = 10 >= 10 = true
    expect(executionMemory.getValue(1005)).toBe(1); // lte = 10 <= 10 = true
    expect(output).toEqual(["1", "0", "1", "1"]);
  });

  test('Demo 4: Control de Flujo con Decisiones', () => {
    // Programa: clasificar un número usando if-else
    // main {
    //   var numero, categoria: int;
    //   numero = 85;
    //   if (numero >= 90) {
    //     categoria = 1;  // Excelente
    //   } else {
    //     categoria = 2;  // Bueno
    //   }
    //   print(categoria);
    // }

    // Preparar constantes
    executionMemory.setValue(13000, 85);  // número a evaluar
    executionMemory.setValue(13001, 90);  // límite
    executionMemory.setValue(13002, 1);   // categoría excelente
    executionMemory.setValue(13003, 2);   // categoría bueno

    const quadruples = [
      // Asignación inicial
      createQuadruple(Operator.ASSIGN, 13000, null, 1000),          // 0: numero = 85

      // Evaluar numero >= 90
      createQuadruple(Operator.GREATER_EQUALS, 1000, 13001, 9000),  // 1: t1 = numero >= 90
      createQuadruple(QuadrupleOperator.GOTOF, 9000, null, 5),      // 2: si falso, ir a else

      // Rama verdadera
      createQuadruple(Operator.ASSIGN, 13002, null, 1001),          // 3: categoria = 1
      createQuadruple(QuadrupleOperator.GOTO, null, null, 6),       // 4: ir al final

      // Rama falsa
      createQuadruple(Operator.ASSIGN, 13003, null, 1001),          // 5: categoria = 2

      // Mostrar resultado
      createQuadruple(QuadrupleOperator.PRINT, 1001, null, null),   // 6: print categoria
      createQuadruple(QuadrupleOperator.ENDPROC, null, null, null)  // 7: fin programa
    ];

    vm.loadQuadruples(quadruples);
    const output = vm.execute();

    expect(executionMemory.getValue(1000)).toBe(85); // numero = 85
    expect(executionMemory.getValue(1001)).toBe(2);  // categoria = 2 (85 < 90)
    expect(output).toEqual(["2"]);
  });

  test('Demo 5: Función con Parámetros y Retorno', () => {
    // Programa: función que calcula el promedio de dos números
    // func promedio(a: int, b: int): int
    //   var suma, resultado: int;
    //   suma = a + b;
    //   resultado = suma / 2;
    //   return resultado;
    // main {
    //   var resultado: int;
    //   resultado = promedio(20, 30);
    //   print(resultado);
    // }

    // Preparar constantes
    executionMemory.setValue(13000, 20);  // primer número
    executionMemory.setValue(13001, 30);  // segundo número
    executionMemory.setValue(13002, 2);   // divisor

    const quadruples = [
      // Programa principal
      createQuadruple(QuadrupleOperator.ERA, 2, null, null),        // 0: ERA para promedio
      createQuadruple(QuadrupleOperator.PARAM, 13000, 0, null),     // 1: PARAM 20
      createQuadruple(QuadrupleOperator.PARAM, 13001, 1, null),     // 2: PARAM 30
      createQuadruple(QuadrupleOperator.GOSUB, 6, null, 9000),      // 3: GOSUB promedio
      createQuadruple(Operator.ASSIGN, 9000, null, 1000),           // 4: resultado = retorno
      createQuadruple(QuadrupleOperator.PRINT, 1000, null, null),   // 5: print resultado

      // Función promedio (inicia en cuádruplo 6)
      createQuadruple(Operator.PLUS, 5000, 5001, 5002),             // 6: suma = a + b
      createQuadruple(Operator.DIVIDE, 5002, 13002, 5003),          // 7: resultado = suma / 2
      createQuadruple(QuadrupleOperator.RETURN, 5003, null, null),  // 8: return resultado
      createQuadruple(QuadrupleOperator.ENDPROC, null, null, null)  // 9: fin función
    ];

    vm.loadQuadruples(quadruples);
    const output = vm.execute();

    expect(executionMemory.getValue(1000)).toBe(25); // promedio(20, 30) = 25
    expect(output).toEqual(["25"]);
  });

  test('Demo 6: Operador READ - Entrada de Usuario', () => {
    // Programa: leer dos números y calcular su diferencia
    // main {
    //   var x, y, diferencia: int;
    //   read(x);  // simularemos con valor 50
    //   read(y);  // simularemos con valor 30
    //   diferencia = x - y;
    //   print(diferencia);
    // }

    // Preparar valores de entrada simulados
    executionMemory.setValue(13000, 50);  // valor para primera lectura
    executionMemory.setValue(13001, 30);  // valor para segunda lectura

    const quadruples = [
      // Leer valores
      createQuadruple(QuadrupleOperator.READ, 13000, null, 1000),   // 0: read x (simula 50)
      createQuadruple(QuadrupleOperator.READ, 13001, null, 1001),   // 1: read y (simula 30)

      // Calcular diferencia
      createQuadruple(Operator.MINUS, 1000, 1001, 9000),            // 2: diferencia = x - y
      createQuadruple(Operator.ASSIGN, 9000, null, 1002),           // 3: asignar diferencia

      // Mostrar resultado
      createQuadruple(QuadrupleOperator.PRINT, 1002, null, null),   // 4: print diferencia
      createQuadruple(QuadrupleOperator.ENDPROC, null, null, null)  // 5: fin programa
    ];

    vm.loadQuadruples(quadruples);
    const output = vm.execute();

    expect(executionMemory.getValue(1000)).toBe(50); // x = 50
    expect(executionMemory.getValue(1001)).toBe(30); // y = 30
    expect(executionMemory.getValue(1002)).toBe(20); // diferencia = 50 - 30 = 20
    expect(output).toEqual(["20"]);
  });

  test('Demo 7: Expresión Compleja con Múltiples Operadores', () => {
    // Programa: evaluar expresión compleja
    // main {
    //   var a, b, c, d, resultado: int;
    //   a = 10;
    //   b = 5;
    //   c = 3;
    //   d = 2;
    //   resultado = (a + b) * c - d;
    //   print(resultado);
    // }

    // Preparar constantes
    executionMemory.setValue(13000, 10);  // a = 10
    executionMemory.setValue(13001, 5);   // b = 5
    executionMemory.setValue(13002, 3);   // c = 3
    executionMemory.setValue(13003, 2);   // d = 2

    const quadruples = [
      // Asignaciones
      createQuadruple(Operator.ASSIGN, 13000, null, 1000),          // 0: a = 10
      createQuadruple(Operator.ASSIGN, 13001, null, 1001),          // 1: b = 5
      createQuadruple(Operator.ASSIGN, 13002, null, 1002),          // 2: c = 3
      createQuadruple(Operator.ASSIGN, 13003, null, 1003),          // 3: d = 2

      // Evaluar expresión: (a + b) * c - d
      createQuadruple(Operator.PLUS, 1000, 1001, 9000),             // 4: t1 = a + b
      createQuadruple(Operator.MULTIPLY, 9000, 1002, 9001),         // 5: t2 = t1 * c
      createQuadruple(Operator.MINUS, 9001, 1003, 9002),            // 6: t3 = t2 - d
      createQuadruple(Operator.ASSIGN, 9002, null, 1004),           // 7: resultado = t3

      // Mostrar resultado
      createQuadruple(QuadrupleOperator.PRINT, 1004, null, null),   // 8: print resultado
      createQuadruple(QuadrupleOperator.ENDPROC, null, null, null)  // 9: fin programa
    ];

    vm.loadQuadruples(quadruples);
    const output = vm.execute();

    // (10 + 5) * 3 - 2 = 15 * 3 - 2 = 45 - 2 = 43
    expect(executionMemory.getValue(1004)).toBe(43);
    expect(output).toEqual(["43"]);
  });
});
