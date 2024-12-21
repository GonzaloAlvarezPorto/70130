const { Router } = require("express");
const generateMockUsers = require("../utils/mockUserGenerator");
const { userModel } = require("../daos/mongo/models/users.model");

const router = Router();

router.get('/mockingusers', (req, res) => {
    const mockUsers = generateMockUsers(50);
    res.status(200).json(mockUsers);
});

router.post('/generateData', async (req, res) => {
    const { users } = req.body;

    if (typeof users !== 'number' || users <= 0) {
        return res.status(400).json({ error: 'Debe proporcionar un número válido de usuarios.' });
    }

    try {
        const mockUsers = generateMockUsers(users);

        const usersToInsert = mockUsers.map(user => ({
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            age: user.age,
            password: user.password,
            role: user.role
        }));

        await userModel.insertMany(usersToInsert);

        return res.status(200).json({
            message: `${users} usuarios generados e insertados correctamente en la base de datos.`,
            users: usersToInsert
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Ocurrió un error al insertar los usuarios en la base de datos.' });
    }
});

module.exports = router;