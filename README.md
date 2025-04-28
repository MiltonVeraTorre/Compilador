# Compilador BabyDuck

Un proyecto de compilador para el lenguaje BabyDuck construido con TypeScript y Chevrotain. Este compilador implementa un lexer y un parser para el lenguaje BabyDuck.

## Descripción del Proyecto

El compilador BabyDuck es una implementación de un compilador para un lenguaje de programación simple. El proyecto usa los siguientes conceptos:

- Análisis léxico
- Análisis sintáctic
- Construcción de árboles de sintaxis
- Manejo de errores léxicos y sintácticos

## El Lenguaje BabyDuck

BabyDuck es un lenguaje de programación simple con las siguientes características:

- Declaración de variables con tipos
- Funciones con parámetros
- Estructuras de control
- Operaciones aritméticas y lógicas
- Impresión de valores

Ejemplo de un programa en BabyDuck:

```
program example;
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

### Estructura

- `src/` - Código fuente del compilador
  - `lexer/` - Analizador léxico
    - `lexer.ts` - Implementación del analizador léxico
    - `tokens.ts` - Definición de tokens del lenguaje
  - `parser/` - Analizador sintáctico
    - `parser.ts` - Implementación del analizador sintáctico
    - `grammar.ts` - Definición de la gramática BabyDuck
    - `ast.ts` - Definiciones para el Árbol de Sintaxis Abstracta
  - `index.ts` - Punto de entrada principal que integra lexer y parser
  - `index.test.ts` - Pruebas para el analizador
  - `example.ts` - Ejemplo de uso del compilador

### Componentes Principales

#### Lexer

El analizador léxico se encarga de convertir el código fuente en una secuencia de tokens. Cada token representa una unidad léxica del lenguaje como palabras clave, identificadores, operadores, etc.Usamos Chevrotain para definir los tokens mediante expresiones regulares y manejar la tokenización del código fuente.

#### Parser

El analizador sintáctico toma la secuencia de tokens generada por el lexer y verifica si cumple con la gramática. Si el código es sintácticamente correcto, construye un Árbol de Sintaxis Concreto(CST).

La gramática está implementada utilizando el patrón de diseño "Recursive Descent Parser" usa top-down.

## Flujo de Compilación

El proceso de compilación sigue estos pasos:

1. **Análisis Léxico**: El código fuente se convierte en tokens mediante el analizador léxico.
2. **Análisis Sintáctico**: Los tokens se analizan para verificar si cumplen con la gramática del lenguaje.
3. **Construcción del CST**: Si el análisis sintáctico es exitoso, se construye un Árbol de Sintaxis Concreto.

## Tecnologías Utilizadas

- **TypeScript**: Lenguaje de programación tipado que extiende JavaScript
- **Chevrotain**: Kit de herramientas para construir analizadores léxicos y sintácticos
- **Jest**: Framework de pruebas para JavaScript/TypeScript
- **Node.js**: Entorno de ejecución para JavaScript