class UsersRepository {
    constructor(dao){
        this.dao = dao;
    }

    createUser = async newUser => await this.dao.create(newUser);

    getUser = async filter => await this.dao.getBy(filter);

    getUsers = async () => await this.dao.get();

    updateUser = async (uid, updateData) => await this.dao.update(uid, updateData);

    deleteUser = async uid => await this.dao.delete(uid);
}

module.exports = {
    UsersRepository
};