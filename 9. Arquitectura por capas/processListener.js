process.on('exit', code => {
    console.log('Evento que se ejecuta antes de salir del proceso: ',code);
})

process.on('uncaughtException', exception => {
    console.log('Captura todos los errores no controlados, algo mal escrito o que no esté definido: ',exception)
})

console.lohg()
console.log('Ejecutando alguna sentencia')