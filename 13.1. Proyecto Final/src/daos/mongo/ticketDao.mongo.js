const { ticketModel } = require("./models/ticket.model");

class TicketDaoMongo {
    constructor(){
        this.model = ticketModel;
    }

    create = async newTicket => await this.model.create(newTicket);
}

module.exports = {
    TicketDaoMongo
};