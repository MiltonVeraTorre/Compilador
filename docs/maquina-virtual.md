# Máquina Virtual de BabyDuck

## Introducción

La Máquina Virtual de BabyDuck es el componente encargado de ejecutar los cuádruplos generados por el compilador. Implementa un modelo de ejecución basado en direcciones virtuales y contextos de activación para el manejo de funciones. Soporta operaciones aritméticas, relacionales, lógicas, de control de flujo, funciones y entrada/salida.

## Arquitectura

### Componentes Principales

1. **VirtualMachine**: Clase principal que ejecuta los cuádruplos
2. **ExecutionMemory**: Maneja la memoria durante la ejecución
3. **ActivationStack**: Pila de contextos de activación para funciones
4. **ActivationContext**: Contexto individual de una función

## Mapa de Memoria de Ejecución

### Segmentos de Memoria

La memoria virtual está dividida en cuatro segmentos principales:

```
┌─────────────────────────────────────────────────────────────┐
│                    MEMORIA VIRTUAL                          │
├─────────────────────────────────────────────────────────────┤
│ GLOBALES (1000-4999)                                       │
│ ├─ INT:    1000-1999                                       │
│ ├─ FLOAT:  2000-2999                                       │
│ └─ STRING: 3000-3999                                       │
├─────────────────────────────────────────────────────────────┤
│ LOCALES (5000-8999)                                        │
│ ├─ INT:    5000-5999                                       │
│ ├─ FLOAT:  6000-6999                                       │
│ └─ STRING: 7000-7999                                       │
├─────────────────────────────────────────────────────────────┤
│ TEMPORALES (9000-12999)                                    │
│ ├─ INT:    9000-9999                                       │
│ ├─ FLOAT:  10000-10999                                     │
│ └─ STRING: 11000-11999                                     │
├─────────────────────────────────────────────────────────────┤
│ CONSTANTES (13000-16999)                                   │
│ ├─ INT:    13000-13999                                     │
│ ├─ FLOAT:  14000-14999                                     │
│ └─ STRING: 15000-15999                                     │
└─────────────────────────────────────────────────────────────┘
```

### Gestión de Memoria por Segmento

- **Memoria Global**: Variables declaradas en el ámbito global
- **Memoria Local**: Variables locales y parámetros de funciones
- **Memoria Temporal**: Variables temporales generadas durante expresiones
- **Memoria de Constantes**: Valores literales del programa

## Contextos de Activación

### Estructura del Contexto

Cada función tiene su propio contexto de activación que contiene:

```typescript
interface ActivationContext {
  functionName: string;           // Nombre de la función
  returnAddress: number;          // Dirección de retorno
  localMemory: Map<number, any>;  // Variables locales
  parameterMemory: Map<number, any>; // Parámetros
  returnValue?: any;              // Valor de retorno
}
```

### Pila de Activación

La pila de contextos maneja:
- Creación de nuevos contextos al llamar funciones
- Destrucción de contextos al retornar
- Acceso a variables locales y parámetros
- Manejo de valores de retorno

## Cuádruplos de Funciones

### ERA (Espacio de Activación)
```
(ERA, tamaño, _, _)
```
- Reserva espacio para una nueva función
- `tamaño`: número de variables locales + parámetros

### PARAM (Parámetro)
```
(PARAM, dirección_valor, índice_param, _)
```
- Pasa un parámetro a la función
- `dirección_valor`: dirección del valor del parámetro
- `índice_param`: posición del parámetro (0, 1, 2, ...)

### GOSUB (Llamada a Subrutina)
```
(GOSUB, dirección_función, _, dirección_resultado)
```
- Salta a la función especificada
- `dirección_función`: dirección de inicio de la función
- `dirección_resultado`: dirección donde guardar el valor de retorno (null para funciones void)

### RETURN (Retorno)
```
(RETURN, dirección_valor, _, _)
```
- Retorna de la función actual
- `dirección_valor`: valor a retornar (null para funciones void)

### ENDPROC (Fin de Procedimiento)
```
(ENDPROC, _, _, _)
```
- Marca el final de una función
- Limpia el contexto de activación

## Algoritmo de Ejecución

### Ciclo Principal

1. **Inicialización**
   - Cargar cuádruplos
   - Inicializar memoria
   - Establecer puntero de instrucción en 0

2. **Ejecución**
   ```
   mientras (ejecutando Y puntero < total_cuádruplos):
     cuádruplo = obtener_cuádruplo(puntero)
     ejecutar_cuádruplo(cuádruplo)
     incrementar_puntero()
   ```

3. **Finalización**
   - Limpiar memoria
   - Retornar salida generada

### Manejo de Funciones

1. **Llamada a Función**
   ```
   ERA → crear contexto de activación
   PARAM → pasar parámetros al contexto
   GOSUB → saltar a la función
   ```

2. **Ejecución de Función**
   - Variables locales en el contexto actual
   - Acceso a parámetros desde el contexto
   - Generación de temporales

3. **Retorno de Función**
   ```
   RETURN → establecer valor de retorno
   destruir contexto actual
   regresar a dirección de retorno
   ```

## Operaciones Soportadas

### Aritméticas
- `+`, `-`, `*`, `/`
- Verificación de división por cero
- Conversión automática de tipos

### Relacionales
- `>`, `<`, `!=`
- Resultado: 1 (verdadero) o 0 (falso)

### Control de Flujo
- `GOTO`: salto incondicional
- `GOTOF`: salto si falso
- `GOTOT`: salto si verdadero

### Entrada/Salida
- `PRINT`: impresión de valores

## Manejo de Valores de Retorno

### Problema Resuelto
La implementación inicial tenía una limitación: solo soportaba un valor de retorno simultáneo porque usaba una dirección temporal fija (9000). Esto causaba problemas con:
- Funciones anidadas
- Múltiples llamadas a funciones
- Recursión

### Solución Implementada
Cada cuádruplo GOSUB especifica la dirección exacta donde debe guardarse el valor de retorno:

```
(GOSUB, dirección_función, _, dirección_resultado)
```

### Flujo de Ejecución
1. **GOSUB**: Guarda `dirección_resultado` en el contexto de activación
2. **Función ejecuta**: Calcula el valor de retorno
3. **RETURN**: Obtiene `dirección_resultado` del contexto y guarda el valor ahí
4. **Continuación**: El programa principal usa el valor desde la dirección específica

### Ejemplo con Múltiples Funciones
```
// suma(2, 3) = 5, doble(5) = 10
GOSUB suma, _, 9000      // Resultado de suma en 9000
GOSUB doble, _, 9001     // Resultado de doble en 9001 (usando 9000 como parámetro)
```

Esto permite:
- **Funciones anidadas**: `doble(suma(2, 3))`
- **Múltiples retornos**: Cada función tiene su propia dirección de resultado
- **Recursión**: Cada nivel de recursión tiene su propio contexto

## Manejo de Errores

### Errores de Ejecución
- División por cero
- Acceso a memoria no inicializada
- Desbordamiento de pila de activación
- Tipos incompatibles

### Recuperación
- Terminación controlada del programa
- Mensajes de error descriptivos
- Limpieza de recursos

## Optimizaciones

### Memoria
- Reutilización de direcciones temporales
- Liberación automática de contextos
- Mapas eficientes para acceso a memoria

### Ejecución
- Salto directo por índice de cuádruplo
- Evaluación perezosa de expresiones
- Cache de direcciones frecuentes

## Ejemplo de Ejecución

### Código BabyDuck
```
func suma(a: int, b: int): int
  return a + b;

main {
  var resultado: int;
  resultado = suma(5, 3);
  print(resultado);
}
```

### Cuádruplos Generados
```
0: (ERA, 2, _, _)           // Espacio para suma (2 parámetros)
1: (PARAM, 13000, 0, _)     // Pasar 5 como parámetro 0
2: (PARAM, 13001, 1, _)     // Pasar 3 como parámetro 1
3: (GOSUB, 6, _, 9000)      // Llamar suma, resultado en 9000
4: (=, 9000, _, 1000)       // resultado = valor retornado
5: (PRINT, 1000, _, _)      // print(resultado)
6: (+, 5000, 5001, 9001)    // a + b (en función suma)
7: (RETURN, 9001, _, _)     // retornar resultado
8: (ENDPROC, _, _, _)       // fin de función suma
```

### Ejecución Paso a Paso
1. ERA: Crear contexto para `suma`
2. PARAM: Pasar 5 y 3 como parámetros
3. GOSUB: Saltar a función `suma`
4. +: Ejecutar suma en contexto de función
5. RETURN: Retornar resultado y destruir contexto
6. =: Asignar resultado a variable
7. PRINT: Imprimir resultado (8)

## Estructura de Memoria de Ejecución

### Descripción General

La memoria de ejecución (`ExecutionMemory`) es el componente central que maneja todos los datos durante la ejecución del programa. Está organizada en segmentos especializados para diferentes tipos de datos y contextos.

### Componentes de la Memoria

#### 1. Memoria Global (`globalMemory`)
- **Tipo**: `Map<number, any>`
- **Propósito**: Almacena variables globales del programa
- **Rango de direcciones**: 1000-4999
- **Persistencia**: Durante toda la ejecución del programa

#### 2. Memoria de Constantes (`constantMemory`)
- **Tipo**: `Map<number, any>`
- **Propósito**: Almacena valores constantes (literales)
- **Rango de direcciones**: 13000-16999
- **Características**: Solo lectura, inicializada al inicio

#### 3. Memoria Temporal (`temporalMemory`)
- **Tipo**: `Map<number, any>`
- **Propósito**: Almacena resultados temporales de expresiones
- **Rango de direcciones**: 9000-12999
- **Características**: Volátil, se reutiliza durante la ejecución

#### 4. Pila de Contextos de Activación (`activationStack`)
- **Tipo**: `ActivationStack`
- **Propósito**: Maneja contextos de funciones (memoria local)
- **Rango de direcciones**: 5000-8999
- **Características**: LIFO (Last In, First Out)

### Representación Gráfica de la Memoria

```
┌─────────────────────────────────────────────────────────────┐
│                    MEMORIA DE EJECUCIÓN                     │
├─────────────────────────────────────────────────────────────┤
│  SEGMENTO GLOBAL (1000-4999)                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Variables globales del programa principal           │   │
│  │ - Declaradas fuera de funciones                     │   │
│  │ - Accesibles desde cualquier contexto               │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  SEGMENTO LOCAL (5000-8999) - PILA DE ACTIVACIÓN         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Contexto Función C (Tope de la pila)               │   │
│  │ ├─ Parámetros                                       │   │
│  │ ├─ Variables locales                                │   │
│  │ └─ Dirección de retorno                             │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ Contexto Función B                                  │   │
│  │ ├─ Parámetros                                       │   │
│  │ ├─ Variables locales                                │   │
│  │ └─ Dirección de retorno                             │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ Contexto Función A (Base de la pila)               │   │
│  │ ├─ Parámetros                                       │   │
│  │ ├─ Variables locales                                │   │
│  │ └─ Dirección de retorno                             │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  SEGMENTO TEMPORAL (9000-12999)                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Variables temporales para expresiones               │   │
│  │ - Resultados intermedios de operaciones             │   │
│  │ - Valores de retorno de funciones                   │   │
│  │ - Evaluación de condiciones                         │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  SEGMENTO CONSTANTES (13000-16999)                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Valores constantes del programa                     │   │
│  │ - Literales enteros, flotantes, strings            │   │
│  │ - Inicializados al cargar el programa               │   │
│  │ - Solo lectura durante la ejecución                 │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Métodos Principales de Acceso

#### `setValue(address: number, value: any): void`
- **Propósito**: Almacena un valor en la dirección especificada
- **Funcionamiento**:
  1. Determina el segmento basado en la dirección
  2. Almacena el valor en el segmento correspondiente
  3. Para memoria local, usa el contexto de activación actual

#### `getValue(address: number): any`
- **Propósito**: Recupera un valor de la dirección especificada
- **Funcionamiento**:
  1. Determina el segmento basado en la dirección
  2. Recupera el valor del segmento correspondiente
  3. Para memoria local, busca en el contexto de activación actual

#### `createActivationContext(name: string, returnAddress: number): void`
- **Propósito**: Crea un nuevo contexto de activación para una función
- **Funcionamiento**:
  1. Crea un nuevo contexto en la pila de activación
  2. Establece la dirección de retorno
  3. Inicializa el espacio para variables locales

#### `popActivationContext(): number | undefined`
- **Propósito**: Elimina el contexto de activación actual
- **Funcionamiento**:
  1. Obtiene la dirección de retorno del contexto actual
  2. Elimina el contexto de la pila
  3. Retorna la dirección de retorno

### Gestión de Contextos de Activación

Los contextos de activación implementan el modelo de pila para el manejo de llamadas a funciones:

```typescript
interface ActivationContext {
  name: string;              // Nombre de la función
  returnAddress: number;     // Dirección de retorno
  resultAddress?: number;    // Dirección para el valor de retorno
  localMemory: Map<number, any>; // Memoria local de la función
}
```

### Ejemplo de Uso de Memoria

```typescript
// Inicializar constantes
memory.setValue(13000, 5);    // Constante 5
memory.setValue(13001, 3);    // Constante 3

// Crear contexto de función
memory.createActivationContext('suma', 10);

// Pasar parámetros (direcciones locales 5000, 5001)
memory.setValue(5000, 5);     // Parámetro a
memory.setValue(5001, 3);     // Parámetro b

// Operación en memoria temporal
memory.setValue(9000, 8);     // Resultado temporal

// Retornar y limpiar contexto
const returnAddr = memory.popActivationContext();
```

## Códigos de Operación Implementados

### Operaciones Aritméticas

| Operador | Símbolo | Descripción | Ejemplo de Cuádruplo |
|----------|---------|-------------|---------------------|
| PLUS | + | Suma | `(+, 1000, 1001, 9000)` |
| MINUS | - | Resta | `(-, 1000, 1001, 9000)` |
| MULTIPLY | * | Multiplicación | `(*, 1000, 1001, 9000)` |
| DIVIDE | / | División | `(/, 1000, 1001, 9000)` |

### Operaciones Relacionales

| Operador | Símbolo | Descripción | Ejemplo de Cuádruplo |
|----------|---------|-------------|---------------------|
| GREATER_THAN | > | Mayor que | `(>, 1000, 1001, 9000)` |
| LESS_THAN | < | Menor que | `(<, 1000, 1001, 9000)` |
| GREATER_EQUALS | >= | Mayor o igual | `(>=, 1000, 1001, 9000)` |
| LESS_EQUALS | <= | Menor o igual | `(<=, 1000, 1001, 9000)` |
| EQUALS | == | Igual | `(==, 1000, 1001, 9000)` |
| NOT_EQUALS | != | Diferente | `(!=, 1000, 1001, 9000)` |

### Operaciones Lógicas

| Operador | Símbolo | Descripción | Ejemplo de Cuádruplo |
|----------|---------|-------------|---------------------|
| AND | && | Y lógico | `(&&, 9000, 9001, 9002)` |
| OR | \|\| | O lógico | `(\|\|, 9000, 9001, 9002)` |
| NOT | ! | Negación lógica | `(!, 9000, _, 9001)` |

### Operaciones de Asignación

| Operador | Símbolo | Descripción | Ejemplo de Cuádruplo |
|----------|---------|-------------|---------------------|
| ASSIGN | = | Asignación | `(=, 9000, _, 1000)` |

### Operaciones de Control de Flujo

| Operador | Descripción | Ejemplo de Cuádruplo |
|----------|-------------|---------------------|
| GOTO | Salto incondicional | `(goto, _, _, 10)` |
| GOTOF | Salto si falso | `(gotof, 9000, _, 15)` |
| GOTOT | Salto si verdadero | `(gotot, 9000, _, 20)` |

### Operaciones de Entrada/Salida

| Operador | Descripción | Ejemplo de Cuádruplo |
|----------|-------------|---------------------|
| PRINT | Imprimir valor | `(print, 1000, _, _)` |
| READ | Leer entrada | `(read, _, _, 1000)` |

### Operaciones de Funciones

| Operador | Descripción | Ejemplo de Cuádruplo |
|----------|-------------|---------------------|
| ERA | Crear espacio de activación | `(era, 2, _, _)` |
| PARAM | Pasar parámetro | `(param, 1000, 0, _)` |
| GOSUB | Llamar función | `(gosub, 50, _, 9000)` |
| RETURN | Retornar de función | `(return, 9000, _, _)` |
| ENDPROC | Fin de procedimiento | `(endproc, _, _, _)` |

### Características de Implementación

#### Manejo de Tipos
- Los valores booleanos se representan como enteros (0 = falso, 1 = verdadero)
- Las operaciones relacionales y lógicas retornan 0 o 1
- La división siempre produce un resultado flotante
- Se soportan conversiones implícitas entre int y float

#### Manejo de Errores
- División por cero lanza excepción
- Acceso a memoria no inicializada retorna `undefined`
- Operadores desconocidos lanzan excepción

#### Optimizaciones
- Evaluación perezosa en operaciones lógicas (cortocircuito)
- Reutilización de memoria temporal
- Gestión eficiente de contextos de activación
