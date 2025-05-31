# 🐛 Guía de Debug para VSCode - Compilador BabyDuck

## ✅ Configuración Completada

Se ha configurado completamente el entorno de debug para VSCode con las siguientes mejoras:

### 📁 Archivos Configurados:
- `.vscode/launch.json` - Configuraciones de debug
- `.vscode/tasks.json` - Tareas de build
- `.vscode/settings.json` - Configuraciones del editor
- `tsconfig.json` - Sourcemaps habilitados
- `src/debug-test.ts` - Archivo de prueba para debug

## 🚀 Configuraciones de Debug Disponibles

### 1. **Debug Current TypeScript File** ⭐ (Recomendado)
- Debuggea el archivo TypeScript que tengas abierto
- **Uso**: Abre cualquier archivo `.ts` y presiona `F5`

### 2. **Debug test.ts**
- Debuggea específicamente tu archivo `src/test.ts`
- **Uso**: Selecciona esta configuración y presiona `F5`

### 3. **Debug with ts-node (Alternative)**
- Método alternativo usando ts-node register
- **Uso**: Si la configuración principal no funciona

### 4. **Debug Jest Tests**
- Debuggea todas las pruebas de Jest
- **Uso**: Para debuggear tests unitarios

### 5. **Debug Jest Current File**
- Debuggea solo las pruebas del archivo actual
- **Uso**: Abre un archivo `.test.ts` y usa esta configuración

### 6. **Debug Compiled JavaScript**
- Debuggea el JavaScript compilado con sourcemaps
- **Uso**: Compila primero, luego debuggea

## 🔧 Cómo Usar el Debug

### **Método Rápido (Recomendado):**
1. Abre `src/debug-test.ts` (archivo creado para pruebas)
2. Pon breakpoints en las líneas que quieras (click en el margen izquierdo)
3. Presiona `F5` - automáticamente usará "Debug Current TypeScript File"
4. ¡El debugger se detendrá en tus breakpoints!

### **Método Manual:**
1. Abre el archivo que quieras debuggear
2. Pon breakpoints (click en el margen izquierdo del editor)
3. Ve a "Run and Debug" (`Ctrl+Shift+D`)
4. Selecciona la configuración deseada
5. Presiona el botón de play ▶️ o `F5`

## 🎯 Puntos de Breakpoint Recomendados

### En `src/debug-test.ts`:
- **Línea 23**: `const result = parseInput(simpleProgram);`
- **Línea 35**: Antes de mostrar los cuádruplos
- **Línea 37**: Dentro del loop de cuádruplos

### En `src/test.ts`:
- **Línea 42**: `const result = parseInput(input);`
- **Línea 56**: `const vm = new VirtualMachine();`
- **Línea 58**: `const output = vm.execute();`

## 🔍 Características del Debug

### ✅ **Sourcemaps Habilitados**
- Los breakpoints aparecen exactamente donde los pones
- Puedes debuggear directamente en TypeScript
- Variables y stack traces muestran código TypeScript

### ✅ **Auto-restart**
- El debugger se reinicia automáticamente si hay cambios

### ✅ **Console Integrada**
- Todo el output aparece en la terminal integrada de VSCode

### ✅ **Skip Node Internals**
- No se detiene en código interno de Node.js o node_modules

## 🛠️ Solución de Problemas

### **Si los breakpoints no se alinean correctamente:**
1. Asegúrate de que el proyecto esté compilado: `npm run build`
2. Verifica que existan archivos `.js.map` en la carpeta `dist/`
3. Usa la configuración "Debug with ts-node (Alternative)"

### **Si el debug no inicia:**
1. Verifica que `ts-node` esté instalado: `npm list ts-node`
2. Compila el proyecto: `npm run build`
3. Reinicia VSCode

### **Para debuggear tests:**
1. Usa "Debug Jest Current File" para un archivo específico
2. Usa "Debug Jest Tests" para todos los tests

## 🎮 Controles de Debug

- **F5**: Iniciar/Continuar debug
- **F10**: Step Over (siguiente línea)
- **F11**: Step Into (entrar en función)
- **Shift+F11**: Step Out (salir de función)
- **Ctrl+Shift+F5**: Reiniciar debug
- **Shift+F5**: Detener debug

## 📝 Ejemplo de Uso

1. Abre `src/debug-test.ts`
2. Pon un breakpoint en la línea 23: `const result = parseInput(simpleProgram);`
3. Presiona `F5`
4. Cuando se detenga, inspecciona la variable `simpleProgram`
5. Presiona `F10` para avanzar línea por línea
6. Inspecciona la variable `result` después de la compilación

¡Ya puedes debuggear tu compilador BabyDuck como un profesional! 🎉
