import mysql from "mysql2/promise";

class DbConnector {
    constructor(host, port, user, password, db) {
        this.pool = mysql.createPool({
            host: host,
            port: port,
            user: user,
            password: password,
            database: db,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        this.pool.getConnection()
            .then(conn => {
                console.log("Connected to database:", db);
                conn.release();
            })
            .catch(err => {
                console.error("Database connection failed:", err);
            });
    }

    async initDb() {
        try {
            await this.pool.query(`
                CREATE TABLE IF NOT EXISTS auctions (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    date_start DATETIME NOT NULL,
                    date_end DATETIME NOT NULL,
                    max_price DECIMAL(10,2) NOT NULL,
                    description TEXT
                );
            `);

            await this.pool.query(`
                CREATE TABLE IF NOT EXISTS offers (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    author VARCHAR(255) NOT NULL,
                    price DECIMAL(10,2) NOT NULL,
                    auction_id INT NOT NULL,
                    FOREIGN KEY (auction_id) REFERENCES auctions(id) ON DELETE CASCADE
                );
            `);

            console.log("Database initialized");
        } catch (err) {
            console.error("Database initialization failed:", err);
        }
    }

    async add_auction(auction) {
        try {
            const [result] = await this.pool.query(
                "INSERT INTO auctions (title, date_start, date_end, max_price, description) VALUES (?, ?, ?, ?, ?)",
                [auction.title, auction.date_start, auction.date_end, auction.max_price, auction.description]
            );
            return result;
        } catch (err) {
            console.error("Error adding auction:", err);
            throw err;
        }
    }

    async add_offer(offer, auction_id) {
        try {
            const [result] = await this.pool.query(
                "INSERT INTO offers (author, price, auction_id) VALUES (?, ?, ?)",
                [offer.author, offer.price, auction_id]
            );
            return result;
        } catch (err) {
            console.error("Error adding offer:", err);
            throw err;
        }
    }

    async get_auction(id) {
        try {
            const [rows] = await this.pool.query(
                "SELECT * FROM auctions WHERE id = ?",
                [id]
            );
            return rows.length ? rows[0] : null;
        } catch (err) {
            console.error("Error retrieving auction:", err);
            throw err;
        }
    }

    async get_all_auction_offers(auction_id) {
        try {
            const [rows] = await this.pool.query(
                "SELECT * FROM offers WHERE auction_id = ?",
                [auction_id]
            );
            return rows;
        } catch (err) {
            console.error("Error retrieving offers:", err);
            throw err;
        }
    }

    async get_all_ended_auctions() {
        try {
            const [rows] = await this.pool.query(
                "SELECT * FROM auctions WHERE date_end < ?",
                [new Date().toISOString().slice(0, 19).replace('T', ' ')]
            );
            return rows;
        } catch (err) {
            console.error("Error retrieving ended auctions:", err);
            throw err;
        }
    }

    async get_all_actual_auctions() {
        try {
            const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const [rows] = await this.pool.query(
                "SELECT * FROM auctions WHERE date_start <= ? AND date_end >= ?",
                [currentDate, currentDate]
            );
            return rows;
        } catch (err) {
            console.error("Error retrieving active auctions:", err);
            throw err;
        }
    }
}

export default DbConnector;
