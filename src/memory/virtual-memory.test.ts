import { DataType } from '../semantic/semantic-cube';
import { VirtualMemory, MemorySegment, MEMORY_RANGES } from './virtual-memory';

describe('Memoria Virtual', () => {
  let memory: VirtualMemory;

  beforeEach(() => {
    memory = new VirtualMemory();
  });

  test('debe asignar direcciones correctas para variables', () => {
    // Asignar direcciones para variables globales
    const globalIntAddress = memory.assignAddress(DataType.INT, MemorySegment.GLOBAL);
    const globalFloatAddress = memory.assignAddress(DataType.FLOAT, MemorySegment.GLOBAL);
    const globalStringAddress = memory.assignAddress(DataType.STRING, MemorySegment.GLOBAL);

    // Verificar que las direcciones están en los rangos correctos
    expect(globalIntAddress).toBeGreaterThanOrEqual(MEMORY_RANGES[MemorySegment.GLOBAL][DataType.INT]?.start || 1000);
    expect(globalIntAddress).toBeLessThanOrEqual(MEMORY_RANGES[MemorySegment.GLOBAL][DataType.INT]?.end || 1999);

    expect(globalFloatAddress).toBeGreaterThanOrEqual(MEMORY_RANGES[MemorySegment.GLOBAL][DataType.FLOAT]?.start || 2000);
    expect(globalFloatAddress).toBeLessThanOrEqual(MEMORY_RANGES[MemorySegment.GLOBAL][DataType.FLOAT]?.end || 2999);

    expect(globalStringAddress).toBeGreaterThanOrEqual(MEMORY_RANGES[MemorySegment.GLOBAL][DataType.STRING]?.start || 3000);
    expect(globalStringAddress).toBeLessThanOrEqual(MEMORY_RANGES[MemorySegment.GLOBAL][DataType.STRING]?.end || 3999);

    // Asignar direcciones para variables locales
    const localIntAddress = memory.assignAddress(DataType.INT, MemorySegment.LOCAL);
    const localFloatAddress = memory.assignAddress(DataType.FLOAT, MemorySegment.LOCAL);
    const localStringAddress = memory.assignAddress(DataType.STRING, MemorySegment.LOCAL);

    // Verificar que las direcciones están en los rangos correctos
    expect(localIntAddress).toBeGreaterThanOrEqual(MEMORY_RANGES[MemorySegment.LOCAL][DataType.INT]?.start || 5000);
    expect(localIntAddress).toBeLessThanOrEqual(MEMORY_RANGES[MemorySegment.LOCAL][DataType.INT]?.end || 5999);

    expect(localFloatAddress).toBeGreaterThanOrEqual(MEMORY_RANGES[MemorySegment.LOCAL][DataType.FLOAT]?.start || 6000);
    expect(localFloatAddress).toBeLessThanOrEqual(MEMORY_RANGES[MemorySegment.LOCAL][DataType.FLOAT]?.end || 6999);

    expect(localStringAddress).toBeGreaterThanOrEqual(MEMORY_RANGES[MemorySegment.LOCAL][DataType.STRING]?.start || 7000);
    expect(localStringAddress).toBeLessThanOrEqual(MEMORY_RANGES[MemorySegment.LOCAL][DataType.STRING]?.end || 7999);
  });

  test('debe asignar direcciones consecutivas para variables del mismo tipo', () => {
    // Asignar direcciones para variables globales del mismo tipo
    const globalInt1 = memory.assignAddress(DataType.INT, MemorySegment.GLOBAL);
    const globalInt2 = memory.assignAddress(DataType.INT, MemorySegment.GLOBAL);
    const globalInt3 = memory.assignAddress(DataType.INT, MemorySegment.GLOBAL);

    // Verificar que las direcciones son consecutivas
    expect(globalInt2).toBe(globalInt1 + 1);
    expect(globalInt3).toBe(globalInt2 + 1);

    // Asignar direcciones para variables locales del mismo tipo
    const localFloat1 = memory.assignAddress(DataType.FLOAT, MemorySegment.LOCAL);
    const localFloat2 = memory.assignAddress(DataType.FLOAT, MemorySegment.LOCAL);
    const localFloat3 = memory.assignAddress(DataType.FLOAT, MemorySegment.LOCAL);

    // Verificar que las direcciones son consecutivas
    expect(localFloat2).toBe(localFloat1 + 1);
    expect(localFloat3).toBe(localFloat2 + 1);
  });

  test('debe asignar direcciones para constantes', () => {
    // Asignar direcciones para constantes
    const intConstant1 = memory.assignConstantAddress(5, DataType.INT);
    const intConstant2 = memory.assignConstantAddress(10, DataType.INT);
    const floatConstant = memory.assignConstantAddress(3.14, DataType.FLOAT);
    const stringConstant = memory.assignConstantAddress("hello", DataType.STRING);

    // Verificar que las direcciones están en los rangos correctos
    expect(intConstant1).toBeGreaterThanOrEqual(MEMORY_RANGES[MemorySegment.CONSTANT][DataType.INT]?.start || 13000);
    expect(intConstant1).toBeLessThanOrEqual(MEMORY_RANGES[MemorySegment.CONSTANT][DataType.INT]?.end || 13999);

    expect(intConstant2).toBeGreaterThanOrEqual(MEMORY_RANGES[MemorySegment.CONSTANT][DataType.INT]?.start || 13000);
    expect(intConstant2).toBeLessThanOrEqual(MEMORY_RANGES[MemorySegment.CONSTANT][DataType.INT]?.end || 13999);

    expect(floatConstant).toBeGreaterThanOrEqual(MEMORY_RANGES[MemorySegment.CONSTANT][DataType.FLOAT]?.start || 14000);
    expect(floatConstant).toBeLessThanOrEqual(MEMORY_RANGES[MemorySegment.CONSTANT][DataType.FLOAT]?.end || 14999);

    expect(stringConstant).toBeGreaterThanOrEqual(MEMORY_RANGES[MemorySegment.CONSTANT][DataType.STRING]?.start || 15000);
    expect(stringConstant).toBeLessThanOrEqual(MEMORY_RANGES[MemorySegment.CONSTANT][DataType.STRING]?.end || 15999);
  });

  test('debe reutilizar direcciones para constantes repetidas', () => {
    // Asignar direcciones para constantes
    const intConstant1 = memory.assignConstantAddress(5, DataType.INT);
    const intConstant2 = memory.assignConstantAddress(5, DataType.INT); // Mismo valor
    const floatConstant1 = memory.assignConstantAddress(3.14, DataType.FLOAT);
    const floatConstant2 = memory.assignConstantAddress(3.14, DataType.FLOAT); // Mismo valor

    // Verificar que las direcciones son las mismas para constantes repetidas
    expect(intConstant2).toBe(intConstant1);
    expect(floatConstant2).toBe(floatConstant1);
  });

  test('debe asignar direcciones para temporales', () => {
    // Asignar direcciones para temporales
    const tempInt = memory.assignTempAddress(DataType.INT);
    const tempFloat = memory.assignTempAddress(DataType.FLOAT);
    const tempString = memory.assignTempAddress(DataType.STRING);

    // Verificar que las direcciones están en los rangos correctos
    expect(tempInt).toBeGreaterThanOrEqual(MEMORY_RANGES[MemorySegment.TEMPORAL][DataType.INT]?.start || 9000);
    expect(tempInt).toBeLessThanOrEqual(MEMORY_RANGES[MemorySegment.TEMPORAL][DataType.INT]?.end || 9999);

    expect(tempFloat).toBeGreaterThanOrEqual(MEMORY_RANGES[MemorySegment.TEMPORAL][DataType.FLOAT]?.start || 10000);
    expect(tempFloat).toBeLessThanOrEqual(MEMORY_RANGES[MemorySegment.TEMPORAL][DataType.FLOAT]?.end || 10999);

    expect(tempString).toBeGreaterThanOrEqual(MEMORY_RANGES[MemorySegment.TEMPORAL][DataType.STRING]?.start || 11000);
    expect(tempString).toBeLessThanOrEqual(MEMORY_RANGES[MemorySegment.TEMPORAL][DataType.STRING]?.end || 11999);
  });

  test('debe obtener el tipo correcto a partir de una dirección', () => {
    // Asignar direcciones
    const globalIntAddress = memory.assignAddress(DataType.INT, MemorySegment.GLOBAL);
    const localFloatAddress = memory.assignAddress(DataType.FLOAT, MemorySegment.LOCAL);
    const tempStringAddress = memory.assignTempAddress(DataType.STRING);
    const constIntAddress = memory.assignConstantAddress(5, DataType.INT);

    // Verificar que se obtiene el tipo correcto
    expect(memory.getTypeFromAddress(globalIntAddress)).toBe(DataType.INT);
    expect(memory.getTypeFromAddress(localFloatAddress)).toBe(DataType.FLOAT);
    expect(memory.getTypeFromAddress(tempStringAddress)).toBe(DataType.STRING);
    expect(memory.getTypeFromAddress(constIntAddress)).toBe(DataType.INT);
  });

  test('debe obtener el segmento correcto a partir de una dirección', () => {
    // Asignar direcciones
    const globalIntAddress = memory.assignAddress(DataType.INT, MemorySegment.GLOBAL);
    const localFloatAddress = memory.assignAddress(DataType.FLOAT, MemorySegment.LOCAL);
    const tempStringAddress = memory.assignTempAddress(DataType.STRING);
    const constIntAddress = memory.assignConstantAddress(5, DataType.INT);

    // Verificar que se obtiene el segmento correcto
    expect(memory.getSegmentFromAddress(globalIntAddress)).toBe(MemorySegment.GLOBAL);
    expect(memory.getSegmentFromAddress(localFloatAddress)).toBe(MemorySegment.LOCAL);
    expect(memory.getSegmentFromAddress(tempStringAddress)).toBe(MemorySegment.TEMPORAL);
    expect(memory.getSegmentFromAddress(constIntAddress)).toBe(MemorySegment.CONSTANT);
  });

  test('debe reiniciar los contadores correctamente', () => {
    // Asignar algunas direcciones
    memory.assignAddress(DataType.INT, MemorySegment.GLOBAL);
    memory.assignAddress(DataType.FLOAT, MemorySegment.LOCAL);
    memory.assignTempAddress(DataType.STRING);
    memory.assignConstantAddress(5, DataType.INT);

    // Reiniciar los contadores
    memory.reset();

    // Verificar que las nuevas direcciones son las iniciales
    const globalIntAddress = memory.assignAddress(DataType.INT, MemorySegment.GLOBAL);
    const localFloatAddress = memory.assignAddress(DataType.FLOAT, MemorySegment.LOCAL);
    const tempStringAddress = memory.assignTempAddress(DataType.STRING);
    const constIntAddress = memory.assignConstantAddress(5, DataType.INT);

    expect(globalIntAddress).toBe(MEMORY_RANGES[MemorySegment.GLOBAL][DataType.INT]?.start || 1000);
    expect(localFloatAddress).toBe(MEMORY_RANGES[MemorySegment.LOCAL][DataType.FLOAT]?.start || 6000);
    expect(tempStringAddress).toBe(MEMORY_RANGES[MemorySegment.TEMPORAL][DataType.STRING]?.start || 11000);
    expect(constIntAddress).toBe(MEMORY_RANGES[MemorySegment.CONSTANT][DataType.INT]?.start || 13000);
  });
});
