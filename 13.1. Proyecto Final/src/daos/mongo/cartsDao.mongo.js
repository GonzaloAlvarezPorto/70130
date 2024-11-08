const { cartModel } = require("./models/carts.model");
const { productModel } = require("./models/products.model");

class CartsDaoMongo {
    constructor(){
        this.model = cartModel;
        this.productModel = productModel;
    }

    create = async newCart => await this.model.create(newCart);

    getBy = async filter => await this.model.findOne(filter);

    get = async () => await this.model.find({});

    update = async (cid, updateData) => await this.model.findByIdAndUpdate(cid, updateData);

    delete = async cid => await this.model.findByIdAndDelete(cid);

   
}

module.exports = {
    CartsDaoMongo
};