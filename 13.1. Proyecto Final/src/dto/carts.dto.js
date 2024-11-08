class CartsDTO {
    constructor(cart){
        this.id = cart._id;
        this.clientName = cart.clientName;
        this.code = cart.code;
    }
}

module.exports = CartsDTO;