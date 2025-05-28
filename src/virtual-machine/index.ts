/**
 * Módulo de Máquina Virtual de BabyDuck
 * 
 * Exporta todas las clases y funciones relacionadas con la ejecución
 * de cuádruplos en la máquina virtual
 */

export { VirtualMachine } from './virtual-machine';
export { ExecutionMemory, executionMemory } from './execution-memory';
export { ActivationStack, ActivationContext } from './activation-context';

// Re-exportar tipos útiles
export type { ActivationContext as IActivationContext } from './activation-context';
