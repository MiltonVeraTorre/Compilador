import { DataType } from '../semantic/semantic-cube';

/**
 * Segmentos de memoria
 *
 * Cada segmento tiene un rango específico de direcciones
 */
export enum MemorySegment {
  GLOBAL = 'global',     // Variables globales
  LOCAL = 'local',       // Variables locales
  PARAMETER = 'parameter', // Parámetros de funciones
  TEMPORAL = 'temporal', // Variables temporales
  CONSTANT = 'constant'  // Constantes
}

/**
 * Rangos de direcciones para cada segmento y tipo
 *
 * Cada tipo de dato en cada segmento tiene un rango específico
 */
export const MEMORY_RANGES: {
  [segment in MemorySegment]: {
    [type in DataType]?: { start: number; end: number }
  }
} = {
  // Variables globales: 1000-4999
  [MemorySegment.GLOBAL]: {
    [DataType.INT]: { start: 1000, end: 1999 },
    [DataType.FLOAT]: { start: 2000, end: 2999 },
    [DataType.STRING]: { start: 3000, end: 3999 }
  },

  // Variables locales: 5100-8999
  [MemorySegment.LOCAL]: {
    [DataType.INT]: { start: 5100, end: 5999 },
    [DataType.FLOAT]: { start: 6000, end: 6999 },
    [DataType.STRING]: { start: 7000, end: 7999 }
  },

  // Parámetros de funciones: 5000-5099
  [MemorySegment.PARAMETER]: {
    [DataType.INT]: { start: 5000, end: 5099 },
    [DataType.FLOAT]: { start: 5000, end: 5099 },
    [DataType.STRING]: { start: 5000, end: 5099 }
  },

  // Variables temporales: 9000-12999
  [MemorySegment.TEMPORAL]: {
    [DataType.INT]: { start: 9000, end: 9999 },
    [DataType.FLOAT]: { start: 10000, end: 10999 },
    [DataType.STRING]: { start: 11000, end: 11999 }
  },

  // Constantes: 13000-16999
  [MemorySegment.CONSTANT]: {
    [DataType.INT]: { start: 13000, end: 13999 },
    [DataType.FLOAT]: { start: 14000, end: 14999 },
    [DataType.STRING]: { start: 15000, end: 15999 }
  }
};

/**
 * Administrador de Memoria Virtual
 *
 * Maneja la asignación de direcciones virtuales para variables,
 * constantes y temporales
 */
export class VirtualMemory {
  // Contadores para cada segmento y tipo
  private counters: {
    [segment: string]: {
      [type: string]: number
    }
  };

  // Mapa de constantes para evitar duplicados
  private constantMap: Map<string, number>;

  constructor() {
    // Inicializar contadores con los valores iniciales
    this.counters = {
      [MemorySegment.GLOBAL]: {
        [DataType.INT]: MEMORY_RANGES[MemorySegment.GLOBAL][DataType.INT]?.start || 1000,
        [DataType.FLOAT]: MEMORY_RANGES[MemorySegment.GLOBAL][DataType.FLOAT]?.start || 2000,
        [DataType.STRING]: MEMORY_RANGES[MemorySegment.GLOBAL][DataType.STRING]?.start || 3000
      },
      [MemorySegment.LOCAL]: {
        [DataType.INT]: MEMORY_RANGES[MemorySegment.LOCAL][DataType.INT]?.start || 5100,
        [DataType.FLOAT]: MEMORY_RANGES[MemorySegment.LOCAL][DataType.FLOAT]?.start || 6000,
        [DataType.STRING]: MEMORY_RANGES[MemorySegment.LOCAL][DataType.STRING]?.start || 7000
      },
      [MemorySegment.PARAMETER]: {
        [DataType.INT]: MEMORY_RANGES[MemorySegment.PARAMETER][DataType.INT]?.start || 5000,
        [DataType.FLOAT]: MEMORY_RANGES[MemorySegment.PARAMETER][DataType.FLOAT]?.start || 5000,
        [DataType.STRING]: MEMORY_RANGES[MemorySegment.PARAMETER][DataType.STRING]?.start || 5000
      },
      [MemorySegment.TEMPORAL]: {
        [DataType.INT]: MEMORY_RANGES[MemorySegment.TEMPORAL][DataType.INT]?.start || 9000,
        [DataType.FLOAT]: MEMORY_RANGES[MemorySegment.TEMPORAL][DataType.FLOAT]?.start || 10000,
        [DataType.STRING]: MEMORY_RANGES[MemorySegment.TEMPORAL][DataType.STRING]?.start || 11000
      },
      [MemorySegment.CONSTANT]: {
        [DataType.INT]: MEMORY_RANGES[MemorySegment.CONSTANT][DataType.INT]?.start || 13000,
        [DataType.FLOAT]: MEMORY_RANGES[MemorySegment.CONSTANT][DataType.FLOAT]?.start || 14000,
        [DataType.STRING]: MEMORY_RANGES[MemorySegment.CONSTANT][DataType.STRING]?.start || 15000
      }
    };

    this.constantMap = new Map<string, number>();
  }

  /**
   * Asigna una dirección virtual para una variable
   * @param type Tipo de dato
   * @param segment Segmento de memoria
   * @returns Dirección virtual asignada
   */
  public assignAddress(type: DataType, segment: MemorySegment): number {
    // Verificar que el tipo sea válido
    if (type === DataType.VOID || type === DataType.ERROR) {
      throw new Error(`No se puede asignar memoria para el tipo ${type}`);
    }

    // Obtener el contador actual
    const counter = this.counters[segment][type];

    // Verificar que no se haya excedido el límite
    const end = MEMORY_RANGES[segment][type]?.end || 0;
    if (counter > end) {
      throw new Error(`Memoria agotada para el segmento ${segment} y tipo ${type}`);
    }

    // Incrementar el contador y devolver la dirección
    this.counters[segment][type]++;
    return counter;
  }

  /**
   * Asigna una dirección virtual para una constante
   * @param value Valor de la constante
   * @param type Tipo de dato
   * @returns Dirección virtual asignada
   */
  public assignConstantAddress(value: string | number, type: DataType): number {
    // Crear una clave única para la constante
    const key = `${type}:${value}`;

    // Verificar si la constante ya existe
    if (this.constantMap.has(key)) {
      return this.constantMap.get(key)!;
    }

    // Asignar una nueva dirección
    const address = this.assignAddress(type, MemorySegment.CONSTANT);

    // Guardar la constante en el mapa
    this.constantMap.set(key, address);

    return address;
  }

  /**
   * Asigna una dirección virtual para una variable temporal
   * @param type Tipo de dato
   * @returns Dirección virtual asignada
   */
  public assignTempAddress(type: DataType): number {
    return this.assignAddress(type, MemorySegment.TEMPORAL);
  }

  /**
   * Determina el tipo de dato basado en una dirección virtual
   * @param address Dirección virtual
   * @returns Tipo de dato
   */
  public getTypeFromAddress(address: number): DataType {
    // Recorrer todos los segmentos y tipos
    const segments = Object.keys(MEMORY_RANGES) as MemorySegment[];

    for (const segment of segments) {
      const types = Object.keys(MEMORY_RANGES[segment]) as DataType[];

      for (const type of types) {
        const range = MEMORY_RANGES[segment][type];
        if (range && address >= range.start && address <= range.end) {
          return type;
        }
      }
    }

    throw new Error(`Dirección inválida: ${address}`);
  }

  /**
   * Determina el segmento basado en una dirección virtual
   * @param address Dirección virtual
   * @returns Segmento de memoria
   */
  public getSegmentFromAddress(address: number): MemorySegment {
    // Recorrer todos los segmentos
    const segments = Object.keys(MEMORY_RANGES) as MemorySegment[];

    for (const segment of segments) {
      const types = Object.keys(MEMORY_RANGES[segment]) as DataType[];

      for (const type of types) {
        const range = MEMORY_RANGES[segment][type];
        if (range && address >= range.start && address <= range.end) {
          return segment;
        }
      }
    }

    throw new Error(`Dirección inválida: ${address}`);
  }

  /**
   * Obtiene todas las constantes registradas
   * @returns Mapa de constantes con sus direcciones
   */
  public getConstants(): Map<string, number> {
    return new Map(this.constantMap);
  }

  /**
   * Obtiene las constantes como un array de objetos con valor, tipo y dirección
   * @returns Array de constantes
   */
  public getConstantsArray(): Array<{ value: string | number, type: DataType, address: number }> {
    const constants: Array<{ value: string | number, type: DataType, address: number }> = [];

    for (const [key, address] of this.constantMap) {
      const [typeStr, value] = key.split(':');
      const type = typeStr as DataType;

      // Convertir el valor al tipo apropiado
      let convertedValue: string | number = value;
      if (type === DataType.INT) {
        convertedValue = parseInt(value, 10);
      } else if (type === DataType.FLOAT) {
        convertedValue = parseFloat(value);
      }

      constants.push({
        value: convertedValue,
        type,
        address
      });
    }

    return constants;
  }

  /**
   * Reinicia los contadores de memoria
   */
  public reset(): void {
    // Reiniciar todos los contadores a sus valores iniciales
    const segments = Object.keys(MEMORY_RANGES) as MemorySegment[];

    for (const segment of segments) {
      const types = Object.keys(MEMORY_RANGES[segment]) as DataType[];

      for (const type of types) {
        const range = MEMORY_RANGES[segment][type];
        if (range) {
          this.counters[segment][type] = range.start;
        }
      }
    }

    // Limpiar el mapa de constantes
    this.constantMap.clear();
  }
}

export const virtualMemory = new VirtualMemory();
