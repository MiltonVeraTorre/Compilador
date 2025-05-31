/**
 * Módulo de Máquina Virtual de BabyDuck
 * 
 * Exporta todas las clases y funciones relacionadas con la ejecución
 * de cuádruplos en la máquina virtual
 */

export { ActivationContext, ActivationStack } from './activation-context';
export { ExecutionMemory, executionMemory } from './execution-memory';
export { VirtualMachine } from './virtual-machine';

// Re-exportar tipos útiles
export type { ActivationContext as IActivationContext } from './activation-context';
