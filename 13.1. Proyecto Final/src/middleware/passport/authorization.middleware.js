const authorization = role => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).send({ error: 'Unauthorized' });
        }
        
        // Verificar si el rol del usuario está en la lista de roles permitidos
        if (req.user.role !== role) {
            return res.status(403).send({ error: `Not enough permissions for ${req.user.role}s` });
        }
        
        next();
    }
}

module.exports = {
    authorization
}
