"use strict";
/**
 * Módulo de Máquina Virtual de BabyDuck
 *
 * Exporta todas las clases y funciones relacionadas con la ejecución
 * de cuádruplos en la máquina virtual
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualMachine = exports.executionMemory = exports.ExecutionMemory = exports.ActivationStack = void 0;
var activation_context_1 = require("./activation-context");
Object.defineProperty(exports, "ActivationStack", { enumerable: true, get: function () { return activation_context_1.ActivationStack; } });
var execution_memory_1 = require("./execution-memory");
Object.defineProperty(exports, "ExecutionMemory", { enumerable: true, get: function () { return execution_memory_1.ExecutionMemory; } });
Object.defineProperty(exports, "executionMemory", { enumerable: true, get: function () { return execution_memory_1.executionMemory; } });
var virtual_machine_1 = require("./virtual-machine");
Object.defineProperty(exports, "VirtualMachine", { enumerable: true, get: function () { return virtual_machine_1.VirtualMachine; } });
//# sourceMappingURL=index.js.map