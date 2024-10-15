//Esto está hecho en clase con el profe

const Router = require('express');
const { userModel } = require('../models/users.model.js');
const { authTokenMiddleware } = require('../utils/jsonwebtoken.js');
// import express from 'express';

const router = Router();
//configuramos los endpoints (rutas de acción en el servidor)

const middl = (req, res, next) => {
    console.log('middleware')
    next()
}

//configuramos metodos
// traer todos los usuarios
router.get('/', authTokenMiddleware, async (req, res) => {
    try {
        const users = await userModel.find();
        res.send({ status: 'success', data: users });
    } catch (error) {
        console.log(error)
    }
})

router.post('/', async (req, res) => {
    try {

        const { first_name, last_name, email } = req.body;

        if (!email) {
            return res.send({ status: 'error', error: 'Faltan llenar campos' })
        }

        const result = await userModel.create({ first_name, last_name, email })
        res.send({ status: 'success', data: result })

    } catch (error) {
        console.log(error)
    }
})

router.get('/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await userModel.findOne({_id : uid})
        res.send({status: 'success', data: user})
    } catch (error) {
        console.log(error)
    }
})

router.put('/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        const { first_name, last_name, email } = req.body;

        const userToUpdate = {
            first_name,
            last_name,
            email
        }

        const result = await userModel.findByIdAndUpdate({_id: uid}, userToUpdate)
        
        res.send({status:'success', data: result})
    } catch (error) {
        console.log(error)
    }
})

router.delete('/:uid', async (req, res) => {
    try {
        const {uid} = req.params;
        const result = await userModel.findByIdAndDelete({_id: uid})
        res.send({status: 'success', data: result})
    } catch (error) {
        console.log(error)
    }
})

// export default router;
module.exports = router;