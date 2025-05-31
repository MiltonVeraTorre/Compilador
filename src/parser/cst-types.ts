import { CstNode, IToken } from "chevrotain";

/**
 * Interfaces para los nodos del Árbol de Sintaxis Concreto
 *
 * Estas interfaces definen la estructura de los nodos CST generados por el parser
 */

// Interfaz base para todos los nodos CST con children
export interface BabyDuckCstNode extends CstNode {
  name: string;
  children: Record<string, any[]>;
}

// Nodo del programa
export interface ProgramCstNode extends BabyDuckCstNode {
  name: "program";
  children: {
    Program: IToken[];
    Identifier: IToken[];
    SemiColon: IToken[];
    vars?: VarsCstNode[];
    func?: FuncCstNode[];
    Main: IToken[];
    body: BodyCstNode[];
    End: IToken[];
  };
}

// Nodo de declaración de variables
export interface VarsCstNode extends BabyDuckCstNode {
  name: "vars";
  children: {
    Var: IToken[];
    Identifier: IToken[];
    Colon: IToken[];
    type: TypeCstNode[];
    SemiColon: IToken[];
  };
}

// Nodo de tipo de datos
export interface TypeCstNode extends BabyDuckCstNode {
  name: "type";
  children: {
    Int?: IToken[];
    Float?: IToken[];
  };
}

// Nodo de cuerpo
export interface BodyCstNode extends BabyDuckCstNode {
  name: "body";
  children: {
    LBrace: IToken[];
    statement?: StatementCstNode[];
    RBrace: IToken[];
  };
}

// Nodo de statement
export interface StatementCstNode extends BabyDuckCstNode {
  name: "statement";
  children: {
    assign?: AssignCstNode[];
    condition?: ConditionCstNode[];
    cycle?: CycleCstNode[];
    f_call?: FCallCstNode[];
    print?: PrintCstNode[];
  };
}

// Nodo de asignación
export interface AssignCstNode extends BabyDuckCstNode {
  name: "assign";
  children: {
    Identifier: IToken[];
    Equals: IToken[];
    expression: ExpressionCstNode[];
    SemiColon: IToken[];
  };
}

// Nodo de condición
export interface ConditionCstNode extends BabyDuckCstNode {
  name: "condition";
  children: {
    If: IToken[];
    LParen: IToken[];
    expression: ExpressionCstNode[];
    RParen: IToken[];
    body: BodyCstNode[];
    Else?: IToken[];
    SemiColon: IToken[];
  };
}

// Nodo de ciclo
export interface CycleCstNode extends BabyDuckCstNode {
  name: "cycle";
  children: {
    While: IToken[];
    LParen: IToken[];
    expression: ExpressionCstNode[];
    RParen: IToken[];
    Do: IToken[];
    body: BodyCstNode[];
    SemiColon: IToken[];
  };
}

// Nodo de llamada a función
export interface FCallCstNode extends BabyDuckCstNode {
  name: "f_call";
  children: {
    Identifier: IToken[];
    LParen: IToken[];
    argList?: ArgListCstNode[];
    RParen: IToken[];
    SemiColon: IToken[];
  };
}

// Nodo de print
export interface PrintCstNode extends BabyDuckCstNode {
  name: "print";
  children: {
    Print: IToken[];
    LParen: IToken[];
    expression?: ExpressionCstNode[];
    Comma?: IToken[];
    CteString?: IToken[];
    RParen: IToken[];
    SemiColon: IToken[];
  };
}

// Nodo de expresión
export interface ExpressionCstNode extends BabyDuckCstNode {
  name: "expression";
  children: {
    exp: ExpCstNode[];
    GreaterThan?: IToken[];
    LessThan?: IToken[];
    GreaterEquals?: IToken[];
    LessEquals?: IToken[];
    EqualsEquals?: IToken[];
    NotEquals?: IToken[];
  };
}

// Nodo de expresión aritmética
export interface ExpCstNode extends BabyDuckCstNode {
  name: "exp";
  children: {
    term: TermCstNode[];
    Plus?: IToken[];
    Minus?: IToken[];
  };
}

// Nodo de término
export interface TermCstNode extends BabyDuckCstNode {
  name: "term";
  children: {
    factor: FactorCstNode[];
    Multiply?: IToken[];
    Divide?: IToken[];
  };
}

// Nodo de factor
export interface FactorCstNode extends BabyDuckCstNode {
  name: "factor";
  children: {
    Plus?: IToken[];
    Minus?: IToken[];
    LParen?: IToken[];
    expression?: ExpressionCstNode[];
    RParen?: IToken[];
    Identifier?: IToken[];
    cte?: CteCstNode[];
  };
}

// Nodo de constante
export interface CteCstNode extends BabyDuckCstNode {
  name: "cte";
  children: {
    CteInt?: IToken[];
    CteFloat?: IToken[];
  };
}

// Nodo de función
export interface FuncCstNode extends BabyDuckCstNode {
  name: "func";
  children: {
    Void: IToken[];
    Identifier: IToken[];
    LParen: IToken[];
    paramList?: ParamListCstNode[];
    RParen: IToken[];
    LBracket: IToken[];
    vars?: VarsCstNode[];
    body: BodyCstNode[];
    RBracket: IToken[];
    SemiColon: IToken[];
  };
}

// Nodo de lista de parámetros
export interface ParamListCstNode extends BabyDuckCstNode {
  name: "paramList";
  children: {
    Identifier: IToken[];
    Colon: IToken[];
    type: TypeCstNode[];
    Comma?: IToken[];
  };
}

// Nodo de lista de argumentos
export interface ArgListCstNode extends BabyDuckCstNode {
  name: "argList";
  children: {
    expression: ExpressionCstNode[];
    Comma?: IToken[];
  };
}
