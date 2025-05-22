# Memoria Virtual en BabyDuck

## Introducción

La memoria virtual es un componente esencial del compilador BabyDuck que permite asignar y gestionar direcciones de memoria para variables, constantes y temporales durante la compilación. Este documento describe la implementación y el funcionamiento de la memoria virtual en el compilador.

## Esquema de Direcciones Virtuales

El esquema de direcciones virtuales en BabyDuck divide la memoria en cuatro segmentos principales:

1. **Global**: Para variables globales (accesibles desde cualquier parte del programa)
2. **Local**: Para variables locales (accesibles solo dentro de una función)
3. **Temporal**: Para variables temporales generadas durante la compilación
4. **Constante**: Para valores constantes (literales) utilizados en el programa

Cada segmento se divide a su vez en secciones para cada tipo de dato:

1. **Int**: Para enteros
2. **Float**: Para números de punto flotante
3. **String**: Para cadenas de texto

### Rangos de Direcciones

Los rangos de direcciones para cada segmento y tipo son los siguientes:

| Segmento  | Tipo   | Rango de Direcciones |
|-----------|--------|----------------------|
| Global    | Int    | 1000 - 1999          |
| Global    | Float  | 2000 - 2999          |
| Global    | String | 3000 - 3999          |
| Local     | Int    | 5000 - 5999          |
| Local     | Float  | 6000 - 6999          |
| Local     | String | 7000 - 7999          |
| Temporal  | Int    | 9000 - 9999          |
| Temporal  | Float  | 10000 - 10999        |
| Temporal  | String | 11000 - 11999        |
| Constante | Int    | 13000 - 13999        |
| Constante | Float  | 14000 - 14999        |
| Constante | String | 15000 - 15999        |

## Funcionamiento

### Asignación de Direcciones

La memoria virtual asigna direcciones de la siguiente manera:

1. **Variables**: Se asignan direcciones consecutivas dentro del segmento correspondiente (global o local) según su tipo.
2. **Constantes**: Se asignan direcciones en el segmento de constantes según su tipo. Las constantes repetidas reutilizan la misma dirección.
3. **Temporales**: Se asignan direcciones en el segmento temporal según su tipo.

### Ejemplo de Asignación

Para el siguiente código:

```babyduck
program ejemplo;
var
  x: int;
  y: float;

main {
  x = 5;
  y = 3.14;
  x = x + 1;
}
end
```

La asignación de direcciones sería:

- `x` (variable global int): 1000
- `y` (variable global float): 2000
- `5` (constante int): 13000
- `3.14` (constante float): 14000
- `1` (constante int): 13001
- `t0` (temporal int para x + 1): 9000

### Cuádruplos con Direcciones Virtuales

Los cuádruplos generados utilizan direcciones virtuales en lugar de nombres de variables:

1. `(=, 13000, _, 1000)` - Asignar 5 a x
2. `(=, 14000, _, 2000)` - Asignar 3.14 a y
3. `(+, 1000, 13001, 9000)` - Sumar x + 1 y guardar en t0
4. `(=, 9000, _, 1000)` - Asignar t0 a x

## Ventajas

1. **Eficiencia**: Las direcciones virtuales permiten acceder a las variables de manera más eficiente durante la ejecución.
2. **Abstracción**: Proporcionan una capa de abstracción sobre la memoria física.
3. **Optimización**: Facilitan la implementación de optimizaciones de código.

## Implementación

La memoria virtual está implementada en el archivo `src/memory/virtual-memory.ts` y consta de las siguientes clases y enumeraciones:

- `MemorySegment`: Enumeración de los segmentos de memoria (GLOBAL, LOCAL, TEMPORAL, CONSTANT)
- `MEMORY_RANGES`: Constante que define los rangos de direcciones para cada segmento y tipo
- `VirtualMemory`: Clase que gestiona la asignación de direcciones virtuales

### Métodos Principales

- `assignAddress(type, segment)`: Asigna una dirección para una variable del tipo y segmento especificados
- `assignConstantAddress(value, type)`: Asigna una dirección para una constante
- `assignTempAddress(type)`: Asigna una dirección para una variable temporal
- `getTypeFromAddress(address)`: Obtiene el tipo de dato a partir de una dirección
- `getSegmentFromAddress(address)`: Obtiene el segmento a partir de una dirección
- `reset()`: Reinicia los contadores de direcciones

## Integración con el Compilador

La memoria virtual se integra con el compilador a través del generador de cuádruplos, que utiliza las direcciones virtuales en lugar de nombres de variables en los cuádruplos generados.
