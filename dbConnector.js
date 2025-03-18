import mysql from "mysql2"

class DbConnector {
    constructor(host, port, user, password, db) {
        this.connector = mysql.createConnection({
            host: host,
            port: port,
            user: user,
            password: password,
            database: db,
        });
    }

    initDb() {
        const createAuctionsTable = `
            CREATE TABLE IF NOT EXISTS auctions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                date_start DATETIME NOT NULL,
                date_end DATETIME NOT NULL,
                max_price DECIMAL(10,2) NOT NULL
            );
        `;

        const createOffersTable = `
            CREATE TABLE IF NOT EXISTS offers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                author VARCHAR(255) NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                auction_id INT NOT NULL,
                FOREIGN KEY (auction_id) REFERENCES auctions(id) ON DELETE CASCADE
            );
        `;

        this.connector.query(createAuctionsTable, (err) => {
            if (err) console.error("Error creating auctions table: ", err);
        });

        this.connector.query(createOffersTable, (err) => {
            if (err) console.error("Error creating offers table: ", err);
        });

        console.log("Database initialized");
    }

    add_auction(auction, callback) {
        const query = "INSERT INTO auctions (title, date_start, date_end, max_price, description) VALUES (?, ?, ?, ?)";
        const values = [auction.title, auction.date_start, auction.date_end, auction.max_price, auction.description];

        this.connector.query(query, values, (err, result) => {
            if (err) {
                console.error("Error adding auction: ", err);
                callback(err, null);
            } else {
                callback(null, result);
            }
        });
    }

    add_offer(offer, auction_id, callback) {
        const query = "INSERT INTO offers (author, price, auction_id) VALUES (?, ?, ?)";
        const values = [offer.author, offer.price, auction_id];

        this.connector.query(query, values, (err, result) => {
            if (err) {
                console.error("Error adding offer: ", err);
                callback(err, null);
            } else {
                callback(null, result);
            }
        });
    }

    get_auction(id, callback) {
        const query = "SELECT * FROM auctions WHERE id = ?"
        const values = [id]

        this.connector.query(query, values, (err, result) => {
            if (err) {
                console.error("Error retrieving auction: ", err);
                callback(err, null);
            } else {
                callback(null, result);
            }
        });
    }

    get_all_auction_offers(auction_id, callback) {
        const query = "SELECT * FROM offers WHERE auction_id = ?"
        const values = [auction_id]

        this.connector.query(query, values, (err, result) => {
            if (err) {
                console.error("Error retrieving offers: ", err);
                callback(err, null);
            } else {
                callback(null, result);
            }
        });
    }

    get_all_ended_auctions(callback) {
        const query = "SELECT * FROM auctions WHERE date_end < ?"
        const values = [new Date().toISOString().slice(0, 19).replace('T', ' ')]

        this.connector.query(query, values, (err, result) => {
            if (err) {
                console.error("Error retrieving auction: ", err);
                callback(err, null);
            } else {
                callback(null, result);
            }
        });
    }

    get_all_actual_auctions(callback) {
        const query = "SELECT * FROM auctions WHERE date_end > ?"
        const values = [new Date().toISOString().slice(0, 19).replace('T', ' ')]

        this.connector.query(query, values, (err, result) => {
            if (err) {
                console.error("Error retrieving auction: ", err);
                callback(err, null);
            } else {
                callback(null, result);
            }
        });
    }

    closeConnection() {
        this.connector.end((err) => {
            if (err) {
                console.error("Error closing the database connection:", err);
            } else {
                console.log("Database connection closed.");
            }
        });
    }
}

export default DbConnector
