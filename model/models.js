class Auction {
    constructor(title, date_start, date_end, max_price, description) {
        this.title = title
        this.date_start = date_start
        this.date_end = date_end
        this.max_price = max_price
        this.description = description
    }
}

class Offer {
    constructor(author, price, auction_id) {
        this.author = author
        this.price = price
        this.auction_id = auction_id
    }
}

export {Auction, Offer}
