# Bitácora de Problemas - Compilador BabyDuck

## Problema: Programa se queda colgado en bucle infinito

**Fecha:** 31 de Mayo, 2025
**Severidad:** Crítica
**Estado:** ✅ Resuelto

### Descripción del Problema

El compilador BabyDuck se quedaba colgado al ejecutar programas que contenían:
1. Funciones simples (se ejecutaban dos veces)
2. Funciones con bucles `while` (bucle infinito)

### Síntomas Observados

```
🔍 Programa de prueba con while en funciones:
- Compilación exitosa ✓
- Generación de cuádruplos correcta ✓
- Ejecución se cuelga después de mostrar cuádruplos ❌
```

**Comportamiento específico:**
- Funciones simples: Se ejecutaban correctamente pero luego se repetían con parámetros `undefined`
- Funciones con while: El programa nunca terminaba, requería timeout/kill

### Análisis de Causa Raíz

#### 1. Problema Principal: Falta de cuádruple HALT
- **Causa:** No había instrucción de terminación al final del programa principal
- **Efecto:** Después del main, la ejecución continuaba con los cuádruplos de las funciones

#### 2. Orden incorrecto de cuádruplos
```
Orden problemático:
0-4: Main program
5-7: Función (se ejecutaba accidentalmente)

Orden correcto:
0-4: Main program
5: HALT (termina ejecución)
6-8: Función (solo se ejecuta cuando se llama)
```

#### 3. Gestión de contextos de activación
- **GOSUB:** Establecía returnAddress correctamente
- **ENDPROC:** Regresaba correctamente al main
- **Problema:** Después del retorno, no había terminación explícita

### Proceso de Debugging

#### Herramientas utilizadas:
1. **Scripts de debug personalizados** para rastrear ejecución paso a paso
2. **Logging en GOSUB/ENDPROC** para verificar direcciones de retorno
3. **Análisis de cuádruplos** para entender el flujo de ejecución
4. **Tests incrementales** (while simple → función simple → función con while)

#### Técnicas de aislamiento:
```typescript
// Test progresivo para aislar el problema
1. while simple en main → ✅ Funciona
2. función simple sin while → ❌ Se ejecuta dos veces
3. función con while → ❌ Bucle infinito
```

### Solución Implementada

#### 1. Agregado de operador HALT
```typescript
// src/quadruples/quadruple.ts
export enum QuadrupleOperator {
  // ... otros operadores
  HALT = 'halt', // terminar programa
}
```

#### 2. Generación de cuádruple HALT
```typescript
// src/quadruples/quadruple-generator.ts
public generateHaltQuadruple(): void {
  const quadruple = createQuadruple(
    QuadrupleOperator.HALT,
    null, null, null
  );
  this.quadruples.enqueue(quadruple);
}
```

#### 3. Ejecución de HALT en VM
```typescript
// src/virtual-machine/virtual-machine.ts
private executeHalt(_quad: Quadruple): void {
  this.running = false;
}
```

#### 4. Integración en el parser
```typescript
// src/parser/parser.ts
// Después de procesar el main:
semanticAnalyzer.generateHaltQuadruple();
```

### Resultados Post-Solución

#### Antes:
```
📤 Salida problemática:
El valor es
42
Terminado
El valor es        ← Ejecución duplicada
undefined          ← Parámetro corrupto
```

#### Después:
```
📤 Salida correcta:
Ejecutando suma hasta 15
Sumando hasta
15
Suma total
120
Ejecutando tabla de multiplicar
[... tabla completa del 7 ...]
While en funciones completado
```

### Lecciones Aprendidas

#### 1. **Importancia de la terminación explícita**
- Los programas necesitan instrucciones explícitas de terminación
- No se puede asumir que la ejecución se detiene automáticamente

#### 2. **Orden de cuádruplos crítico**
- El orden de generación afecta directamente la ejecución
- Las funciones deben estar después de la terminación del main

#### 3. **Debug incremental es clave**
- Aislar problemas con casos simples antes de casos complejos
- Usar logging específico en puntos críticos (GOSUB/ENDPROC)

#### 4. **Gestión de contextos de activación**
- Los contextos funcionaban correctamente
- El problema no estaba en la pila de activación sino en el flujo general

#### 5. **Herramientas de debug personalizadas**
- Scripts específicos para rastrear ejecución paso a paso
- Timeouts para detectar bucles infinitos
- Logging detallado en operaciones críticas

### Prevención Futura

#### 1. **Tests de regresión**
```typescript
// Agregar tests específicos para:
- Funciones simples (no duplicación)
- Funciones con while (terminación correcta)
- Múltiples llamadas a funciones
- Funciones recursivas
```

#### 2. **Validaciones en tiempo de compilación**
- Verificar que cada programa tenga terminación explícita
- Validar orden correcto de cuádruplos

#### 3. **Mejores herramientas de debug**
- Integrar logging opcional en la VM
- Crear visualizador de flujo de cuádruplos
- Detector automático de bucles infinitos

### Archivos Modificados

```
src/quadruples/quadruple.ts          ← Agregado HALT operator
src/quadruples/quadruple-generator.ts ← Método generateHaltQuadruple()
src/semantic/semantic-analyzer.ts    ← Wrapper para HALT
src/parser/parser.ts                 ← Generación de HALT en main
src/virtual-machine/virtual-machine.ts ← Ejecución de HALT
```

### Impacto

- ✅ **Funcionalidad:** Programas con funciones y while loops funcionan correctamente
- ✅ **Estabilidad:** No más bucles infinitos o ejecuciones duplicadas
- ✅ **Confiabilidad:** Terminación predecible y controlada
- ✅ **Debugging:** Mejor visibilidad del flujo de ejecución

---

**Nota:** Este problema destacó la importancia de tener un flujo de control explícito y bien definido en el diseño de compiladores. La solución no solo arregló el problema inmediato sino que mejoró la arquitectura general del sistema.

---

## Problema: Llamadas recursivas no funcionan correctamente

**Fecha:** 31 de Mayo, 2025
**Severidad:** Alta
**Estado:** ✅ Resuelto

### Descripción del Problema

Las llamadas recursivas en el compilador BabyDuck no funcionaban correctamente, causando que los parámetros se convirtieran en `NaN` o `undefined` durante la recursión.

### Síntomas Observados

```
🔍 Programa recursivo de prueba:
void contar_regresivo(n: int) [
  {
    print("Contando:");
    print(n);
    if (n > 0) {
      contar_regresivo(n - 1);  // ← Problema aquí
    };
    print("Regresando de:");
    print(n);
  }
];
```

**Comportamiento problemático:**
```
📤 Salida incorrecta:
Contando: 5
Contando: NaN      ← Debería ser 4
Regresando de: NaN
Regresando de: 5
```

**Comportamiento esperado:**
```
📤 Salida correcta:
Contando: 5
Contando: 4
Contando: 3
Contando: 2
Contando: 1
Contando: 0
Regresando de: 0
Regresando de: 1
Regresando de: 2
Regresando de: 3
Regresando de: 4
Regresando de: 5
```

### Análisis de Causa Raíz

#### 1. Problema Principal: Orden incorrecto de cuádruplos

**Orden problemático:**
```
9: (era, 2, _, _)           ← Crea nuevo contexto
10: (-, 5000, 13001, 9001)  ← Lee n del contexto NUEVO (vacío)
11: (param, 9001, 0, _)     ← Pasa NaN como parámetro
12: (gosub, 5, _, _)        ← Llama función
```

**Problema:** La expresión `n - 1` se evaluaba DESPUÉS de crear el nuevo contexto de activación, leyendo `n` del contexto incorrecto.

#### 2. Problema Secundario: Contextos no aislados

Los parámetros se almacenaban en direcciones globales (5000, 5001, etc.) que se sobrescribían entre llamadas recursivas, en lugar de usar el contexto de activación específico.

### Proceso de Debugging

#### Herramientas utilizadas:
1. **Análisis de cuádruplos** para identificar el orden incorrecto
2. **Programa de prueba simplificado** para aislar el problema
3. **Logging de contextos de activación** para verificar aislamiento
4. **Tests progresivos** (simple → recursivo → múltiples parámetros)

#### Técnicas de aislamiento:
```typescript
// Test progresivo para identificar el problema
1. Función simple con parámetro → ✅ Funciona
2. Función recursiva simple → ❌ n = NaN en segunda llamada
3. Función con múltiples parámetros → ❌ Parámetros mezclados
```

### Solución Implementada

#### 1. Reordenamiento de cuádruplos en llamadas a función

**Antes (problemático):**
```typescript
// src/semantic/semantic-analyzer.ts - processFunctionCall()
quadrupleGenerator.generateEraQuadruple(funcName);     // 1. ERA
this.processArgList(argListNode, func.parameters);    // 2. Evaluar expresiones
quadrupleGenerator.generateGosubQuadruple(funcName);  // 3. GOSUB
```

**Después (correcto):**
```typescript
// PRIMERO: Evaluar expresiones ANTES de crear contexto
this.processArgList(argListNode, func.parameters);    // 1. Evaluar expresiones
quadrupleGenerator.generateEraQuadruple(funcName);     // 2. ERA
this.generateParamQuadruples(func.parameters.length); // 3. PARAM
quadrupleGenerator.generateGosubQuadruple(funcName);  // 4. GOSUB
```

#### 2. Separación de evaluación y generación de PARAM

**Modificación de processArgList:**
```typescript
// Antes: Evaluaba expresiones Y generaba PARAM
public processArgList(argListNode: ArgListCstNode, parameters: Variable[]) {
  for (let i = 0; i < expressions.length; i++) {
    this.processExpression(expressions[i]);
    // ...
    quadrupleGenerator.generateParamQuadruple(i); // ← Problema
  }
}

// Después: Solo evalúa expresiones
public processArgList(argListNode: ArgListCstNode, parameters: Variable[]) {
  for (let i = 0; i < expressions.length; i++) {
    this.processExpression(expressions[i]);
    // ... validaciones de tipos
    // NO generar PARAM aquí
  }
}

// Nuevo método para generar PARAM después del ERA
public generateParamQuadruples(paramCount: number) {
  for (let i = paramCount - 1; i >= 0; i--) {
    quadrupleGenerator.generateParamQuadruple(i);
  }
}
```

#### 3. Aislamiento de contextos de activación

**Modificación de executeParam:**
```typescript
// Antes: Escribía a direcciones globales
private executeParam(quad: Quadruple): void {
  const paramAddress = 5000 + paramIndex;
  this.memory.setValue(paramAddress, paramValue); // ← Problema
}

// Después: Usa contexto de activación específico
private executeParam(quad: Quadruple): void {
  const paramAddress = 5000 + paramIndex;
  const context = this.memory.getCurrentActivationContext();
  if (context) {
    context.parameterMemory.set(paramAddress, paramValue); // ← Aislado
  } else {
    this.memory.setValue(paramAddress, paramValue);
  }
}
```

#### 4. Corrección de ENDPROC para recursión

```typescript
// Antes: Solo terminaba ejecución
private executeEndproc(_quad: Quadruple): void {
  this.running = false; // ← Problema para recursión
}

// Después: Maneja contextos correctamente
private executeEndproc(_quad: Quadruple): void {
  const context = this.memory.getCurrentActivationContext();
  if (context) {
    const returnAddress = this.memory.popActivationContext();
    if (returnAddress !== undefined) {
      this.instructionPointer = returnAddress - 1; // ← Regresa al contexto anterior
    } else {
      this.running = false;
    }
  } else {
    this.running = false; // ← Solo para programa principal
  }
}
```

### Resultados Post-Solución

#### Cuádruplos corregidos:
```
Orden correcto:
9: (-, 5000, 13002, 9001)   ← Lee n del contexto ACTUAL
10: (era, 2, _, _)          ← Crea nuevo contexto
11: (param, 9001, 0, _)     ← Pasa valor correcto
12: (gosub, 5, _, _)        ← Llama función
```

#### Salida correcta:
```
📤 Recursión funcionando:
Contando: 3
Contando: 2
Contando: 1
Contando: 0
Regresando de: 0
Regresando de: 1
Regresando de: 2
Regresando de: 3

Calculando 2^4
Resultado de potencia: 16
```

### Lecciones Aprendidas

#### 1. **Orden de evaluación crítico en recursión**
- Las expresiones de argumentos deben evaluarse ANTES de crear nuevos contextos
- El contexto actual debe estar disponible durante la evaluación

#### 2. **Aislamiento de contextos esencial**
- Cada llamada recursiva necesita su propio espacio de parámetros
- Los contextos de activación deben estar completamente aislados

#### 3. **Separación de responsabilidades**
- Evaluación de expresiones vs. generación de cuádruplos
- Cada fase debe tener responsabilidades claras y separadas

#### 4. **Gestión correcta de pila de activación**
- ENDPROC debe manejar tanto recursión como terminación de programa
- Los contextos deben eliminarse en el orden correcto

### Prevención Futura

#### 1. **Tests de recursión específicos**
```typescript
// Agregar tests para:
- Recursión simple (countdown)
- Recursión con múltiples parámetros
- Recursión con variables locales
- Recursión anidada (función A llama B que llama A)
```

#### 2. **Validaciones de contexto**
- Verificar que los parámetros se lean del contexto correcto
- Validar aislamiento entre llamadas recursivas

#### 3. **Herramientas de debug mejoradas**
- Visualizador de pila de contextos de activación
- Rastreador de parámetros por contexto
- Detector de contextos mal aislados

### Archivos Modificados

```
src/semantic/semantic-analyzer.ts    ← Reordenamiento de cuádruplos
src/virtual-machine/virtual-machine.ts ← executeParam y executeEndproc
src/memory/virtual-memory.ts        ← Nuevo segmento PARAMETER
src/virtual-machine/execution-memory.ts ← Manejo de segmento PARAMETER
```

### Impacto

- ✅ **Recursión:** Llamadas recursivas funcionan correctamente
- ✅ **Aislamiento:** Cada contexto mantiene sus propios parámetros
- ✅ **Múltiples parámetros:** Funciones con varios argumentos funcionan
- ✅ **Variables locales:** Aislamiento correcto en recursión
- ✅ **Expresiones complejas:** `n - 1`, operaciones aritméticas en argumentos

---

**Nota:** Este problema demostró la importancia del orden correcto en la generación de cuádruplos y el aislamiento adecuado de contextos de activación para soportar recursión. La solución mejoró significativamente la robustez del manejo de funciones en el compilador.
