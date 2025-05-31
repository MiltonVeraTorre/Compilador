/**
 * Tipos de datos que soporta BabyDuck
 */
export enum DataType {
  INT = 'int',
  FLOAT = 'float',
  VOID = 'void',
  STRING = 'string',
  ERROR = 'error'
}

/**
 * Operadores que soporta BabyDuck
 */
export enum Operator {
  // Aritmeticos
  PLUS = '+',
  MINUS = '-',
  MULTIPLY = '*',
  DIVIDE = '/',

  // Relacionales
  GREATER_THAN = '>',
  LESS_THAN = '<',
  GREATER_EQUALS = '>=',
  LESS_EQUALS = '<=',
  EQUALS = '==',
  NOT_EQUALS = '!=',



  // Asignacion
  ASSIGN = '='
}

/**
 * Cubo Semantico - Define reglas de compatibilidad de tipos
 *
 * Dice que tipo resulta cuando haces operaciones entre diferentes tipos
 */
export class SemanticCube {
  private cube: Map<string, DataType>;

  constructor() {
    this.cube = new Map<string, DataType>();
    this.initCube();
  }

  /**
   * Inicializa el cubo con todas las operaciones validas
   */
  private initCube() {
    // Operaciones aritméticas: +, -, *, /

    // int + int = int
    this.setCubeValue(DataType.INT, Operator.PLUS, DataType.INT, DataType.INT);
    // int - int = int
    this.setCubeValue(DataType.INT, Operator.MINUS, DataType.INT, DataType.INT);
    // int * int = int
    this.setCubeValue(DataType.INT, Operator.MULTIPLY, DataType.INT, DataType.INT);
    // int / int = float
    this.setCubeValue(DataType.INT, Operator.DIVIDE, DataType.INT, DataType.FLOAT);

    // int + float = float
    this.setCubeValue(DataType.INT, Operator.PLUS, DataType.FLOAT, DataType.FLOAT);
    // int - float = float
    this.setCubeValue(DataType.INT, Operator.MINUS, DataType.FLOAT, DataType.FLOAT);
    // int * float = float
    this.setCubeValue(DataType.INT, Operator.MULTIPLY, DataType.FLOAT, DataType.FLOAT);
    // int / float = float
    this.setCubeValue(DataType.INT, Operator.DIVIDE, DataType.FLOAT, DataType.FLOAT);

    // float + int = float
    this.setCubeValue(DataType.FLOAT, Operator.PLUS, DataType.INT, DataType.FLOAT);
    // float - int = float
    this.setCubeValue(DataType.FLOAT, Operator.MINUS, DataType.INT, DataType.FLOAT);
    // float * int = float
    this.setCubeValue(DataType.FLOAT, Operator.MULTIPLY, DataType.INT, DataType.FLOAT);
    // float / int = float
    this.setCubeValue(DataType.FLOAT, Operator.DIVIDE, DataType.INT, DataType.FLOAT);

    // float + float = float
    this.setCubeValue(DataType.FLOAT, Operator.PLUS, DataType.FLOAT, DataType.FLOAT);
    // float - float = float
    this.setCubeValue(DataType.FLOAT, Operator.MINUS, DataType.FLOAT, DataType.FLOAT);
    // float * float = float
    this.setCubeValue(DataType.FLOAT, Operator.MULTIPLY, DataType.FLOAT, DataType.FLOAT);
    // float / float = float
    this.setCubeValue(DataType.FLOAT, Operator.DIVIDE, DataType.FLOAT, DataType.FLOAT);

    // Operaciones relacionales: >, <, >=, <=, ==, !=

    // int > int = int (representando booleano)
    this.setCubeValue(DataType.INT, Operator.GREATER_THAN, DataType.INT, DataType.INT);
    // int < int = int (representando booleano)
    this.setCubeValue(DataType.INT, Operator.LESS_THAN, DataType.INT, DataType.INT);
    // int >= int = int (representando booleano)
    this.setCubeValue(DataType.INT, Operator.GREATER_EQUALS, DataType.INT, DataType.INT);
    // int <= int = int (representando booleano)
    this.setCubeValue(DataType.INT, Operator.LESS_EQUALS, DataType.INT, DataType.INT);
    // int == int = int (representando booleano)
    this.setCubeValue(DataType.INT, Operator.EQUALS, DataType.INT, DataType.INT);
    // int != int = int (representando booleano)
    this.setCubeValue(DataType.INT, Operator.NOT_EQUALS, DataType.INT, DataType.INT);

    // int > float = int (representando booleano)
    this.setCubeValue(DataType.INT, Operator.GREATER_THAN, DataType.FLOAT, DataType.INT);
    // int < float = int (representando booleano)
    this.setCubeValue(DataType.INT, Operator.LESS_THAN, DataType.FLOAT, DataType.INT);
    // int >= float = int (representando booleano)
    this.setCubeValue(DataType.INT, Operator.GREATER_EQUALS, DataType.FLOAT, DataType.INT);
    // int <= float = int (representando booleano)
    this.setCubeValue(DataType.INT, Operator.LESS_EQUALS, DataType.FLOAT, DataType.INT);
    // int == float = int (representando booleano)
    this.setCubeValue(DataType.INT, Operator.EQUALS, DataType.FLOAT, DataType.INT);
    // int != float = int (representando booleano)
    this.setCubeValue(DataType.INT, Operator.NOT_EQUALS, DataType.FLOAT, DataType.INT);

    // float > int = int (representando booleano)
    this.setCubeValue(DataType.FLOAT, Operator.GREATER_THAN, DataType.INT, DataType.INT);
    // float < int = int (representando booleano)
    this.setCubeValue(DataType.FLOAT, Operator.LESS_THAN, DataType.INT, DataType.INT);
    // float >= int = int (representando booleano)
    this.setCubeValue(DataType.FLOAT, Operator.GREATER_EQUALS, DataType.INT, DataType.INT);
    // float <= int = int (representando booleano)
    this.setCubeValue(DataType.FLOAT, Operator.LESS_EQUALS, DataType.INT, DataType.INT);
    // float == int = int (representando booleano)
    this.setCubeValue(DataType.FLOAT, Operator.EQUALS, DataType.INT, DataType.INT);
    // float != int = int (representando booleano)
    this.setCubeValue(DataType.FLOAT, Operator.NOT_EQUALS, DataType.INT, DataType.INT);

    // float > float = int (representando booleano)
    this.setCubeValue(DataType.FLOAT, Operator.GREATER_THAN, DataType.FLOAT, DataType.INT);
    // float < float = int (representando booleano)
    this.setCubeValue(DataType.FLOAT, Operator.LESS_THAN, DataType.FLOAT, DataType.INT);
    // float >= float = int (representando booleano)
    this.setCubeValue(DataType.FLOAT, Operator.GREATER_EQUALS, DataType.FLOAT, DataType.INT);
    // float <= float = int (representando booleano)
    this.setCubeValue(DataType.FLOAT, Operator.LESS_EQUALS, DataType.FLOAT, DataType.INT);
    // float == float = int (representando booleano)
    this.setCubeValue(DataType.FLOAT, Operator.EQUALS, DataType.FLOAT, DataType.INT);
    // float != float = int (representando booleano)
    this.setCubeValue(DataType.FLOAT, Operator.NOT_EQUALS, DataType.FLOAT, DataType.INT);

    // Operaciones de asignación: =

    // int = int
    this.setCubeValue(DataType.INT, Operator.ASSIGN, DataType.INT, DataType.INT);
    // int = float
    this.setCubeValue(DataType.INT, Operator.ASSIGN, DataType.FLOAT, DataType.ERROR);
    // float = int
    this.setCubeValue(DataType.FLOAT, Operator.ASSIGN, DataType.INT, DataType.FLOAT);
    // float = float
    this.setCubeValue(DataType.FLOAT, Operator.ASSIGN, DataType.FLOAT, DataType.FLOAT);


  }

  /**
   * Guarda el tipo que resulta de una operacion
   * @param leftType Tipo izquierdo
   * @param operator Operador
   * @param rightType Tipo derecho
   * @param resultType Tipo resultado
   */
  private setCubeValue(
    leftType: DataType,
    operator: Operator,
    rightType: DataType,
    resultType: DataType
  ) {
    const key = `${leftType}${operator}${rightType}`;
    this.cube.set(key, resultType);
  }

  /**
   * Dame el tipo que resulta de una operacion
   * @param leftType Tipo izquierdo
   * @param operator Operador
   * @param rightType Tipo derecho
   * @returns Tipo resultado o ERROR si no es valida
   */
  public getResultType(
    leftType: DataType,
    operator: Operator,
    rightType: DataType
  ) {
    const key = `${leftType}${operator}${rightType}`;
    return this.cube.get(key) || DataType.ERROR;
  }

  /**
   * Checa si una operacion es valida
   * @param leftType Tipo izquierdo
   * @param operator Operador
   * @param rightType Tipo derecho
   * @returns true si es valida, false si no
   */
  public isValidOperation(
    leftType: DataType,
    operator: Operator,
    rightType: DataType
  ) {
    return this.getResultType(leftType, operator, rightType) !== DataType.ERROR;
  }
}

export const semanticCube = new SemanticCube();
