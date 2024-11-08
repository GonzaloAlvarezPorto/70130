const Ticket = require("./models/ticket.model");

class TicketDaoMongo {
    constructor(){
        this.model = Ticket;
    }

    create = async newTicket => await this.model.create(newTicket);
}

module.exports = {
    TicketDaoMongo
};