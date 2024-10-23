const { Command } = require('commander');

const program = new Command();

program
    .option('--mode <mode>', 'Especificar el entorno de ejecución de nuestro servidor', 'development')
program.parse();

module.exports = {
    program
}
// node commander.js -d -p 3000 --mode production -u root --letter a b c
// node commander.js -p 8080 -u root 2 a 5 --letter a b c