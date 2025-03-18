class Auction {
    constructor(title, date_start, date_end, max_price, description) {
        this.title = title
        this.date_start = date_start
        this.date_end = date_end
        this.max_price = max_price
        this.descritpion = description
    }
}

class Offer {
    constructor(author, price) {
        this.author = author
        this.price = price

    }
}

export {Auction, Offer}
