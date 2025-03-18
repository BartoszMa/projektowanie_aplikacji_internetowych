import DbConnector from "./dbConnector.js";

class Handlers {
    constructor(db_connector) {
        this.db_connector = db_connector
    }

    add_auction_handler(auction) {
        this.db_connector.add_auction(auction, (err, result) => {
            if (err) console.error(err);
            else console.log(result);
        })
    }

    add_offer_handler(offer, auction_id) {
        this.db_connector.add_offer(offer, auction_id, (err, result) => {
            if (err) console.error(err);
            else console.log(result);
        })
    }

    get_auction_handler(auction_id) {
        this.db_connector.get_auction(auction_id, (err, result) => {
            if (err) console.error(err);
            else console.log(result);
        })
    }

    get_all_auction_offers_handler(auction_id) {
        this.db_connector.get_all_auction_offers(auction_id, (err, result) => {
            if (err) console.error(err);
            else console.log(result);
        })
    }

    get_all_ended_auctions_handler() {
        this.db_connector.get_all_ended_auctions((err, result) => {
            if (err) console.error(err);
            else console.log(result);
        })
    }

    get_all_actual_auctions_handler() {
        this.db_connector.get_all_actual_auctions((err, result) => {
            if (err) console.error(err);
            else console.log(result);
        })
    }
}