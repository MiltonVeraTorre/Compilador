import { VirtualMachine } from '../virtual-machine/virtual-machine';
import { createQuadruple, QuadrupleOperator } from '../quadruples/quadruple';
import { Operator } from '../semantic/semantic-cube';
import { executionMemory } from '../virtual-machine/execution-memory';

describe('Demostración del Compilador BabyDuck', () => {
  let vm: VirtualMachine;

  beforeEach(() => {
    executionMemory.clear();
    vm = new VirtualMachine(executionMemory);
  });

  test('Demo 1: Programa con operaciones aritméticas y relacionales', () => {
    // Programa BabyDuck:
    // main {
    //   var a, b, resultado: int;
    //   a = 15;
    //   b = 8;
    //   resultado = a + b * 2;
    //   if (resultado >= 30) {
    //     print("Resultado mayor o igual a 30");
    //   } else {
    //     print("Resultado menor a 30");
    //   }
    //   print(resultado);
    // }

    // Preparar constantes
    executionMemory.setValue(13000, 15);  // constante 15
    executionMemory.setValue(13001, 8);   // constante 8
    executionMemory.setValue(13002, 2);   // constante 2
    executionMemory.setValue(13003, 30);  // constante 30
    executionMemory.setValue(15000, "Resultado mayor o igual a 30");
    executionMemory.setValue(15001, "Resultado menor a 30");

    const quadruples = [
      // Asignaciones
      createQuadruple(Operator.ASSIGN, 13000, null, 1000),          // 0: a = 15
      createQuadruple(Operator.ASSIGN, 13001, null, 1001),          // 1: b = 8

      // Calcular resultado = a + b * 2
      createQuadruple(Operator.MULTIPLY, 1001, 13002, 9000),        // 2: t1 = b * 2
      createQuadruple(Operator.PLUS, 1000, 9000, 9001),             // 3: t2 = a + t1
      createQuadruple(Operator.ASSIGN, 9001, null, 1002),           // 4: resultado = t2

      // Evaluar condición: resultado >= 30
      createQuadruple(Operator.GREATER_EQUALS, 1002, 13003, 9002),  // 5: t3 = resultado >= 30
      createQuadruple(QuadrupleOperator.GOTOF, 9002, null, 9),      // 6: si falso, ir a 9

      // Rama verdadera
      createQuadruple(QuadrupleOperator.PRINT, 15000, null, null),  // 7: print mensaje1
      createQuadruple(QuadrupleOperator.GOTO, null, null, 10),      // 8: ir a 10

      // Rama falsa
      createQuadruple(QuadrupleOperator.PRINT, 15001, null, null),  // 9: print mensaje2

      // Continuar
      createQuadruple(QuadrupleOperator.PRINT, 1002, null, null),   // 10: print resultado
      createQuadruple(QuadrupleOperator.ENDPROC, null, null, null)  // 11: fin programa
    ];

    vm.loadQuadruples(quadruples);
    const output = vm.execute();

    expect(executionMemory.getValue(1000)).toBe(15);  // a = 15
    expect(executionMemory.getValue(1001)).toBe(8);   // b = 8
    expect(executionMemory.getValue(1002)).toBe(31);  // resultado = 15 + 8*2 = 31
    expect(output).toEqual(["Resultado mayor o igual a 30", "31"]);
  });

  test('Demo 2: Programa con operaciones lógicas', () => {
    // Programa BabyDuck:
    // main {
    //   var x, y, z: int;
    //   var condicion: int;
    //   x = 5;
    //   y = 10;
    //   z = 3;
    //   condicion = (x > z) && (y <= 10) || !(x == y);
    //   print(condicion);
    // }

    // Preparar constantes
    executionMemory.setValue(13000, 5);   // constante 5
    executionMemory.setValue(13001, 10);  // constante 10
    executionMemory.setValue(13002, 3);   // constante 3

    const quadruples = [
      // Asignaciones
      createQuadruple(Operator.ASSIGN, 13000, null, 1000),          // 0: x = 5
      createQuadruple(Operator.ASSIGN, 13001, null, 1001),          // 1: y = 10
      createQuadruple(Operator.ASSIGN, 13002, null, 1002),          // 2: z = 3

      // Evaluar (x > z)
      createQuadruple(Operator.GREATER_THAN, 1000, 1002, 9000),     // 3: t1 = x > z

      // Evaluar (y <= 10)
      createQuadruple(Operator.LESS_EQUALS, 1001, 13001, 9001),     // 4: t2 = y <= 10

      // Evaluar (x == y)
      createQuadruple(Operator.EQUALS, 1000, 1001, 9002),           // 5: t3 = x == y

      // Evaluar !(x == y)
      createQuadruple(Operator.NOT, 9002, null, 9003),              // 6: t4 = !t3

      // Evaluar (x > z) && (y <= 10)
      createQuadruple(Operator.AND, 9000, 9001, 9004),              // 7: t5 = t1 && t2

      // Evaluar resultado final: t5 || t4
      createQuadruple(Operator.OR, 9004, 9003, 9005),               // 8: t6 = t5 || t4

      // Asignar y mostrar resultado
      createQuadruple(Operator.ASSIGN, 9005, null, 1003),           // 9: condicion = t6
      createQuadruple(QuadrupleOperator.PRINT, 1003, null, null),   // 10: print condicion
      createQuadruple(QuadrupleOperator.ENDPROC, null, null, null)  // 11: fin programa
    ];

    vm.loadQuadruples(quadruples);
    const output = vm.execute();

    // (5 > 3) && (10 <= 10) || !(5 == 10)
    // true && true || !false
    // true || true = true
    expect(executionMemory.getValue(1003)).toBe(1); // verdadero
    expect(output).toEqual(['1']);
  });

  test('Demo 3: Programa con función y READ', () => {
    // Programa BabyDuck:
    // func promedio(a: int, b: int): int
    //   return (a + b) / 2;
    // main {
    //   var num1, num2, resultado: int;
    //   read(num1);  // simularemos con 20
    //   read(num2);  // simularemos con 30
    //   resultado = promedio(num1, num2);
    //   print("El promedio es:");
    //   print(resultado);
    // }

    // Preparar valores de entrada simulados y constantes
    executionMemory.setValue(13000, 20);  // valor para primera lectura
    executionMemory.setValue(13001, 30);  // valor para segunda lectura
    executionMemory.setValue(13002, 2);   // constante 2 para división
    executionMemory.setValue(15000, "El promedio es:");

    const quadruples = [
      // Leer valores
      createQuadruple(QuadrupleOperator.READ, 13000, null, 1000),   // 0: read num1 (simula 20)
      createQuadruple(QuadrupleOperator.READ, 13001, null, 1001),   // 1: read num2 (simula 30)

      // Llamar función promedio
      createQuadruple(QuadrupleOperator.ERA, 2, null, null),        // 2: ERA para promedio
      createQuadruple(QuadrupleOperator.PARAM, 1000, 0, null),      // 3: PARAM num1
      createQuadruple(QuadrupleOperator.PARAM, 1001, 1, null),      // 4: PARAM num2
      createQuadruple(QuadrupleOperator.GOSUB, 10, null, 9000),     // 5: GOSUB promedio
      createQuadruple(Operator.ASSIGN, 9000, null, 1002),           // 6: resultado = retorno

      // Mostrar resultado
      createQuadruple(QuadrupleOperator.PRINT, 15000, null, null),  // 7: print mensaje
      createQuadruple(QuadrupleOperator.PRINT, 1002, null, null),   // 8: print resultado
      createQuadruple(QuadrupleOperator.ENDPROC, null, null, null), // 9: fin programa

      // Función promedio (inicia en cuádruplo 10)
      createQuadruple(Operator.PLUS, 5000, 5001, 9001),             // 10: a + b
      createQuadruple(Operator.DIVIDE, 9001, 13002, 9002),          // 11: (a + b) / 2
      createQuadruple(QuadrupleOperator.RETURN, 9002, null, null),  // 12: return resultado
      createQuadruple(QuadrupleOperator.ENDPROC, null, null, null)  // 13: fin función
    ];

    vm.loadQuadruples(quadruples);
    const output = vm.execute();

    expect(executionMemory.getValue(1000)).toBe(20); // num1 = 20
    expect(executionMemory.getValue(1001)).toBe(30); // num2 = 30
    expect(executionMemory.getValue(1002)).toBe(25); // resultado = (20 + 30) / 2 = 25
    expect(output).toEqual(["El promedio es:", "25"]);
  });

  test('Demo 4: Programa con control de flujo complejo', () => {
    // Programa BabyDuck:
    // main {
    //   var numero, categoria: int;
    //   numero = 85;
    //   if (numero >= 90) {
    //     categoria = 1;  // Excelente
    //   } else if (numero >= 80) {
    //     categoria = 2;  // Bueno
    //   } else if (numero >= 70) {
    //     categoria = 3;  // Regular
    //   } else {
    //     categoria = 4;  // Malo
    //   }
    //   print("Categoria:");
    //   print(categoria);
    // }

    // Preparar constantes
    executionMemory.setValue(13000, 85);  // número a evaluar
    executionMemory.setValue(13001, 90);  // límite excelente
    executionMemory.setValue(13002, 80);  // límite bueno
    executionMemory.setValue(13003, 70);  // límite regular
    executionMemory.setValue(13004, 1);   // categoría excelente
    executionMemory.setValue(13005, 2);   // categoría bueno
    executionMemory.setValue(13006, 3);   // categoría regular
    executionMemory.setValue(13007, 4);   // categoría malo
    executionMemory.setValue(15000, "Categoria:");

    const quadruples = [
      // Asignación inicial
      createQuadruple(Operator.ASSIGN, 13000, null, 1000),          // 0: numero = 85

      // Evaluar numero >= 90
      createQuadruple(Operator.GREATER_EQUALS, 1000, 13001, 9000),  // 1: t1 = numero >= 90
      createQuadruple(QuadrupleOperator.GOTOF, 9000, null, 5),      // 2: si falso, ir a 5
      createQuadruple(Operator.ASSIGN, 13004, null, 1001),          // 3: categoria = 1
      createQuadruple(QuadrupleOperator.GOTO, null, null, 15),      // 4: ir al final

      // Evaluar numero >= 80
      createQuadruple(Operator.GREATER_EQUALS, 1000, 13002, 9001),  // 5: t2 = numero >= 80
      createQuadruple(QuadrupleOperator.GOTOF, 9001, null, 9),      // 6: si falso, ir a 9
      createQuadruple(Operator.ASSIGN, 13005, null, 1001),          // 7: categoria = 2
      createQuadruple(QuadrupleOperator.GOTO, null, null, 15),      // 8: ir al final

      // Evaluar numero >= 70
      createQuadruple(Operator.GREATER_EQUALS, 1000, 13003, 9002),  // 9: t3 = numero >= 70
      createQuadruple(QuadrupleOperator.GOTOF, 9002, null, 13),     // 10: si falso, ir a 13
      createQuadruple(Operator.ASSIGN, 13006, null, 1001),          // 11: categoria = 3
      createQuadruple(QuadrupleOperator.GOTO, null, null, 15),      // 12: ir al final

      // Caso por defecto
      createQuadruple(Operator.ASSIGN, 13007, null, 1001),          // 13: categoria = 4
      createQuadruple(QuadrupleOperator.GOTO, null, null, 15),      // 14: ir al final

      // Mostrar resultado
      createQuadruple(QuadrupleOperator.PRINT, 15000, null, null),  // 15: print "Categoria:"
      createQuadruple(QuadrupleOperator.PRINT, 1001, null, null),   // 16: print categoria
      createQuadruple(QuadrupleOperator.ENDPROC, null, null, null)  // 17: fin programa
    ];

    vm.loadQuadruples(quadruples);
    const output = vm.execute();

    expect(executionMemory.getValue(1000)).toBe(85); // numero = 85
    expect(executionMemory.getValue(1001)).toBe(2);  // categoria = 2 (Bueno, 80 <= 85 < 90)
    expect(output).toEqual(["Categoria:", "2"]);
  });
});
