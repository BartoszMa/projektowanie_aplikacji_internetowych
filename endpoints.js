import express from 'express'
import DbConnector from "./dbConnector.js";
import Handlers from "./handlers.js"

export const router = express.Router();

const dbConnector = new DbConnector("localhost", 3306, "root", "abc", "db");
const handlers = new Handlers(dbConnector);

const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
        .catch(next);
};

router.post("/auctions", asyncHandler(async (req, res) => {
    const auction = req.body;
    const result = await handlers.add_auction_handler(auction);
    res.status(201).json({
        message: "Auction added successfully",
        id: result.insertId
    });
}));

router.post("/auctions/:auctionId/offers", asyncHandler(async (req, res) => {
    const offer = req.body;
    const auctionId = req.params.auctionId;
    const result = await handlers.add_offer_handler(offer, auctionId);
    res.status(201).json({
        message: "Offer added successfully",
        id: result.insertId
    });
}));

router.get("/auctions/:auctionId", asyncHandler(async (req, res) => {
    const auctionId = req.params.auctionId;
    const auction = await handlers.get_auction_handler(auctionId);
    if (!auction) {
        return res.status(404).json({ error: "Auction not found" });
    }
    res.status(200).json(auction);
}));

router.get("/auctions/:auctionId/offers", asyncHandler(async (req, res) => {
    const auctionId = req.params.auctionId;
    const offers = await handlers.get_all_auction_offers_handler(auctionId);
    res.status(200).json(offers);
}));

router.get("/auctions/ended", asyncHandler(async (req, res) => {
    const auctions = await handlers.get_all_ended_auctions_handler();
    res.status(200).json(auctions);
}));

router.get("/auctions/active", asyncHandler(async (req, res) => {
    const auctions = await handlers.get_all_actual_auctions_handler();
    res.status(200).json(auctions);
}));

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});
