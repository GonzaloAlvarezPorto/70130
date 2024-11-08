class ProductsDTO {
    constructor(product){
        this.id = product._id;
        this.title = product.title;
        this.category = product.category;
        this.precio = product.precio;
    }
}

module.exports = ProductsDTO;
