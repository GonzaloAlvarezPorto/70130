process.on('message', message => {
    console.log('message');
    let result = 0
    for (let i = 0; i < 3e3; i++) {
        result += i;
    }

    process.send(result);
})