const { Router } = require('express');
const productsManagerMongo = require('../daos/mongo/productsManager.mongo.js')

const router = Router();

router.get('/', (req,res) => {
    res.render('index')
})

module.exports = router;