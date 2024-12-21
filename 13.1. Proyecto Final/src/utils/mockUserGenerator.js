const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

function generateMockUsers(count) {
    const users = [];

    for (let i = 0; i < count; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email(firstName, lastName);
        const age = faker.number.int({ min: 18, max: 99 });
        const password = bcrypt.hashSync('coder123', 10);
        const role = faker.helpers.arrayElement(['user', 'admin']);

        users.push({
            firstName,
            lastName,
            email,
            age,
            password,
            role,
        });
    }

    return users;
}

module.exports = generateMockUsers;
