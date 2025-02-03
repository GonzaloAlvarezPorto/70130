const chai = require('chai');
const { ProductsDaoMongo } = require('../src/daos/mongo/productsDao.mongo');
const { createHash, isValidPassword } = require('../src/utils/bcrypt');
const UserDTO = require('../src/dto/users.dto');

const expect = chai.expect;

describe('Testing de bcrypt', () => {
    it('La función debe devolver un hasheo efectivo del password', async () => {
        const password = 'ppackk'
        const passwordHash = await createHash(password)

        expect(passwordHash).to.not.equal(password)
    })

    it('La funcion isValidPassword debe poder comparar efectivamente el password hasheado con el password', async ()=>{
        const password = 'ppackk'
        const passwordHash = await createHash(password)

        const passwordValidation = await isValidPassword(passwordHash, password)
        expect(passwordValidation).to.be.equal
    })
    
    it('La funcion debe poder detectar efectivamente si el password hasheado fue alterado', async()=>{
        const password = 'ppackk'
        const passwordHash = await createHash(password);
        const passwordHashAlterado = passwordHash + 'e'

        const passwordValidation = await isValidPassword(passwordHashAlterado, password);
        expect(passwordValidation).to.be.not.equal
    })

})

describe('Testing del DTO de Users', ()=>{
    it('El DTO debe devolver un user con campos de nombre y apellido unificados', ()=>{
        let mockUser = {
            _id: '123',
            first_name: 'Gonzalo',
            last_name: 'Alvarez Porto',
            email: 'gonzaalvarezporto@gmail.com',
            password: 'ppackk',
            age: 25,
            role: 'admin'
        }

        const userDtoResult = new UserDTO(mockUser);
        expect(userDtoResult).to.have.property('full_name', `${mockUser.first_name} ${mockUser.last_name}`)
    })
})