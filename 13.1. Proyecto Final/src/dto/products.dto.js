class ProductsDTO {
    constructor(product){
        this.id = product._id;
        this.title = product.title;
        this.description = product.description;
        this.code = product.code;
        this.price = product.price;
        this.status = product.status;
        this.stock = product.stock;
        this.category = product.category;
    }
}

module.exports = ProductsDTO;