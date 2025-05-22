# Estatutos de Control en BabyDuck

## Introducción

Los estatutos de control permiten modificar el flujo de ejecución de un programa. En BabyDuck, se han implementado dos tipos principales de estatutos de control:

1. **Estatutos Condicionales**: Permiten ejecutar código de manera condicional (if-else)
2. **Estatutos Cíclicos**: Permiten ejecutar código repetidamente mientras se cumpla una condición (while)

Este documento describe la implementación y el funcionamiento de los estatutos de control en el compilador BabyDuck.

## Estatutos Condicionales (if-else)

### Sintaxis

```babyduck
if (condición) {
  // Código a ejecutar si la condición es verdadera
} else {
  // Código a ejecutar si la condición es falsa (opcional)
};
```

### Puntos Neurálgicos

1. **Evaluación de la condición**: Se evalúa la condición y se genera un cuádruplo GOTOF (goto si falso) que saltará al bloque else o al final del if si la condición es falsa.
2. **Fin del bloque if**: Si hay un bloque else, se genera un cuádruplo GOTO para saltar al final del estatuto después de ejecutar el bloque if.
3. **Inicio del bloque else**: Se completa el cuádruplo GOTOF generado en el punto 1 para que salte aquí si la condición es falsa.
4. **Fin del estatuto**: Se completa el cuádruplo GOTO generado en el punto 2 para que salte aquí después de ejecutar el bloque if.

### Generación de Cuádruplos

Para el siguiente código:

```babyduck
if (x > 5) {
  y = 10;
} else {
  y = 20;
};
```

Los cuádruplos generados serían:

1. `(>, x, 5, t0)` - Evaluar x > 5 y guardar en t0
2. `(GOTOF, t0, _, ?)` - Si t0 es falso, saltar al bloque else (dirección por completar)
3. `(=, 10, _, y)` - Asignar 10 a y
4. `(GOTO, _, _, ?)` - Saltar al final del estatuto (dirección por completar)
5. `(=, 20, _, y)` - Asignar 20 a y (inicio del bloque else)

Después de completar las direcciones:

1. `(>, x, 5, t0)` - Evaluar x > 5 y guardar en t0
2. `(GOTOF, t0, _, 5)` - Si t0 es falso, saltar a la dirección 5 (inicio del bloque else)
3. `(=, 10, _, y)` - Asignar 10 a y
4. `(GOTO, _, _, 6)` - Saltar a la dirección 6 (fin del estatuto)
5. `(=, 20, _, y)` - Asignar 20 a y (inicio del bloque else)
6. `...` - Siguiente instrucción después del if-else

## Estatutos Cíclicos (while)

### Sintaxis

```babyduck
while (condición) do {
  // Código a ejecutar mientras la condición sea verdadera
};
```

### Puntos Neurálgicos

1. **Inicio del ciclo**: Se guarda la dirección actual para volver a evaluar la condición.
2. **Evaluación de la condición**: Se evalúa la condición y se genera un cuádruplo GOTOF (goto si falso) que saltará al final del ciclo si la condición es falsa.
3. **Fin del ciclo**: Se genera un cuádruplo GOTO para volver al inicio del ciclo y reevaluar la condición.
4. **Fin del estatuto**: Se completa el cuádruplo GOTOF generado en el punto 2 para que salte aquí si la condición es falsa.

### Generación de Cuádruplos

Para el siguiente código:

```babyduck
while (i < 5) do {
  i = i + 1;
};
```

Los cuádruplos generados serían:

1. `(<, i, 5, t0)` - Evaluar i < 5 y guardar en t0 (inicio del ciclo)
2. `(GOTOF, t0, _, ?)` - Si t0 es falso, saltar al final del ciclo (dirección por completar)
3. `(+, i, 1, t1)` - Sumar i + 1 y guardar en t1
4. `(=, t1, _, i)` - Asignar t1 a i
5. `(GOTO, _, _, 1)` - Volver a la dirección 1 (inicio del ciclo)

Después de completar las direcciones:

1. `(<, i, 5, t0)` - Evaluar i < 5 y guardar en t0 (inicio del ciclo)
2. `(GOTOF, t0, _, 6)` - Si t0 es falso, saltar a la dirección 6 (fin del ciclo)
3. `(+, i, 1, t1)` - Sumar i + 1 y guardar en t1
4. `(=, t1, _, i)` - Asignar t1 a i
5. `(GOTO, _, _, 1)` - Volver a la dirección 1 (inicio del ciclo)
6. `...` - Siguiente instrucción después del while

## Estatutos Anidados

Los estatutos de control pueden anidarse, es decir, un estatuto puede contener otros estatutos dentro de su bloque de código. El compilador maneja correctamente los saltos en estatutos anidados utilizando una pila de saltos.

### Ejemplo

```babyduck
while (i < 5) do {
  if (i > 2) {
    j = j + 1;
  };
  i = i + 1;
};
```

## Implementación

Los estatutos de control están implementados en el analizador semántico (`src/semantic/semantic-analyzer.ts`) a través de los siguientes métodos:

- `processCondition(conditionNode)`: Procesa un estatuto condicional (if-else)
- `processCycle(cycleNode)`: Procesa un estatuto cíclico (while)

Estos métodos utilizan el generador de cuádruplos para generar los cuádruplos necesarios para implementar los estatutos de control.

### Métodos del Generador de Cuádruplos

- `generateGotoQuadruple()`: Genera un cuádruplo GOTO (salto incondicional)
- `generateGotofQuadruple()`: Genera un cuádruplo GOTOF (salto si falso)
- `generateGototQuadruple()`: Genera un cuádruplo GOTOT (salto si verdadero)
- `fillJump(quadIndex, jumpTo)`: Completa un cuádruplo de salto con la dirección de destino
- `getNextQuadIndex()`: Obtiene el índice del siguiente cuádruplo

## Integración con la Memoria Virtual

Los estatutos de control utilizan direcciones virtuales para las variables y temporales involucrados en las condiciones y operaciones dentro de los bloques de código. Esto permite una ejecución más eficiente y facilita la implementación de optimizaciones.
