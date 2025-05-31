# Puntos Neurálgicos en BabyDuck

## Introducción

Los puntos neurálgicos son puntos específicos en la gramática donde se realizan acciones semánticas durante el análisis sintáctico. Estas acciones pueden incluir la generación de código intermedio, la verificación de tipos, la asignación de memoria, entre otras.

Este documento describe los puntos neurálgicos en la gramática de BabyDuck y las acciones semánticas asociadas a cada uno.

## Diagrama de Sintaxis con Puntos Neurálgicos

A continuación se presenta la gramática de BabyDuck con los puntos neurálgicos marcados con `{#}` donde `#` es un número que identifica el punto neurálgico.

```
program -> PROGRAM ID {1} ; vars? func* main {32} body {33} end

vars -> VAR (ID {2} : type {3} ;)+

type -> INT | FLOAT | STRING

func -> VOID ID {4} ( paramList? ) {5} [ vars? body {6} ] ;

paramList -> ID {7} : type {8} (, ID {7} : type {8})*

body -> { statement* }

statement -> assign | condition | cycle | f_call | print

assign -> ID {9} = expression {10} ;

expression -> exp ((> | < | >= | <= | == | !=) {11} exp {12})?

exp -> term ((+ | -) {13} term {14})*

term -> factor ((* | /) {15} factor {16})*

factor -> (+ | -)? ( ( expression ) | ID {17} | cte | f_call )

cte -> CTE_INT {18} | CTE_FLOAT {19} | CTE_STRING {20}

condition -> IF ( expression {21} ) body {22} (ELSE body {23})? ;

cycle -> WHILE {24} ( expression {25} ) DO body {26} ;

f_call -> ID {27} ( argList? ) {28} ;

argList -> expression {29} (, expression {29})*

print -> PRINT ( (expression {30} | CTE_STRING {31}) ) ;
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
   - Verificar que la función no esté ya declarada.
   - Agregar la función al directorio de funciones con tipo VOID.
   - Establecer la función como el ámbito actual.
   - Inicializar contador de parámetros.

5. **{5} - Fin de lista de parámetros**
   - Acción: Completar el registro de parámetros de la función.
   - Guardar la dirección de inicio de la función (índice del siguiente cuádruplo).
   - Validar que todos los parámetros estén correctamente registrados.

6. **{6} - Fin de función**
   - Acción: Generar cuádruplo ENDPROC y volver al ámbito anterior.
   - Asignar direcciones virtuales a todas las variables locales.
   - Calcular el tamaño total del espacio de activación.
   - Restaurar el ámbito anterior (global).

7. **{7} - Declaración de parámetro (nombre)**
   - Acción: Guardar el nombre del parámetro para su posterior registro.
   - Verificar que el parámetro no esté ya declarado en la función.

8. **{8} - Declaración de parámetro (tipo)**
   - Acción: Registrar el parámetro con su tipo en la tabla de variables de la función.
   - Asignar una dirección virtual al parámetro según su tipo.
   - Agregar el parámetro a la lista de parámetros de la función.
   - Incrementar el contador de parámetros.

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
    - Buscar la función en el directorio de funciones.
    - Generar cuádruplo ERA para reservar espacio de activación.
    - Calcular el tamaño del espacio basado en variables locales y parámetros.
    - Inicializar contador de argumentos.

28. **{28} - Fin de llamada a función**
    - Acción: Verificar que el número de argumentos coincida con el número de parámetros.
    - Generar cuádruplo GOSUB para saltar a la función.
    - Si la función retorna un valor, asignar dirección temporal para el resultado.
    - Apilar el resultado en las pilas de operandos y tipos (si aplica).

29. **{29} - Argumento de función**
    - Acción: Evaluar la expresión del argumento.
    - Verificar compatibilidad de tipos con el parámetro correspondiente.
    - Generar cuádruplo PARAM para pasar el argumento.
    - Incrementar el contador de argumentos.
    - Verificar que no se excedan los parámetros esperados.

### Retorno de Funciones

34. **{34} - Retorno con valor**
    - Acción: Evaluar la expresión de retorno.
    - Verificar que el tipo coincida con el tipo de retorno de la función.
    - Generar cuádruplo RETURN con el valor.
    - Verificar que la función no sea de tipo VOID.

35. **{35} - Retorno sin valor**
    - Acción: Generar cuádruplo RETURN sin valor.
    - Verificar que la función sea de tipo VOID.

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
    - Crear entrada en el directorio de funciones para main.
    - Inicializar el contexto de ejecución principal.

33. **{33} - Fin de main**
    - Acción: Volver al ámbito global.
    - Generar cuádruplo END para terminar el programa.
    - Completar la asignación de direcciones virtuales.

## Puntos Neurálgicos Adicionales Identificados

### Operadores Unarios

36. **{36} - Operador unario positivo (+)**
    - Acción: Procesar el signo positivo en factores.
    - Verificar que el operando sea numérico (INT o FLOAT).
    - Generar cuádruplo de operación unaria si es necesario.

37. **{37} - Operador unario negativo (-)**
    - Acción: Procesar el signo negativo en factores.
    - Verificar que el operando sea numérico (INT o FLOAT).
    - Generar cuádruplo de negación unaria.

### Operadores Relacionales Extendidos

38. **{38} - Operador mayor o igual (>=)**
    - Acción: Apilar el operador >= para comparación.
    - Verificar compatibilidad de tipos en la expresión relacional.

39. **{39} - Operador menor o igual (<=)**
    - Acción: Apilar el operador <= para comparación.
    - Verificar compatibilidad de tipos en la expresión relacional.

40. **{40} - Operador de igualdad (==)**
    - Acción: Apilar el operador == para comparación.
    - Verificar compatibilidad de tipos en la expresión relacional.

### Llamadas a Función en Expresiones

41. **{41} - Llamada a función en factor**
    - Acción: Procesar llamada a función dentro de una expresión.
    - Verificar que la función esté declarada y retorne un valor.
    - Generar cuádruplos ERA, PARAM (si hay argumentos), y GOSUB.
    - Apilar el resultado de la función en la pila de operandos.

### Múltiples Expresiones en Print

42. **{42} - Múltiples expresiones en print**
    - Acción: Procesar cada expresión adicional en un print.
    - Generar cuádruplo PRINT para cada expresión.
    - Verificar que cada expresión sea válida.

## Puntos Neurálgicos Potencialmente Faltantes

Basándome en el diagrama sintáctico proporcionado, los siguientes puntos neurálgicos podrían necesitar implementación o documentación adicional:

### Ciclos FOR (si se implementan en el futuro)

43. **{43} - Inicio de ciclo FOR**
    - Acción: Inicializar variable de control del ciclo.
    - Guardar dirección de inicio del ciclo.
    - Procesar la condición inicial.

44. **{44} - Condición de ciclo FOR**
    - Acción: Evaluar la condición de continuación.
    - Generar cuádruplo GOTOF para salir del ciclo.

45. **{45} - Incremento de ciclo FOR**
    - Acción: Procesar la expresión de incremento.
    - Generar cuádruplo de asignación para actualizar la variable de control.

### Manejo de Tipos STRING

46. **{46} - Operaciones con STRING**
    - Acción: Validar operaciones permitidas con cadenas.
    - Solo permitir concatenación (+) y comparaciones de igualdad.
    - Generar cuádruplos específicos para operaciones de cadenas.

### Validaciones de Contexto

47. **{47} - Validación de ámbito de variables**
    - Acción: Verificar que las variables se usen en el ámbito correcto.
    - Buscar primero en ámbito local, luego en global.
    - Reportar error si la variable no está declarada en ningún ámbito.

48. **{48} - Validación de llamadas recursivas**
    - Acción: Detectar y manejar llamadas recursivas.
    - Verificar que no haya recursión infinita obvia.
    - Generar cuádruplos apropiados para el manejo de la pila de activación.

## Implementación

Los puntos neurálgicos están implementados en el analizador semántico (`src/semantic/semantic-analyzer.ts`) a través de diversos métodos que procesan los nodos del árbol de sintaxis concreta (CST).

Cada método realiza las acciones semánticas correspondientes a uno o más puntos neurálgicos, como la verificación de tipos, la generación de cuádruplos, la asignación de memoria, entre otras.

### Estado Actual de Implementación

**Puntos Neurálgicos Implementados:**
- {1} a {33}: Completamente implementados
- {38}, {39}, {40}: Implementados (operadores relacionales extendidos)
- {42}: Implementado (múltiples expresiones en print)

**Puntos Neurálgicos Pendientes:**
- {36}, {37}: No implementados (operadores unarios + y -)
- {41}: No implementado (llamadas a función en expresiones)
- {43}, {44}, {45}: No implementados (ciclos FOR)
- {46}: Parcialmente implementado (operaciones con STRING)
- {47}, {48}: Implementados básicamente (validaciones de contexto)

**Puntos Neurálgicos Removidos:**
- Operadores lógicos AND (&&), OR (||) y NOT (!) han sido removidos del compilador por decisión de diseño.

### Recomendaciones

1. **Operadores Unarios**: Implementar operadores unarios (+, -) en factores si se requieren.
2. **Llamadas a Función en Expresiones**: Implementar llamadas a función dentro de expresiones si se requieren.
3. **Validación de Tipos STRING**: Implementar validaciones específicas para operaciones con cadenas.
4. **Ciclos FOR**: Si se planea agregar ciclos FOR, implementar los puntos neurálgicos correspondientes.
5. **Documentación**: Mantener este documento actualizado conforme se implementen nuevos puntos neurálgicos.

**Nota**: Los operadores lógicos AND (&&), OR (||) y NOT (!) han sido removidos del compilador. Si en el futuro se requieren, será necesario volver a implementarlos en todos los componentes (lexer, parser, analizador semántico, cubo semántico, cuádruplos y máquina virtual).
