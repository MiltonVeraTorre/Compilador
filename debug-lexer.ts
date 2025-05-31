import { babyDuckLexer } from './src/index';

// Programa de prueba simple
const testProgram = `program main_simple;
var
  x: int;
main {
  x = 10;
}
end`;

console.log('🔍 Programa de prueba:');
console.log(testProgram);
console.log('\n📝 Tokens generados:');

const lexResult = babyDuckLexer.tokenize(testProgram);

if (lexResult.errors.length > 0) {
  console.error('❌ Errores léxicos:', lexResult.errors);
} else {
  console.log('✅ Tokenización exitosa');
}

lexResult.tokens.forEach((token, index) => {
  console.log(`${index}: ${token.tokenType.name} = "${token.image}"`);
});
