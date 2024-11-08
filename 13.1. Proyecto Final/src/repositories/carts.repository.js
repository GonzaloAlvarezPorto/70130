class CartsRepository {
    constructor(dao) {
        this.dao = dao; 
    }

    createCart = async newCart => await this.dao.create(newCart);

    getCart = async filter => await this.dao.getBy(filter);

    getCarts = async () => await this.dao.get();

    updateCart = async (cid, updateData) => await this.dao.update(cid, updateData);

    deleteCart = async cid => await this.dao.delete(cid);

}

module.exports = {
    CartsRepository
};
