import { parseInput } from './index';
import { quadrupleToString } from './quadruples';

// Programa de ejemplo en BabyDuck
const sourceCode = `
program example;
var
  x: int;
  y: int;

main {
  x = 5;
  y = 10;
  print(x + y);
}
end
`;

const result = parseInput(sourceCode);

if (result.lexErrors.length > 0 || result.parseErrors.length > 0) {
  console.error('Compilation failed:', {
    lexErrors: result.lexErrors,
    parseErrors: result.parseErrors
  });
} else if (result.semanticErrors.length > 0) {
  console.error('Semantic errors:', result.semanticErrors);
} else {
  console.log('¡Compilación exitosa!');

  // Mostrar los cuádruplos generados
  console.log('\nCuádruplos generados:');
  result.quadruples.forEach((quad, index) => {
    console.log(`${index}: ${quadrupleToString(quad)}`);
  });
}