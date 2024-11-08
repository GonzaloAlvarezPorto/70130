class ProductsRepository {
    constructor(dao){
        this.dao = dao;
    }

    createProduct = async newProduct => await this.dao.create(newProduct);

    getProduct = async filter => await this.dao.getBy(filter);

    getProducts = async () => await this.dao.get();

    updateProduct = async (pid, updateData) => await this.dao.update(pid, updateData);

    deleteProduct = async pid => await this.dao.delete(pid);
}

module.exports = {
    ProductsRepository
}