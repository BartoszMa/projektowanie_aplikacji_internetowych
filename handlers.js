class Handlers {
    constructor(db_connector) {
        this.db_connector = db_connector
    }

    async add_auction_handler(auction) {
        return await this.db_connector.add_auction(auction, (err, result) => {
            if (err) console.error(err);
            else console.log(result);
        })
    }

    async add_offer_handler(offer, auction_id) {
        return await this.db_connector.add_offer(offer, auction_id, (err, result) => {
            if (err) console.error(err);
            else console.log(result);
        })
    }

    async get_auction_handler(auction_id) {
        return await this.db_connector.get_auction(auction_id, (err, result) => {
            if (err) console.error(err);
            else console.log(result);
        })
    }

    async get_all_auction_offers_handler(auction_id) {
        return await this.db_connector.get_all_auction_offers(auction_id, (err, result) => {
            if (err) console.error(err);
            else console.log(result);
        })
    }

    async get_all_ended_auctions_handler() {
        return await this.db_connector.get_all_ended_auctions((err, result) => {
            if (err) console.error(err);
            else console.log(result);
        })
    }

    async get_all_actual_auctions_handler() {
        return await this.db_connector.get_all_actual_auctions((err, result) => {
            if (err) console.error(err);
            else console.log(result);
        })
    }
}

export default Handlers
