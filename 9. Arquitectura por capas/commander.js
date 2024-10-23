const { Command } = require('commander');

const program = new Command ();

program
    .option('-d', 'Variables para debug', false)
    .option('-p <port>', 'Puerto del servidor', 4000)
    .option('--mode <mode>', 'Especificar el entorno de ejecución de nuestro servidor', 'development')
    .option('-u, --user <user>', 'Usuario del proceso')
    .option('-l, --letter [letter...]', 'specify letter')
program.parse();

console.log('Option: ', program.opts())
console.log('Argumentos: ', program.args)

// node commander.js -d -p 3000 --mode production -u root --letter a b c
// node commander.js -p 8080 -u root 2 a 5 --letter a b c