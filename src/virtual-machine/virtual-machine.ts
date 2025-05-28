import { Quadruple, QuadrupleOperator } from '../quadruples/quadruple';
import { Operator, DataType } from '../semantic/semantic-cube';
import { ExecutionMemory, executionMemory } from './execution-memory';
import { virtualMemory } from '../memory/virtual-memory';

/**
 * Máquina Virtual de BabyDuck
 *
 * Ejecuta los cuádruplos generados por el compilador
 */
export class VirtualMachine {
  private memory: ExecutionMemory;
  private instructionPointer: number;
  private quadruples: Quadruple[];
  private output: string[];
  private running: boolean;

  constructor(memory?: ExecutionMemory) {
    this.memory = memory || executionMemory;
    this.instructionPointer = 0;
    this.quadruples = [];
    this.output = [];
    this.running = false;
  }

  /**
   * Carga los cuádruplos para ejecutar
   * @param quadruples Lista de cuádruplos
   */
  public loadQuadruples(quadruples: Quadruple[]): void {
    this.quadruples = quadruples;
    this.instructionPointer = 0;
    this.output = [];
    this.running = false;
  }

  /**
   * Ejecuta los cuádruplos cargados
   * @returns La salida generada durante la ejecución
   */
  public execute(): string[] {
    this.running = true;
    this.instructionPointer = 0;

    while (this.running && this.instructionPointer < this.quadruples.length) {
      const quad = this.quadruples[this.instructionPointer];
      this.executeQuadruple(quad);
      this.instructionPointer++;
    }

    return this.output;
  }

  /**
   * Ejecuta un cuádruplo individual
   * @param quad Cuádruplo a ejecutar
   */
  private executeQuadruple(quad: Quadruple): void {
    switch (quad.operator) {
      // Operaciones aritméticas
      case Operator.PLUS:
      case QuadrupleOperator.PLUS:
        this.executeArithmetic(quad, (a, b) => a + b);
        break;

      case Operator.MINUS:
      case QuadrupleOperator.MINUS:
        this.executeArithmetic(quad, (a, b) => a - b);
        break;

      case Operator.MULTIPLY:
      case QuadrupleOperator.MULTIPLY:
        this.executeArithmetic(quad, (a, b) => a * b);
        break;

      case Operator.DIVIDE:
      case QuadrupleOperator.DIVIDE:
        this.executeArithmetic(quad, (a, b) => {
          if (b === 0) {
            throw new Error('Error de ejecución: División por cero');
          }
          return a / b;
        });
        break;

      // Operaciones relacionales
      case Operator.GREATER_THAN:
      case QuadrupleOperator.GREATER_THAN:
        this.executeRelational(quad, (a, b) => a > b ? 1 : 0);
        break;

      case Operator.LESS_THAN:
      case QuadrupleOperator.LESS_THAN:
        this.executeRelational(quad, (a, b) => a < b ? 1 : 0);
        break;

      case Operator.NOT_EQUALS:
      case QuadrupleOperator.NOT_EQUALS:
        this.executeRelational(quad, (a, b) => a !== b ? 1 : 0);
        break;

      case Operator.GREATER_EQUALS:
      case QuadrupleOperator.GREATER_EQUALS:
        this.executeRelational(quad, (a, b) => a >= b ? 1 : 0);
        break;

      case Operator.LESS_EQUALS:
      case QuadrupleOperator.LESS_EQUALS:
        this.executeRelational(quad, (a, b) => a <= b ? 1 : 0);
        break;

      case Operator.EQUALS:
      case QuadrupleOperator.EQUALS:
        this.executeRelational(quad, (a, b) => a === b ? 1 : 0);
        break;

      // Operaciones lógicas
      case Operator.AND:
      case QuadrupleOperator.AND:
        this.executeLogical(quad, (a, b) => (a && b) ? 1 : 0);
        break;

      case Operator.OR:
      case QuadrupleOperator.OR:
        this.executeLogical(quad, (a, b) => (a || b) ? 1 : 0);
        break;

      case Operator.NOT:
      case QuadrupleOperator.NOT:
        this.executeUnary(quad, (a) => (!a || a === 0) ? 1 : 0);
        break;

      // Asignación
      case Operator.ASSIGN:
      case QuadrupleOperator.ASSIGN:
        this.executeAssignment(quad);
        break;

      // Operaciones de control
      case QuadrupleOperator.PRINT:
        this.executePrint(quad);
        break;

      case QuadrupleOperator.READ:
        this.executeRead(quad);
        break;

      case QuadrupleOperator.GOTO:
        this.executeGoto(quad);
        break;

      case QuadrupleOperator.GOTOF:
        this.executeGotof(quad);
        break;

      case QuadrupleOperator.GOTOT:
        this.executeGotot(quad);
        break;

      // Operaciones de funciones
      case QuadrupleOperator.ERA:
        this.executeEra(quad);
        break;

      case QuadrupleOperator.PARAM:
        this.executeParam(quad);
        break;

      case QuadrupleOperator.GOSUB:
        this.executeGosub(quad);
        break;

      case QuadrupleOperator.RETURN:
        this.executeReturn(quad);
        break;

      case QuadrupleOperator.ENDPROC:
        this.executeEndproc(quad);
        break;

      default:
        throw new Error(`Operador desconocido: ${quad.operator}`);
    }
  }

  /**
   * Ejecuta una operación aritmética
   * @param quad Cuádruplo
   * @param operation Función de operación
   */
  private executeArithmetic(quad: Quadruple, operation: (a: number, b: number) => number): void {
    const leftValue = this.memory.getValue(quad.leftOperand!);
    const rightValue = this.memory.getValue(quad.rightOperand!);
    const result = operation(leftValue, rightValue);
    this.memory.setValue(quad.result!, result);
  }

  /**
   * Ejecuta una operación relacional
   * @param quad Cuádruplo
   * @param operation Función de operación
   */
  private executeRelational(quad: Quadruple, operation: (a: any, b: any) => number): void {
    const leftValue = this.memory.getValue(quad.leftOperand!);
    const rightValue = this.memory.getValue(quad.rightOperand!);
    const result = operation(leftValue, rightValue);
    this.memory.setValue(quad.result!, result);
  }

  /**
   * Ejecuta una asignación
   * @param quad Cuádruplo
   */
  private executeAssignment(quad: Quadruple): void {
    const value = this.memory.getValue(quad.leftOperand!);
    this.memory.setValue(quad.result!, value);
  }

  /**
   * Ejecuta una operación de impresión
   * @param quad Cuádruplo
   */
  private executePrint(quad: Quadruple): void {
    const value = this.memory.getValue(quad.leftOperand!);
    if (value !== undefined) {
      this.output.push(value.toString());
    } else {
      this.output.push('undefined');
    }
  }

  /**
   * Ejecuta un salto incondicional
   * @param quad Cuádruplo
   */
  private executeGoto(quad: Quadruple): void {
    this.instructionPointer = quad.result! - 1; // -1 porque se incrementará después
  }

  /**
   * Ejecuta un salto condicional (si falso)
   * @param quad Cuádruplo
   */
  private executeGotof(quad: Quadruple): void {
    const condition = this.memory.getValue(quad.leftOperand!);
    if (!condition || condition === 0) {
      this.instructionPointer = quad.result! - 1;
    }
  }

  /**
   * Ejecuta un salto condicional (si verdadero)
   * @param quad Cuádruplo
   */
  private executeGotot(quad: Quadruple): void {
    const condition = this.memory.getValue(quad.leftOperand!);
    if (condition && condition !== 0) {
      this.instructionPointer = quad.result! - 1;
    }
  }

  /**
   * Ejecuta la creación de un espacio de activación
   * @param quad Cuádruplo
   */
  private executeEra(quad: Quadruple): void {
    // El tamaño del espacio está en leftOperand (no se usa actualmente pero se mantiene para compatibilidad)
    // Crear el contexto de activación inmediatamente
    this.memory.createActivationContext('function', this.instructionPointer + 1);
  }

  /**
   * Ejecuta el paso de un parámetro
   * @param quad Cuádruplo
   */
  private executeParam(quad: Quadruple): void {
    const paramValue = this.memory.getValue(quad.leftOperand!);
    const paramIndex = quad.rightOperand!;

    // Los parámetros van en direcciones locales específicas
    // Los parámetros van en direcciones 5000 + índice
    const paramAddress = 5000 + paramIndex;
    this.memory.setValue(paramAddress, paramValue);
  }

  /**
   * Ejecuta una llamada a subrutina
   * @param quad Cuádruplo
   */
  private executeGosub(quad: Quadruple): void {
    // Obtener el contexto actual y actualizar la dirección de retorno
    const context = this.memory.getCurrentActivationContext();
    if (context) {
      context.returnAddress = this.instructionPointer + 1;

      // Si hay dirección de resultado (quad.result), guardarla en el contexto
      if (quad.result !== null) {
        context.resultAddress = quad.result;
      }
    }

    // Saltar a la función
    this.instructionPointer = quad.leftOperand! - 1;
  }

  /**
   * Ejecuta un retorno de función
   * @param quad Cuádruplo
   */
  private executeReturn(quad: Quadruple): void {
    // Obtener el contexto actual antes de eliminarlo
    const context = this.memory.getCurrentActivationContext();

    // Si hay valor de retorno, guardarlo en la dirección especificada en GOSUB
    if (quad.leftOperand !== null && context && context.resultAddress !== undefined) {
      const returnValue = this.memory.getValue(quad.leftOperand);
      // Guardar el valor de retorno en la dirección especificada en GOSUB
      this.memory.setValue(context.resultAddress, returnValue);
    }

    // Regresar a la dirección de retorno
    const returnAddress = this.memory.popActivationContext();
    if (returnAddress !== undefined) {
      this.instructionPointer = returnAddress - 1;
    }
  }

  /**
   * Ejecuta el final de un procedimiento
   * @param quad Cuádruplo
   */
  private executeEndproc(_quad: Quadruple): void {
    // Terminar la ejecución si estamos en el programa principal
    this.running = false;
  }

  /**
   * Obtiene la salida generada
   * @returns Array de strings con la salida
   */
  public getOutput(): string[] {
    return this.output;
  }

  /**
   * Ejecuta una operación lógica
   * @param quad Cuádruplo
   * @param operation Función de operación lógica
   */
  private executeLogical(quad: Quadruple, operation: (a: any, b: any) => number): void {
    const leftValue = this.memory.getValue(quad.leftOperand!);
    const rightValue = this.memory.getValue(quad.rightOperand!);
    const result = operation(leftValue, rightValue);
    this.memory.setValue(quad.result!, result);
  }

  /**
   * Ejecuta una operación unaria
   * @param quad Cuádruplo
   * @param operation Función de operación unaria
   */
  private executeUnary(quad: Quadruple, operation: (a: any) => number): void {
    const value = this.memory.getValue(quad.leftOperand!);
    const result = operation(value);
    this.memory.setValue(quad.result!, result);
  }

  /**
   * Ejecuta una operación de lectura (READ)
   * @param quad Cuádruplo
   */
  private executeRead(quad: Quadruple): void {
    // Por simplicidad, simulamos la entrada del usuario con valores predefinidos
    // En una implementación real, esto leería de stdin o una interfaz de usuario
    const address = quad.result!;

    // Simulamos entrada del usuario - en tests se puede configurar
    let inputValue: any = 0;

    // Si hay un valor en leftOperand, lo usamos como valor por defecto para testing
    if (quad.leftOperand !== null) {
      inputValue = this.memory.getValue(quad.leftOperand);
    }

    this.memory.setValue(address, inputValue);
  }

  /**
   * Limpia la máquina virtual
   */
  public clear(): void {
    this.memory.clear();
    this.instructionPointer = 0;
    this.quadruples = [];
    this.output = [];
    this.running = false;
  }
}
