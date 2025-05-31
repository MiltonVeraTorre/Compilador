"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BabyDuckGrammar = void 0;
const chevrotain_1 = require("chevrotain");
const tokens = __importStar(require("../lexer/tokens"));
/**
 * Gramática de BabyDuck - Define las reglas gramaticales para el lenguaje BabyDuck
*/
class BabyDuckGrammar extends chevrotain_1.CstParser {
    constructor() {
        super(tokens.allTokens);
        // <program> ::= program Id ';' <varsOpt> <funcsOpt> main <body> end
        this.program = this.RULE("program", () => {
            this.CONSUME(tokens.Program);
            this.CONSUME(tokens.Identifier);
            this.CONSUME(tokens.SemiColon);
            this.OPTION(() => {
                this.SUBRULE(this.vars);
            });
            this.MANY(() => {
                this.SUBRULE(this.func);
            });
            this.CONSUME(tokens.Main);
            this.SUBRULE(this.body);
            this.CONSUME(tokens.End);
        });
        // <varsOpt> ::= <vars> | ε
        // Manejado en la regla program con OPTION
        // <vars> ::= var Id ':' <type> ';' { Id ':' <type> ';' }
        this.vars = this.RULE("vars", () => {
            this.CONSUME(tokens.Var);
            this.AT_LEAST_ONE(() => {
                this.CONSUME(tokens.Identifier);
                this.CONSUME(tokens.Colon);
                this.SUBRULE(this.type);
                this.CONSUME(tokens.SemiColon);
            });
        });
        // <type> ::= int | float
        this.type = this.RULE("type", () => {
            this.OR([
                { ALT: () => this.CONSUME(tokens.Int) },
                { ALT: () => this.CONSUME(tokens.Float) }
            ]);
        });
        // <body> ::= '{' { <statement> } '}'
        this.body = this.RULE("body", () => {
            this.CONSUME(tokens.LBrace);
            this.MANY(() => {
                this.SUBRULE(this.statement);
            });
            this.CONSUME(tokens.RBrace);
        });
        // <statement> ::= <assign> | <condition> | <cycle> | <f_call> | <print>
        this.statement = this.RULE("statement", () => {
            this.OR([
                { ALT: () => this.SUBRULE(this.assign) },
                { ALT: () => this.SUBRULE(this.condition) },
                { ALT: () => this.SUBRULE(this.cycle) },
                { ALT: () => this.SUBRULE(this.f_call) },
                { ALT: () => this.SUBRULE(this.print) }
            ]);
        });
        // <assign> ::= Id '=' <expression> ';'
        this.assign = this.RULE("assign", () => {
            this.CONSUME(tokens.Identifier);
            this.CONSUME(tokens.Equals);
            this.SUBRULE(this.expression);
            this.CONSUME(tokens.SemiColon);
        });
        // <condition> ::= if '(' <expression> ')' <body> [ else <body> ] ';'
        this.condition = this.RULE("condition", () => {
            this.CONSUME(tokens.If);
            this.CONSUME(tokens.LParen);
            this.SUBRULE(this.expression);
            this.CONSUME(tokens.RParen);
            this.SUBRULE(this.body);
            this.OPTION(() => {
                this.CONSUME(tokens.Else);
                this.SUBRULE2(this.body);
            });
            this.CONSUME(tokens.SemiColon);
        });
        // <cycle> ::= while '(' <expression> ')' do <body> ';'
        this.cycle = this.RULE("cycle", () => {
            this.CONSUME(tokens.While);
            this.CONSUME(tokens.LParen);
            this.SUBRULE(this.expression);
            this.CONSUME(tokens.RParen);
            this.CONSUME(tokens.Do);
            this.SUBRULE(this.body);
            this.CONSUME(tokens.SemiColon);
        });
        // <print> ::= print '(' ( <expression> { ',' <expression> } | cte_string ) ')' ';'
        this.print = this.RULE("print", () => {
            this.CONSUME(tokens.Print);
            this.CONSUME(tokens.LParen);
            this.OR([
                {
                    ALT: () => {
                        this.SUBRULE(this.expression);
                        this.MANY(() => {
                            this.CONSUME(tokens.Comma);
                            this.SUBRULE2(this.expression);
                        });
                    }
                },
                { ALT: () => this.CONSUME(tokens.CteString) }
            ]);
            this.CONSUME(tokens.RParen);
            this.CONSUME(tokens.SemiColon);
        });
        // <expression> ::= <exp> [ ( '>' | '<' | '>=' | '<=' | '==' | '!=' ) <exp> ]
        this.expression = this.RULE("expression", () => {
            this.SUBRULE(this.exp);
            this.OPTION(() => {
                this.OR([
                    { ALT: () => this.CONSUME(tokens.GreaterThan) },
                    { ALT: () => this.CONSUME(tokens.LessThan) },
                    { ALT: () => this.CONSUME(tokens.GreaterEquals) },
                    { ALT: () => this.CONSUME(tokens.LessEquals) },
                    { ALT: () => this.CONSUME(tokens.EqualsEquals) },
                    { ALT: () => this.CONSUME(tokens.NotEquals) }
                ]);
                this.SUBRULE2(this.exp);
            });
        });
        // <exp> ::= <term> { ( '+' | '-' ) <term> }
        this.exp = this.RULE("exp", () => {
            this.SUBRULE(this.term);
            this.MANY(() => {
                this.OR([
                    { ALT: () => this.CONSUME(tokens.Plus) },
                    { ALT: () => this.CONSUME(tokens.Minus) }
                ]);
                this.SUBRULE2(this.term);
            });
        });
        // <term> ::= <factor> { ( '*' | '/' ) <factor> }
        this.term = this.RULE("term", () => {
            this.SUBRULE(this.factor);
            this.MANY(() => {
                this.OR([
                    { ALT: () => this.CONSUME(tokens.Multiply) },
                    { ALT: () => this.CONSUME(tokens.Divide) }
                ]);
                this.SUBRULE2(this.factor);
            });
        });
        // <factor> ::= ( '+' | '-' )? ( '(' <expression> ')' | Id | <cte> )
        this.factor = this.RULE("factor", () => {
            this.OPTION(() => {
                this.OR1([
                    { ALT: () => this.CONSUME(tokens.Plus) },
                    { ALT: () => this.CONSUME(tokens.Minus) }
                ]);
            });
            this.OR2([
                {
                    ALT: () => {
                        this.CONSUME(tokens.LParen);
                        this.SUBRULE(this.expression);
                        this.CONSUME(tokens.RParen);
                    }
                },
                { ALT: () => this.CONSUME(tokens.Identifier) },
                { ALT: () => this.SUBRULE(this.cte) }
            ]);
        });
        // <cte> ::= cte_int | cte_float
        this.cte = this.RULE("cte", () => {
            this.OR([
                { ALT: () => this.CONSUME(tokens.CteInt) },
                { ALT: () => this.CONSUME(tokens.CteFloat) }
            ]);
        });
        // <funcsOpt> ::= { <func> }
        // Manejado en la regla program con MANY
        // <func> ::= void Id '(' <paramListOpt> ')' '[' <varsOpt> <body> ']' ';'
        this.func = this.RULE("func", () => {
            this.CONSUME(tokens.Void);
            this.CONSUME(tokens.Identifier);
            this.CONSUME(tokens.LParen);
            this.OPTION(() => {
                this.SUBRULE(this.paramList);
            });
            this.CONSUME(tokens.RParen);
            this.CONSUME(tokens.LBracket);
            this.OPTION2(() => {
                this.SUBRULE(this.vars);
            });
            this.SUBRULE(this.body);
            this.CONSUME(tokens.RBracket);
            this.CONSUME(tokens.SemiColon);
        });
        // <paramListOpt> ::= <paramList> | ε
        // Manejado en la regla func con OPTION
        // <paramList> ::= Id ':' <type> { ',' Id ':' <type> }
        this.paramList = this.RULE("paramList", () => {
            this.CONSUME(tokens.Identifier);
            this.CONSUME(tokens.Colon);
            this.SUBRULE(this.type);
            this.MANY(() => {
                this.CONSUME(tokens.Comma);
                this.CONSUME2(tokens.Identifier);
                this.CONSUME2(tokens.Colon);
                this.SUBRULE2(this.type);
            });
        });
        // <f_call> ::= Id '(' <argListOpt> ')' ';'
        this.f_call = this.RULE("f_call", () => {
            this.CONSUME(tokens.Identifier);
            this.CONSUME(tokens.LParen);
            this.OPTION(() => {
                this.SUBRULE(this.argList);
            });
            this.CONSUME(tokens.RParen);
            this.CONSUME(tokens.SemiColon);
        });
        // <argListOpt> ::= <argList> | ε
        // Manejado en la regla f_call con OPTION
        // <argList> ::= <expression> { ',' <expression> }
        this.argList = this.RULE("argList", () => {
            this.SUBRULE(this.expression);
            this.MANY(() => {
                this.CONSUME(tokens.Comma);
                this.SUBRULE2(this.expression);
            });
        });
        this.performSelfAnalysis();
    }
}
exports.BabyDuckGrammar = BabyDuckGrammar;
//# sourceMappingURL=grammar.js.map