const { connect } = require("mongoose")

class MongoSingleton {
    static #instance
    constructor(){
        connect('mongodb+srv://gonzaalvarezporto:3498mate@cluster0.gdlaf.mongodb.net/c70130?retryWrites=true&w=majority')
    }

    static getInstance(){
        if(this.#instance){
            console.log('base de datos ya conectada')
            return this.#instance
        }
        this.#instance = new MongoSingleton()
        console.log('base de datos conectada')
        return this.#instance
    }
}

module.exports = {
    MongoSingleton
}