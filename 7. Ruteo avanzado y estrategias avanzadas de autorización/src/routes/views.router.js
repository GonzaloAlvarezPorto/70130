const { Router } = require('express');

const router = Router();

router.get('/', (req,res) => {
    res.render('index')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/newpass',(req, res) => {
    res.render('changepass')
})

module.exports = router;