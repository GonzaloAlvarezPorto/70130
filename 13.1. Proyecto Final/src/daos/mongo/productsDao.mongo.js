const { productModel } = require("./models/products.model");

class ProductsDaoMongo {
    constructor() {
        this.model = productModel;
    }

    create = async newProduct => await this.model.create(newProduct);

    getBy = async filter => await this.model.findOne(filter);

    get = async () => await this.model.find();

    update = async (pid, updateData) => await this.model.findByIdAndUpdate(pid, updateData, {new: true });

    delete = async pid => await this.model.findByIdAndDelete(pid);

    getProducts = async (filter, sort, limit, skip) => await this.model.find(filter).sort(sort).limit(limit).skip(skip);
    
}

module.exports = {
    ProductsDaoMongo
};