class TicketRepository {
    constructor(dao){
        this.dao = dao;
    }

    createTicket = async newTicket => await this.dao.create(newTicket);
}

module.exports = {
    TicketRepository
};