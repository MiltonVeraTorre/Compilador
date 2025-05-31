# Programas de Prueba para BabyDuck

Esta carpeta contiene programas de prueba escritos en el lenguaje BabyDuck para validar diferentes funcionalidades del compilador.

## Archivos de Prueba

### 1. `main.txt`
- **Descripción**: Programa principal simple que demuestra operaciones básicas
- **Características**: 
  - Declaración de variables
  - Asignaciones
  - Operaciones aritméticas
  - Instrucciones print

### 2. `fibonacci_main.txt`
- **Descripción**: Cálculo de la serie de Fibonacci implementado en el main
- **Características**:
  - Ciclo while en el programa principal
  - Operaciones aritméticas
  - Manejo de variables temporales
  - Secuencia de prints

### 3. `fibonacci_funcion.txt`
- **Descripción**: Cálculo de la serie de Fibonacci usando una función
- **Características**:
  - Definición de función con parámetros
  - Variables locales en función
  - Ciclo while dentro de función
  - Llamada a función desde main

### 4. `factorial_main.txt`
- **Descripción**: Cálculo de factorial implementado en el main
- **Características**:
  - Ciclo while para cálculo iterativo
  - Operaciones de multiplicación
  - Control de flujo con contador

### 5. `factorial_funcion.txt`
- **Descripción**: Cálculo de factorial usando una función
- **Características**:
  - Función con parámetro
  - Variables locales
  - Ciclo while en función
  - Paso de parámetros

### 6. `llamada_recursiva.txt`
- **Descripción**: Demostración de llamadas recursivas y múltiples funciones
- **Características**:
  - Función recursiva (contar_regresivo)
  - Múltiples definiciones de funciones
  - Condicionales (if)
  - Llamadas a función desde función

### 7. `while_main.txt`
- **Descripción**: Demostración de ciclos while en el programa principal
- **Características**:
  - Múltiples ciclos while
  - Diferentes tipos de contadores (ascendente y descendente)
  - Acumuladores
  - Operaciones dentro de ciclos

### 8. `while_funcion.txt`
- **Descripción**: Demostración de ciclos while dentro de funciones
- **Características**:
  - Múltiples funciones con ciclos while
  - Diferentes algoritmos (suma, tabla de multiplicar)
  - Variables locales en funciones
  - Llamadas múltiples a funciones

### 9. `programa_completo.txt`
- **Descripción**: Programa complejo que combina múltiples características
- **Características**:
  - Múltiples funciones
  - Condicionales y ciclos
  - Diferentes algoritmos
  - Estructura de menú
  - Combinación de todas las características del lenguaje

## Uso de los Archivos

Estos archivos pueden ser utilizados para:

1. **Pruebas del Lexer**: Verificar que todos los tokens se reconocen correctamente
2. **Pruebas del Parser**: Validar que la sintaxis es correcta según la gramática
3. **Pruebas Semánticas**: Verificar tipos, declaraciones y uso de variables
4. **Pruebas de Generación de Cuádruplos**: Validar la generación de código intermedio
5. **Pruebas de la Máquina Virtual**: Ejecutar los programas y verificar resultados

## Características Cubiertas

- ✅ Declaración de variables (int, float)
- ✅ Asignaciones
- ✅ Operaciones aritméticas (+, -, *, /)
- ✅ Operaciones relacionales (<, >, <=, >=, ==, !=)
- ✅ Estructuras de control (if-else)
- ✅ Ciclos (while)
- ✅ Funciones con parámetros
- ✅ Variables locales
- ✅ Llamadas a función
- ✅ Llamadas recursivas
- ✅ Instrucciones print
- ✅ Constantes enteras y de punto flotante

## Notas

- Todos los programas siguen la gramática oficial de BabyDuck
- Los programas están diseñados para ser progresivamente más complejos
- Cada archivo se enfoca en características específicas del lenguaje
- Los programas incluyen comentarios implícitos a través de los prints para facilitar el debugging
