# Puntos Neurálgicos en BabyDuck

## Introducción

Los puntos neurálgicos son puntos específicos en la gramática donde se realizan acciones semánticas durante el análisis sintáctico. Estas acciones pueden incluir la generación de código intermedio, la verificación de tipos, la asignación de memoria, entre otras.

Este documento describe los puntos neurálgicos en la gramática de BabyDuck y las acciones semánticas asociadas a cada uno.

## Diagrama de Sintaxis con Puntos Neurálgicos

A continuación se presenta la gramática de BabyDuck con los puntos neurálgicos marcados con `{#}` donde `#` es un número que identifica el punto neurálgico.

```
program -> PROGRAM ID {1} ; vars? func* main end

vars -> VAR (ID {2} : type {3} ;)+

type -> INT | FLOAT | STRING

func -> FUNC ID {4} ( paramList? ) : type {5} vars? body {6}

paramList -> ID {7} : type {8} (, ID {7} : type {8})*

body -> { statement* }

statement -> assign | condition | cycle | f_call | print

assign -> ID {9} = expression {10} ;

expression -> exp ((> | < | !=) {11} exp {12})?

exp -> term ((+ | -) {13} term {14})*

term -> factor ((* | /) {15} factor {16})*

factor -> ( expression ) | ID {17} | cte | f_call

cte -> CTE_INT {18} | CTE_FLOAT {19} | CTE_STRING {20}

condition -> IF ( expression {21} ) body {22} (ELSE body {23})? ;

cycle -> WHILE {24} ( expression {25} ) DO body {26} ;

f_call -> ID {27} ( argList? ) {28} ;

argList -> expression {29} (, expression {29})*

print -> PRINT ( (expression {30} | CTE_STRING {31}) ) ;

main -> MAIN {32} body {33}
```

## Descripción de los Puntos Neurálgicos

### Programa y Declaraciones

1. **{1} - Inicio del programa**
   - Acción: Registrar el nombre del programa y crear el ámbito global.

2. **{2} - Declaración de variable (nombre)**
   - Acción: Guardar el nombre de la variable para su posterior registro.

3. **{3} - Declaración de variable (tipo)**
   - Acción: Registrar la variable con su tipo en la tabla de variables actual.
   - Asignar una dirección virtual a la variable según su tipo y ámbito.

### Funciones y Parámetros

4. **{4} - Declaración de función (nombre)**
   - Acción: Registrar el nombre de la función y crear un nuevo ámbito.

5. **{5} - Declaración de función (tipo de retorno)**
   - Acción: Establecer el tipo de retorno de la función.

6. **{6} - Fin de función**
   - Acción: Generar cuádruplo ENDPROC y volver al ámbito anterior.

7. **{7} - Declaración de parámetro (nombre)**
   - Acción: Guardar el nombre del parámetro para su posterior registro.

8. **{8} - Declaración de parámetro (tipo)**
   - Acción: Registrar el parámetro con su tipo en la tabla de variables de la función.
   - Asignar una dirección virtual al parámetro según su tipo.

### Asignaciones y Expresiones

9. **{9} - Asignación (variable)**
   - Acción: Verificar que la variable esté declarada y guardar su nombre.

10. **{10} - Asignación (expresión)**
    - Acción: Generar cuádruplo de asignación.
    - Verificar compatibilidad de tipos entre la variable y la expresión.

11. **{11} - Operador relacional**
    - Acción: Apilar el operador relacional.

12. **{12} - Expresión relacional (segundo operando)**
    - Acción: Generar cuádruplo para la operación relacional.
    - Verificar compatibilidad de tipos entre los operandos.

13. **{13} - Operador de suma o resta**
    - Acción: Apilar el operador.

14. **{14} - Expresión de suma o resta (segundo operando)**
    - Acción: Generar cuádruplo para la operación.
    - Verificar compatibilidad de tipos entre los operandos.

15. **{15} - Operador de multiplicación o división**
    - Acción: Apilar el operador.

16. **{16} - Expresión de multiplicación o división (segundo operando)**
    - Acción: Generar cuádruplo para la operación.
    - Verificar compatibilidad de tipos entre los operandos.

17. **{17} - Variable en expresión**
    - Acción: Verificar que la variable esté declarada.
    - Apilar la dirección virtual de la variable y su tipo.

### Constantes

18. **{18} - Constante entera**
    - Acción: Asignar dirección virtual a la constante.
    - Apilar la dirección y el tipo INT.

19. **{19} - Constante flotante**
    - Acción: Asignar dirección virtual a la constante.
    - Apilar la dirección y el tipo FLOAT.

20. **{20} - Constante string**
    - Acción: Asignar dirección virtual a la constante.
    - Apilar la dirección y el tipo STRING.

### Estatutos de Control

21. **{21} - Condición de if**
    - Acción: Evaluar la expresión.
    - Verificar que la expresión sea de tipo INT (booleano).
    - Generar cuádruplo GOTOF y apilar su índice.

22. **{22} - Fin del bloque if**
    - Acción: Si hay un else, generar cuádruplo GOTO y apilar su índice.
    - Completar el GOTOF con la dirección actual.

23. **{23} - Fin del bloque else**
    - Acción: Completar el GOTO con la dirección actual.

24. **{24} - Inicio de while**
    - Acción: Guardar la dirección actual para el retorno del ciclo.

25. **{25} - Condición de while**
    - Acción: Evaluar la expresión.
    - Verificar que la expresión sea de tipo INT (booleano).
    - Generar cuádruplo GOTOF y apilar su índice.

26. **{26} - Fin del bloque while**
    - Acción: Generar cuádruplo GOTO para volver al inicio del ciclo.
    - Completar el GOTOF con la dirección actual.

### Llamadas a Funciones

27. **{27} - Llamada a función (nombre)**
    - Acción: Verificar que la función esté declarada.
    - Generar cuádruplo ERA para reservar espacio.

28. **{28} - Fin de llamada a función**
    - Acción: Verificar que el número de argumentos coincida con el número de parámetros.
    - Generar cuádruplo GOSUB para saltar a la función.

29. **{29} - Argumento de función**
    - Acción: Evaluar la expresión.
    - Verificar compatibilidad de tipos con el parámetro correspondiente.
    - Generar cuádruplo PARAM para pasar el argumento.

### Impresión

30. **{30} - Impresión de expresión**
    - Acción: Evaluar la expresión.
    - Generar cuádruplo PRINT para imprimir el resultado.

31. **{31} - Impresión de constante string**
    - Acción: Asignar dirección virtual a la constante.
    - Generar cuádruplo PRINT para imprimir la cadena.

### Función Principal

32. **{32} - Inicio de main**
    - Acción: Establecer el ámbito actual como "main".

33. **{33} - Fin de main**
    - Acción: Volver al ámbito global.

## Implementación

Los puntos neurálgicos están implementados en el analizador semántico (`src/semantic/semantic-analyzer.ts`) a través de diversos métodos que procesan los nodos del árbol de sintaxis concreta (CST).

Cada método realiza las acciones semánticas correspondientes a uno o más puntos neurálgicos, como la verificación de tipos, la generación de cuádruplos, la asignación de memoria, entre otras.
