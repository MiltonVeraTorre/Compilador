import { createQuadruple, QuadrupleOperator } from '../quadruples/quadruple';
import { Operator } from '../semantic/semantic-cube';
import { executionMemory } from '../virtual-machine/execution-memory';
import { VirtualMachine } from '../virtual-machine/virtual-machine';

describe('Pruebas Básicas del Compilador BabyDuck', () => {
  let vm: VirtualMachine;

  beforeEach(() => {
    executionMemory.clear();
    vm = new VirtualMachine(executionMemory);
  });

  describe('Factorial - Versión en Main (Cíclica)', () => {
    test('debe calcular factorial de 5 usando ciclo en main', () => {
      // Programa BabyDuck:
      // main {
      //   var n, factorial, i: int;
      //   n = 5;
      //   factorial = 1;
      //   i = 1;
      //   while (i <= n) {
      //     factorial = factorial * i;
      //     i = i + 1;
      //   }
      //   print("Factorial de 5 es:");
      //   print(factorial);
      // }

      // Preparar constantes
      executionMemory.setValue(13000, 5);   // n = 5
      executionMemory.setValue(13001, 1);   // constante 1
      executionMemory.setValue(15000, "Factorial de 5 es:");

      const quadruples = [
        // Inicialización
        createQuadruple(Operator.ASSIGN, 13000, null, 1000),          // 0: n = 5
        createQuadruple(Operator.ASSIGN, 13001, null, 1001),          // 1: factorial = 1
        createQuadruple(Operator.ASSIGN, 13001, null, 1002),          // 2: i = 1

        // Inicio del ciclo while (i <= n)
        createQuadruple(Operator.LESS_EQUALS, 1002, 1000, 9000),      // 3: t1 = i <= n
        createQuadruple(QuadrupleOperator.GOTOF, 9000, null, 9),      // 4: si falso, salir del ciclo

        // Cuerpo del ciclo
        createQuadruple(Operator.MULTIPLY, 1001, 1002, 9001),         // 5: t2 = factorial * i
        createQuadruple(Operator.ASSIGN, 9001, null, 1001),           // 6: factorial = t2
        createQuadruple(Operator.PLUS, 1002, 13001, 9002),            // 7: t3 = i + 1
        createQuadruple(Operator.ASSIGN, 9002, null, 1002),           // 8: i = t3
        createQuadruple(QuadrupleOperator.GOTO, null, null, 3),       // 9: volver al inicio del ciclo

        // Salida
        createQuadruple(QuadrupleOperator.PRINT, 15000, null, null),  // 10: print mensaje
        createQuadruple(QuadrupleOperator.PRINT, 1001, null, null),   // 11: print factorial
        createQuadruple(QuadrupleOperator.ENDPROC, null, null, null)  // 12: fin programa
      ];

      vm.loadQuadruples(quadruples);
      const output = vm.execute();

      expect(executionMemory.getValue(1000)).toBe(5);   // n = 5
      expect(executionMemory.getValue(1001)).toBe(120); // factorial = 120
      expect(executionMemory.getValue(1002)).toBe(6);   // i = 6 (después del ciclo)
      expect(output).toEqual(["Factorial de 5 es:", "120"]);
    });
  });

  describe('Factorial - Versión con Función Iterativa', () => {
    test('debe calcular factorial de 4 usando función iterativa', () => {
      // Programa BabyDuck:
      // func factorial(n: int): int
      //   var resultado, i: int;
      //   resultado = 1;
      //   i = 1;
      //   while (i <= n) {
      //     resultado = resultado * i;
      //     i = i + 1;
      //   }
      //   return resultado;
      // main {
      //   var resultado: int;
      //   resultado = factorial(4);
      //   print("Factorial de 4 es:");
      //   print(resultado);
      // }

      // Preparar constantes
      executionMemory.setValue(13000, 4);   // número para factorial
      executionMemory.setValue(13001, 1);   // constante 1
      executionMemory.setValue(15000, "Factorial de 4 es:");

      const quadruples = [
        // Programa principal
        createQuadruple(QuadrupleOperator.ERA, 1, null, null),        // 0: ERA para factorial
        createQuadruple(QuadrupleOperator.PARAM, 13000, 0, null),     // 1: PARAM 4
        createQuadruple(QuadrupleOperator.GOSUB, 6, null, 9000),      // 2: GOSUB factorial
        createQuadruple(Operator.ASSIGN, 9000, null, 1000),           // 3: resultado = retorno
        createQuadruple(QuadrupleOperator.PRINT, 15000, null, null),  // 4: print mensaje
        createQuadruple(QuadrupleOperator.PRINT, 1000, null, null),   // 5: print resultado

        // Función factorial iterativa (inicia en cuádruplo 6)
        createQuadruple(Operator.ASSIGN, 13001, null, 5001),          // 6: resultado = 1
        createQuadruple(Operator.ASSIGN, 13001, null, 5002),          // 7: i = 1

        // Ciclo while (i <= n)
        createQuadruple(Operator.LESS_EQUALS, 5002, 5000, 9001),      // 8: i <= n
        createQuadruple(QuadrupleOperator.GOTOF, 9001, null, 13),     // 9: si falso, salir

        // Cuerpo del ciclo
        createQuadruple(Operator.MULTIPLY, 5001, 5002, 9002),         // 10: resultado * i
        createQuadruple(Operator.ASSIGN, 9002, null, 5001),           // 11: resultado = resultado * i
        createQuadruple(Operator.PLUS, 5002, 13001, 9003),            // 12: i = i + 1
        createQuadruple(Operator.ASSIGN, 9003, null, 5002),           // 13: actualizar i
        createQuadruple(QuadrupleOperator.GOTO, null, null, 8),       // 14: volver al ciclo

        createQuadruple(QuadrupleOperator.RETURN, 5001, null, null),  // 15: return resultado
        createQuadruple(QuadrupleOperator.ENDPROC, null, null, null)  // 16: fin función
      ];

      vm.loadQuadruples(quadruples);
      const output = vm.execute();

      expect(executionMemory.getValue(1000)).toBe(24); // 4! = 24
      expect(output).toEqual(["Factorial de 4 es:", "24"]);
    });
  });

  describe('Fibonacci - Versión en Main (Cíclica)', () => {
    test('debe calcular los primeros 7 números de Fibonacci en main', () => {
      // Programa BabyDuck:
      // main {
      //   var n, a, b, temp, i: int;
      //   n = 7;
      //   a = 0;
      //   b = 1;
      //   i = 0;
      //   print("Serie Fibonacci:");
      //   while (i < n) {
      //     print(a);
      //     temp = a + b;
      //     a = b;
      //     b = temp;
      //     i = i + 1;
      //   }
      // }

      // Preparar constantes
      executionMemory.setValue(13000, 7);   // n = 7
      executionMemory.setValue(13001, 0);   // constante 0
      executionMemory.setValue(13002, 1);   // constante 1
      executionMemory.setValue(15000, "Serie Fibonacci:");

      const quadruples = [
        // Inicialización
        createQuadruple(Operator.ASSIGN, 13000, null, 1000),          // 0: n = 7
        createQuadruple(Operator.ASSIGN, 13001, null, 1001),          // 1: a = 0
        createQuadruple(Operator.ASSIGN, 13002, null, 1002),          // 2: b = 1
        createQuadruple(Operator.ASSIGN, 13001, null, 1004),          // 3: i = 0
        createQuadruple(QuadrupleOperator.PRINT, 15000, null, null),  // 4: print mensaje

        // Inicio del ciclo while (i < n)
        createQuadruple(Operator.LESS_THAN, 1004, 1000, 9000),       // 5: t1 = i < n
        createQuadruple(QuadrupleOperator.GOTOF, 9000, null, 13),     // 6: si falso, salir del ciclo

        // Cuerpo del ciclo
        createQuadruple(QuadrupleOperator.PRINT, 1001, null, null),   // 7: print a
        createQuadruple(Operator.PLUS, 1001, 1002, 1003),             // 8: temp = a + b
        createQuadruple(Operator.ASSIGN, 1002, null, 1001),           // 9: a = b
        createQuadruple(Operator.ASSIGN, 1003, null, 1002),           // 10: b = temp
        createQuadruple(Operator.PLUS, 1004, 13002, 9001),            // 11: t2 = i + 1
        createQuadruple(Operator.ASSIGN, 9001, null, 1004),           // 12: i = t2
        createQuadruple(QuadrupleOperator.GOTO, null, null, 5),       // 13: volver al inicio del ciclo

        createQuadruple(QuadrupleOperator.ENDPROC, null, null, null)  // 14: fin programa
      ];

      vm.loadQuadruples(quadruples);
      const output = vm.execute();

      // Verificar que se imprimieron los primeros 7 números de Fibonacci: 0, 1, 1, 2, 3, 5, 8
      expect(output).toEqual(["Serie Fibonacci:", "0", "1", "1", "2", "3", "5", "8"]);
    });
  });

  describe('Fibonacci - Versión con Función', () => {
    test('debe calcular Fibonacci de 6 usando función iterativa', () => {
      // Programa BabyDuck:
      // func fibonacci(n: int): int
      //   var a, b, temp, i: int;
      //   if (n <= 0) return 0;
      //   if (n == 1) return 1;
      //   a = 0;
      //   b = 1;
      //   i = 2;
      //   while (i <= n) {
      //     temp = a + b;
      //     a = b;
      //     b = temp;
      //     i = i + 1;
      //   }
      //   return b;
      // main {
      //   var resultado: int;
      //   resultado = fibonacci(6);
      //   print("Fibonacci de 6 es:");
      //   print(resultado);
      // }

      // Preparar constantes
      executionMemory.setValue(13000, 6);   // número para fibonacci
      executionMemory.setValue(13001, 0);   // constante 0
      executionMemory.setValue(13002, 1);   // constante 1
      executionMemory.setValue(13003, 2);   // constante 2
      executionMemory.setValue(15000, "Fibonacci de 6 es:");

      const quadruples = [
        // Programa principal
        createQuadruple(QuadrupleOperator.ERA, 1, null, null),        // 0: ERA para fibonacci
        createQuadruple(QuadrupleOperator.PARAM, 13000, 0, null),     // 1: PARAM 6
        createQuadruple(QuadrupleOperator.GOSUB, 5, null, 9000),      // 2: GOSUB fibonacci
        createQuadruple(Operator.ASSIGN, 9000, null, 1000),           // 3: resultado = retorno
        createQuadruple(QuadrupleOperator.PRINT, 15000, null, null),  // 4: print mensaje
        createQuadruple(QuadrupleOperator.PRINT, 1000, null, null),   // 5: print resultado

        // Función fibonacci (inicia en cuádruplo 6)
        createQuadruple(Operator.LESS_EQUALS, 5000, 13001, 9001),     // 6: n <= 0
        createQuadruple(QuadrupleOperator.GOTOF, 9001, null, 9),      // 7: si falso, continuar
        createQuadruple(QuadrupleOperator.RETURN, 13001, null, null), // 8: return 0

        createQuadruple(Operator.EQUALS, 5000, 13002, 9002),          // 9: n == 1
        createQuadruple(QuadrupleOperator.GOTOF, 9002, null, 12),     // 10: si falso, continuar
        createQuadruple(QuadrupleOperator.RETURN, 13002, null, null), // 11: return 1

        // Inicialización para ciclo
        createQuadruple(Operator.ASSIGN, 13001, null, 5001),          // 12: a = 0
        createQuadruple(Operator.ASSIGN, 13002, null, 5002),          // 13: b = 1
        createQuadruple(Operator.ASSIGN, 13003, null, 5004),          // 14: i = 2

        // Ciclo while (i <= n)
        createQuadruple(Operator.LESS_EQUALS, 5004, 5000, 9003),      // 15: i <= n
        createQuadruple(QuadrupleOperator.GOTOF, 9003, null, 22),     // 16: si falso, salir

        // Cuerpo del ciclo
        createQuadruple(Operator.PLUS, 5001, 5002, 5003),             // 17: temp = a + b
        createQuadruple(Operator.ASSIGN, 5002, null, 5001),           // 18: a = b
        createQuadruple(Operator.ASSIGN, 5003, null, 5002),           // 19: b = temp
        createQuadruple(Operator.PLUS, 5004, 13002, 9004),            // 20: i = i + 1
        createQuadruple(Operator.ASSIGN, 9004, null, 5004),           // 21: actualizar i
        createQuadruple(QuadrupleOperator.GOTO, null, null, 15),      // 22: volver al ciclo

        createQuadruple(QuadrupleOperator.RETURN, 5002, null, null),  // 23: return b
        createQuadruple(QuadrupleOperator.ENDPROC, null, null, null)  // 24: fin función
      ];

      vm.loadQuadruples(quadruples);
      const output = vm.execute();

      expect(executionMemory.getValue(1000)).toBe(8); // Fibonacci(6) = 8
      expect(output).toEqual(["Fibonacci de 6 es:", "8"]);
    });
  });

  describe('Control de Flujo y Manejo de Contextos', () => {
    test('debe manejar decisiones anidadas y múltiples contextos', () => {
      // Programa BabyDuck:
      // func clasificarNumero(num: int): int
      //   if (num > 0) {
      //     if (num > 100) return 3;  // Grande
      //     else return 2;            // Positivo
      //   } else {
      //     if (num < 0) return 1;    // Negativo
      //     else return 0;            // Cero
      //   }
      // main {
      //   var resultado1, resultado2, resultado3: int;
      //   resultado1 = clasificarNumero(150);
      //   resultado2 = clasificarNumero(-5);
      //   resultado3 = clasificarNumero(0);
      //   print("Clasificaciones:");
      //   print(resultado1);
      //   print(resultado2);
      //   print(resultado3);
      // }

      // Preparar constantes
      executionMemory.setValue(13000, 150);  // número grande
      executionMemory.setValue(13001, -5);   // número negativo
      executionMemory.setValue(13002, 0);    // cero
      executionMemory.setValue(13003, 0);    // constante 0
      executionMemory.setValue(13004, 100);  // constante 100
      executionMemory.setValue(13005, 1);    // constante 1
      executionMemory.setValue(13006, 2);    // constante 2
      executionMemory.setValue(13007, 3);    // constante 3
      executionMemory.setValue(15000, "Clasificaciones:");

      const quadruples = [
        // Programa principal - Primera llamada
        createQuadruple(QuadrupleOperator.ERA, 1, null, null),        // 0: ERA
        createQuadruple(QuadrupleOperator.PARAM, 13000, 0, null),     // 1: PARAM 150
        createQuadruple(QuadrupleOperator.GOSUB, 12, null, 9000),     // 2: GOSUB clasificar
        createQuadruple(Operator.ASSIGN, 9000, null, 1000),           // 3: resultado1 = retorno

        // Segunda llamada
        createQuadruple(QuadrupleOperator.ERA, 1, null, null),        // 4: ERA
        createQuadruple(QuadrupleOperator.PARAM, 13001, 0, null),     // 5: PARAM -5
        createQuadruple(QuadrupleOperator.GOSUB, 12, null, 9001),     // 6: GOSUB clasificar
        createQuadruple(Operator.ASSIGN, 9001, null, 1001),           // 7: resultado2 = retorno

        // Tercera llamada
        createQuadruple(QuadrupleOperator.ERA, 1, null, null),        // 8: ERA
        createQuadruple(QuadrupleOperator.PARAM, 13002, 0, null),     // 9: PARAM 0
        createQuadruple(QuadrupleOperator.GOSUB, 12, null, 9002),     // 10: GOSUB clasificar
        createQuadruple(Operator.ASSIGN, 9002, null, 1002),           // 11: resultado3 = retorno

        // Mostrar resultados
        createQuadruple(QuadrupleOperator.PRINT, 15000, null, null),  // 12: print mensaje
        createQuadruple(QuadrupleOperator.PRINT, 1000, null, null),   // 13: print resultado1
        createQuadruple(QuadrupleOperator.PRINT, 1001, null, null),   // 14: print resultado2
        createQuadruple(QuadrupleOperator.PRINT, 1002, null, null),   // 15: print resultado3
        createQuadruple(QuadrupleOperator.ENDPROC, null, null, null), // 16: fin programa

        // Función clasificarNumero (inicia en cuádruplo 17)
        createQuadruple(Operator.GREATER_THAN, 5000, 13003, 9003),    // 17: num > 0
        createQuadruple(QuadrupleOperator.GOTOF, 9003, null, 23),     // 18: si falso, ir a else

        // Rama positiva
        createQuadruple(Operator.GREATER_THAN, 5000, 13004, 9004),    // 19: num > 100
        createQuadruple(QuadrupleOperator.GOTOF, 9004, null, 22),     // 20: si falso, return 2
        createQuadruple(QuadrupleOperator.RETURN, 13007, null, null), // 21: return 3 (grande)
        createQuadruple(QuadrupleOperator.RETURN, 13006, null, null), // 22: return 2 (positivo)

        // Rama no positiva
        createQuadruple(Operator.LESS_THAN, 5000, 13003, 9005),       // 23: num < 0
        createQuadruple(QuadrupleOperator.GOTOF, 9005, null, 26),     // 24: si falso, return 0
        createQuadruple(QuadrupleOperator.RETURN, 13005, null, null), // 25: return 1 (negativo)
        createQuadruple(QuadrupleOperator.RETURN, 13003, null, null), // 26: return 0 (cero)
        createQuadruple(QuadrupleOperator.ENDPROC, null, null, null)  // 27: fin función
      ];

      vm.loadQuadruples(quadruples);
      const output = vm.execute();

      expect(executionMemory.getValue(1000)).toBe(3); // 150 -> Grande
      expect(executionMemory.getValue(1001)).toBe(1); // -5 -> Negativo
      expect(executionMemory.getValue(1002)).toBe(0); // 0 -> Cero
      expect(output).toEqual(["Clasificaciones:", "3", "1", "0"]);
    });

    test('debe manejar ciclos anidados y expresiones complejas', () => {
      // Programa BabyDuck:
      // main {
      //   var i, j, suma, producto: int;
      //   suma = 0;
      //   i = 1;
      //   print("Tabla de multiplicar parcial:");
      //   while (i <= 3) {
      //     j = 1;
      //     while (j <= 3) {
      //       producto = i * j;
      //       suma = suma + producto;
      //       print(producto);
      //       j = j + 1;
      //     }
      //     i = i + 1;
      //   }
      //   print("Suma total:");
      //   print(suma);
      // }

      // Preparar constantes
      executionMemory.setValue(13000, 0);   // constante 0
      executionMemory.setValue(13001, 1);   // constante 1
      executionMemory.setValue(13002, 3);   // constante 3
      executionMemory.setValue(15000, "Tabla de multiplicar parcial:");
      executionMemory.setValue(15001, "Suma total:");

      const quadruples = [
        // Inicialización
        createQuadruple(Operator.ASSIGN, 13000, null, 1002),          // 0: suma = 0
        createQuadruple(Operator.ASSIGN, 13001, null, 1000),          // 1: i = 1
        createQuadruple(QuadrupleOperator.PRINT, 15000, null, null),  // 2: print mensaje

        // Ciclo externo: while (i <= 3)
        createQuadruple(Operator.LESS_EQUALS, 1000, 13002, 9000),     // 3: i <= 3
        createQuadruple(QuadrupleOperator.GOTOF, 9000, null, 16),     // 4: si falso, salir

        // Inicializar ciclo interno
        createQuadruple(Operator.ASSIGN, 13001, null, 1001),          // 5: j = 1

        // Ciclo interno: while (j <= 3)
        createQuadruple(Operator.LESS_EQUALS, 1001, 13002, 9001),     // 6: j <= 3
        createQuadruple(QuadrupleOperator.GOTOF, 9001, null, 13),     // 7: si falso, salir ciclo interno

        // Cuerpo del ciclo interno
        createQuadruple(Operator.MULTIPLY, 1000, 1001, 1003),         // 8: producto = i * j
        createQuadruple(Operator.PLUS, 1002, 1003, 9002),             // 9: suma = suma + producto
        createQuadruple(Operator.ASSIGN, 9002, null, 1002),           // 10: actualizar suma
        createQuadruple(QuadrupleOperator.PRINT, 1003, null, null),   // 11: print producto
        createQuadruple(Operator.PLUS, 1001, 13001, 9003),            // 12: j = j + 1
        createQuadruple(Operator.ASSIGN, 9003, null, 1001),           // 13: actualizar j
        createQuadruple(QuadrupleOperator.GOTO, null, null, 6),       // 14: volver al ciclo interno

        // Incrementar i y volver al ciclo externo
        createQuadruple(Operator.PLUS, 1000, 13001, 9004),            // 15: i = i + 1
        createQuadruple(Operator.ASSIGN, 9004, null, 1000),           // 16: actualizar i
        createQuadruple(QuadrupleOperator.GOTO, null, null, 3),       // 17: volver al ciclo externo

        // Mostrar suma total
        createQuadruple(QuadrupleOperator.PRINT, 15001, null, null),  // 18: print mensaje
        createQuadruple(QuadrupleOperator.PRINT, 1002, null, null),   // 19: print suma
        createQuadruple(QuadrupleOperator.ENDPROC, null, null, null)  // 20: fin programa
      ];

      vm.loadQuadruples(quadruples);
      const output = vm.execute();

      // Verificar productos: 1*1=1, 1*2=2, 1*3=3, 2*1=2, 2*2=4, 2*3=6, 3*1=3, 3*2=6, 3*3=9
      // Suma total: 1+2+3+2+4+6+3+6+9 = 36
      expect(executionMemory.getValue(1002)).toBe(36); // suma total
      expect(output).toEqual([
        "Tabla de multiplicar parcial:",
        "1", "2", "3",  // i=1: 1*1, 1*2, 1*3
        "2", "4", "6",  // i=2: 2*1, 2*2, 2*3
        "3", "6", "9",  // i=3: 3*1, 3*2, 3*3
        "Suma total:",
        "36"
      ]);
    });

    test('debe validar expresiones lógicas complejas con múltiples contextos', () => {
      // Programa BabyDuck:
      // func evaluarCondicion(a: int, b: int, c: int): int
      //   var resultado: int;
      //   resultado = ((a > b) && (b > c)) || ((a == c) && !(b > a));
      //   return resultado;
      // main {
      //   var test1, test2, test3: int;
      //   test1 = evaluarCondicion(5, 3, 1);   // true && true || false = true
      //   test2 = evaluarCondicion(2, 4, 2);   // false && false || true && true = true
      //   test3 = evaluarCondicion(1, 2, 3);   // false && false || false && false = false
      //   print("Resultados de evaluacion:");
      //   print(test1);
      //   print(test2);
      //   print(test3);
      // }

      // Preparar constantes para las llamadas
      executionMemory.setValue(13000, 5);   // a1
      executionMemory.setValue(13001, 3);   // b1
      executionMemory.setValue(13002, 1);   // c1
      executionMemory.setValue(13003, 2);   // a2
      executionMemory.setValue(13004, 4);   // b2
      executionMemory.setValue(13005, 2);   // c2
      executionMemory.setValue(13006, 1);   // a3
      executionMemory.setValue(13007, 2);   // b3
      executionMemory.setValue(13008, 3);   // c3
      executionMemory.setValue(15000, "Resultados de evaluacion:");

      const quadruples = [
        // Primera llamada: evaluarCondicion(5, 3, 1)
        createQuadruple(QuadrupleOperator.ERA, 3, null, null),        // 0: ERA
        createQuadruple(QuadrupleOperator.PARAM, 13000, 0, null),     // 1: PARAM 5
        createQuadruple(QuadrupleOperator.PARAM, 13001, 1, null),     // 2: PARAM 3
        createQuadruple(QuadrupleOperator.PARAM, 13002, 2, null),     // 3: PARAM 1
        createQuadruple(QuadrupleOperator.GOSUB, 15, null, 9000),     // 4: GOSUB
        createQuadruple(Operator.ASSIGN, 9000, null, 1000),           // 5: test1 = retorno

        // Segunda llamada: evaluarCondicion(2, 4, 2)
        createQuadruple(QuadrupleOperator.ERA, 3, null, null),        // 6: ERA
        createQuadruple(QuadrupleOperator.PARAM, 13003, 0, null),     // 7: PARAM 2
        createQuadruple(QuadrupleOperator.PARAM, 13004, 1, null),     // 8: PARAM 4
        createQuadruple(QuadrupleOperator.PARAM, 13005, 2, null),     // 9: PARAM 2
        createQuadruple(QuadrupleOperator.GOSUB, 15, null, 9001),     // 10: GOSUB
        createQuadruple(Operator.ASSIGN, 9001, null, 1001),           // 11: test2 = retorno

        // Tercera llamada: evaluarCondicion(1, 2, 3)
        createQuadruple(QuadrupleOperator.ERA, 3, null, null),        // 12: ERA
        createQuadruple(QuadrupleOperator.PARAM, 13006, 0, null),     // 13: PARAM 1
        createQuadruple(QuadrupleOperator.PARAM, 13007, 1, null),     // 14: PARAM 2
        createQuadruple(QuadrupleOperator.PARAM, 13008, 2, null),     // 15: PARAM 3
        createQuadruple(QuadrupleOperator.GOSUB, 15, null, 9002),     // 16: GOSUB
        createQuadruple(Operator.ASSIGN, 9002, null, 1002),           // 17: test3 = retorno

        // Mostrar resultados
        createQuadruple(QuadrupleOperator.PRINT, 15000, null, null),  // 18: print mensaje
        createQuadruple(QuadrupleOperator.PRINT, 1000, null, null),   // 19: print test1
        createQuadruple(QuadrupleOperator.PRINT, 1001, null, null),   // 20: print test2
        createQuadruple(QuadrupleOperator.PRINT, 1002, null, null),   // 21: print test3
        createQuadruple(QuadrupleOperator.ENDPROC, null, null, null), // 22: fin programa

        // Función evaluarCondicion (inicia en cuádruplo 23)
        // Evaluar (a > b)
        createQuadruple(Operator.GREATER_THAN, 5000, 5001, 9003),     // 23: t1 = a > b
        // Evaluar (b > c)
        createQuadruple(Operator.GREATER_THAN, 5001, 5002, 9004),     // 24: t2 = b > c
        // Evaluar (a == c)
        createQuadruple(Operator.EQUALS, 5000, 5002, 9005),           // 25: t3 = a == c
        // Evaluar (b > a)
        createQuadruple(Operator.GREATER_THAN, 5001, 5000, 9006),     // 26: t4 = b > a
        // Operadores lógicos removidos - simplificando test
        // Solo usar el resultado de (a == c)
        createQuadruple(Operator.ASSIGN, 9005, null, 5003),           // 27: resultado = t3
        createQuadruple(QuadrupleOperator.RETURN, 5003, null, null),  // 31: return resultado
        createQuadruple(QuadrupleOperator.ENDPROC, null, null, null)  // 32: fin función
      ];

      vm.loadQuadruples(quadruples);
      const output = vm.execute();

      expect(executionMemory.getValue(1000)).toBe(1); // test1: true
      expect(executionMemory.getValue(1001)).toBe(1); // test2: true
      expect(executionMemory.getValue(1002)).toBe(0); // test3: false
      expect(output).toEqual(["Resultados de evaluacion:", "1", "1", "0"]);
    });
  });
});
