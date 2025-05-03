# Compilador BabyDuck

Un proyecto de compilador para el lenguaje BabyDuck construido con TypeScript y Chevrotain. Este compilador implementa un lexer y un parser para el lenguaje BabyDuck.

## Descripción del Proyecto

El compilador BabyDuck es una implementación de un compilador para un lenguaje de programación sencillo. El proyecto usa los siguientes conceptos:

- Análisis léxico
- Análisis sintáctico
- Árboles de sintaxis
- Manejo de errores léxicos y sintácticos
- Validaciones semánticas
- Generación de código intermedio (en desarrollo)

## Instalación y Configuración

Para instalar y configurar el proyecto:

```bash
# Clonar el repo
git clone https://github.com/MiltonVeraTorre/Compilador.git

# Entrar a la carpeta
cd Compilador

# Instalar dependencias
npm install

# Compilar el proyecto
npm run build

# Ejecutar los tests
npm test

# Ejecutar el ejemplo
npm start
```

## El Lenguaje BabyDuck

BabyDuck es un lenguaje de programación chiquito pero funcional, que tiene:

- Declaración de variables con tipo
- Funciones con parámetros
- Estructuras de control (`if`, `while`, etc)
- Operaciones aritméticas y relacionales
- Impresión de valores con `print`

### Gramática Básica

La gramática de BabyDuck sigue esta estructura:

```
<program> ::= program Id ';' <varsOpt> <funcsOpt> main <body> end
<varsOpt> ::= var <varDecl> | ε
<varDecl> ::= <idList> ':' <type> ';' <varDecl> | ε
<funcsOpt> ::= <func> <funcsOpt> | ε
<func> ::= void Id '(' <paramList> ')' '[' <varsOpt> <body> ']' ';'
<body> ::= '{' <stmtList> '}'
```

### Ejemplos de Programas

#### Ejemplo Básico:

```babyduck
program ejemplo;
var
  x: int;
  y: int;

main {
  x = 5;
  y = 10;
  print(x + y);
}
end
```

#### Ejemplo con Condicionales:

```babyduck
program condicionales;
var
  edad: int;

main {
  edad = 18;

  if (edad >= 18) {
    print("Eres mayor de edad");
  } else {
    print("Eres menor de edad");
  };
}
end
```

#### Ejemplo con Ciclos:

```babyduck
program ciclos;
var
  contador: int;

main {
  contador = 5;

  while (contador > 0) do {
    print(contador);
    contador = contador - 1;
  };
}
end
```

#### Ejemplo con Funciones:

```babyduck
program funciones;
var
  a: int;
  b: int;

void suma(x: int, y: int) [
  var
    resultado: int;
  {
    resultado = x + y;
    print(resultado);
  }
];

main {
  a = 10;
  b = 20;
  suma(a, b);
}
end
```

## Estructura del Proyecto

```
src/
  lexer/
    lexer.ts       # Analizador léxico
    tokens.ts      # Definición de tokens del lenguaje
  parser/
    parser.ts      # Analizador sintáctico
    grammar.ts     # Gramática BabyDuck
    cst-types.ts   # Tipos para el árbol de sintaxis
  semantic/
    semantic-analyzer.ts    # Analizador semántico
    function-directory.ts   # Directorio de funciones
    variable-table.ts       # Tabla de variables
    semantic-cube.ts        # Cubo semántico para validar tipos
    index.ts                # Exportaciones de componentes semánticos
  index.ts         # Entrada principal del compilador
  index.test.ts    # Tests básicos con Jest
  semantic.test.ts # Tests semánticos
  example.ts       # Ejemplo de uso
```

## Flujo de Compilación

1. **Análisis Léxico**: El código fuente se convierte en tokens usando Chevrotain.
   - Se identifican palabras clave, identificadores, literales, etc.
   - Se detectan errores léxicos como caracteres inválidos.

2. **Análisis Sintáctico**: Se validan las reglas gramaticales.
   - Se construye un árbol de sintaxis concreto (CST).
   - Se detectan errores sintácticos como estructura incorrecta.

3. **Análisis Semántico**: Se checa que el programa tenga sentido lógico.
   - Se validan tipos en expresiones y asignaciones.
   - Se verifica que las variables estén declaradas.
   - Se comprueban parámetros en llamadas a funciones.
   - Se detectan errores como variables duplicadas.

4. **Generación de código** (en desarrollo):
   - Se asignan direcciones de memoria virtual.
   - Se generará código intermedio para ejecución.

## Cómo Ejecutar Tests

Para ejecutar los tests del compilador:

```bash
# Ejecutar todos los tests
npm test

# Ejecutar solo tests del lexer/parser
npx jest index.test.ts

# Ejecutar solo tests semánticos
npx jest semantic.test.ts
```

Los tests verifican tanto casos correctos como detección de errores.

---

# Documentación de Componentes Semánticos - BabyDuck

## Índice

1. [Introducción](#introducción)
2. [Cubo Semántico](#cubo-semántico)
3. [Directorio de Funciones](#directorio-de-funciones)
4. [Tabla de Variables](#tabla-de-variables)
5. [Analizador Semántico](#analizador-semántico)
6. [Puntos Neurálgicos](#puntos-neurálgicos)
7. [Validaciones Semánticas](#validaciones-semánticas)
8. [Manejo de Errores](#manejo-de-errores)
9. [Asignación de Memoria](#asignación-de-memoria)
10. [Integración con el Compilador](#integración-con-el-compilador)

## Introducción

Aquí explico los componentes semánticos que hice para BabyDuck, como el cubo semántico, el directorio de funciones, la tabla de variables y el analizador semántico. Todos estos se usan para validar que el código tenga sentido, o sea que no solo esté bien escrito sino que haga lo que se supone.

El análisis semántico valida cosas como:

- Que las variables estén declaradas antes de usarse
- Que no haya nombres repetidos
- Que los tipos concuerden
- Que las funciones se llamen bien (con sus parámetros y todo eso)

---

## Cubo Semántico

El cubo semántico es como una tabla de compatibilidad de tipos. Yo lo hice como un `Map<string, DataType>` donde la clave es algo como `int+float` y el valor es el tipo resultante (`float` en ese caso).

### Tipos Soportados

```ts
enum DataType {
  INT = 'int',
  FLOAT = 'float',
  STRING = 'string',
  VOID = 'void',
  ERROR = 'error'
}
```

### Operadores Soportados

```ts
enum Operator {
  PLUS = '+',
  MINUS = '-',
  MULTIPLY = '*',
  DIVIDE = '/',
  GREATER_THAN = '>',
  LESS_THAN = '<',
  NOT_EQUALS = '!=',
  ASSIGN = '='
}
```

### Reglas Ejemplo

- `int + int = int`
- `int / int = float`
- `float + int = float`
- `int = float` ❌
- `float = int` ✅

Lo hice así porque usar `Map` es muy rápido y no necesitas hacer cientos de ifs para checar los tipos.

---

## Directorio de Funciones

Este directorio guarda todas las funciones con su nombre, tipo, parámetros y variables locales. Se implementó con otro `Map<string, Function>`.

```ts
interface Function {
  name: string;
  type: DataType;
  parameters: Variable[];
  variableTable: VariableTable;
  startAddress?: number;
}
```

Aquí puedes agregar funciones, buscar funciones, agregar parámetros, etc.

---

## Tabla de Variables

Cada función tiene su propia tabla de variables. Es un `Map<string, Variable>` y así no se repiten nombres dentro del mismo scope.

```ts
interface Variable {
  name: string;
  type: DataType;
  address?: number;
  isParameter?: boolean;
}
```

---

## Analizador Semántico

Este analizador revisa el CST y checa todo: tipos, existencia de variables, parámetros, etc. Lo hice para que trabaje en paralelo con el parser.

Tiene una lista de errores (`SemanticError[]`) y métodos como:

- `processVars()`
- `processAssign()`
- `processFunc()`
- `processExpression()`

```ts
interface SemanticError {
  message: string;
  line?: number;
  column?: number;
  type: 'error' | 'warning';
}
```

---

## Puntos Neurálgicos

Estos son los puntos clave donde se hacen validaciones:

- Declaración de variables y funciones
- Uso correcto de parámetros
- Tipos en expresiones y asignaciones
- Llamadas a funciones bien formadas

Ejemplo: si usas `x = "hola" + 5`, eso lanza un error porque `string + int` no tiene sentido.

---

## Validaciones Semánticas

Aquí unas validaciones que implementé con ejemplos:

1. **Variable doblemente declarada**:

```babyduck
var
  x: int;
  x: float;  // ❌ Error
```

2. **Función no declarada**:

```babyduck
main {
  resultado = sumar(5, 2);  // ❌ Error
}
```

3. **Tipos incompatibles en asignación**:

```babyduck
x: int;
y: float;

x = y; // ❌ Error
```

4. **Argumentos incorrectos**:

```babyduck
function sumar(a, b: int): int;

main {
  x = sumar(5); // ❌ Falta un argumento
}
```

---

## Manejo de Errores

El analizador junta todos los errores semánticos y te los muestra con mensaje, línea, y tipo de error. Ejemplos:

- `Variable no declarada: x`
- `Operación inválida: int + string`
- `Número incorrecto de argumentos`

Esto ayuda a debuggear tu código más fácil.

---

## Asignación de Memoria

Cada variable o función tiene un campo `address`. Esto lo uso para que al generar código sepamos en qué parte de memoria virtual se guarda.

```ts
interface Variable {
  name: string;
  address?: number;
}
```

---

## Integración con el Compilador

Los componentes semánticos se conectan con el parser y trabajan directamente con el CST generado. El proceso es así:

1. Lexer crea los tokens
2. Parser construye el CST
3. Analizador semántico valida
4. Se genera el código si no hay errores

Al hacerlo todo en un mismo flujo, el compilador es más rápido y encuentra errores más pronto.

---

# Estado Actual y Trabajo Futuro

## Componentes Implementados
- ✅ Analizador Léxico completo
- ✅ Analizador Sintáctico completo
- ✅ Analizador Semántico funcional
- ✅ Cubo Semántico para validación de tipos
- ✅ Directorio de Funciones y Tabla de Variables
- ✅ Detección de errores léxicos, sintácticos y semánticos

## En Desarrollo
- 🔄 Asignación de memoria virtual
- 🔄 Generación de código intermedio

