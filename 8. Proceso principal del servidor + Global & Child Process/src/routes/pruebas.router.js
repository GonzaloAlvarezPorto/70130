//Esto lo creamos con el profe
const { Router } = require('express')
const { fork } = require('node:child_process')

const router = Router();

// function operacionCompleja() {
//     let result = 0
//     for (let i = 0; i < 1e1; i++) {
//         result += i;
//     }

//     return result;
// }

router.get('/compleja', (req, res) => {
    const child = fork('./src/routes/operacionCompleja.js');
    child.send('inicializá el cálculo');
    child.on('message', data => {
        res.send({ data })
    })
    // const suma = operacionCompleja();
    // res.send({ suma });
})

router.get('/simple', (req, res) => {
    res.send('simple')
})

// //probando cookies

// // router.get('/setcookie', (req, res) => {
// //     res.cookie('coderCookie', 'Esta es una cookie muy poderosa', {maxAge: 1000000}).send('setcookie');
// // })

// router.get('/setcookiesigned', (req, res) => {
//     res.cookie('coderCookie', 'Esta es una cookie muy poderosa', { maxAge: 1000000, signed: true }).send('setcookie');
// })

// // router.get('/getcookie', (req, res) => {
// //     res.send(req.cookies)
// // })

// router.get('/getcookie', (req, res) => {
//     res.send(req.signedCookies)
// })

// router.get('/deletecookie', (req, res) => {
//     res.clearCookie('coderCookie').send('Cookie borrada')
// })

// //probando session

// router.get('/session', (req, res) => {
//     if (req.session.counter) {
//         req.session.counter++;
//         res.send(`Se ha visitado el sitio ${req.session.counter} veces`)
//     }
//     else {
//         req.session.counter = 1;
//         res.send('Bienvenidos');
//     }
// })

// router.get('/logout', (req, res) => {
//     req.session.destroy(error => {
//         if (error) return res.send({ status: 'error', error })
//     })
//     res.send('logout')

// })


module.exports = router;