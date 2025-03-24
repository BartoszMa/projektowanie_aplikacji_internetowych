import express from 'express'
import DbConnector from "./dbConnector.js";
import Handlers from "./handlers.js"
import {Auction, Offer} from "./models.js";

export const router = express.Router();

const dbConnector = new DbConnector("localhost", 3306, "root", "abc", "db");
const handlers = new Handlers(dbConnector);

const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
        .catch(next);
};

router.get("/", (req, res) => {
    res.render("main");
});

router.get("/auctions/active", asyncHandler(async (req, res) => {
    const auctions = await handlers.get_all_actual_auctions_handler();
    res.render("activeAuctions", { auctions });
}));

router.get("/auctions/ended", asyncHandler(async (req, res) => {
    const auctions = await handlers.get_all_ended_auctions_handler();
    res.render("endedAuctions", { auctions });
}));

router.get("/auctions/:auctionId", asyncHandler(async (req, res) => {
    const auctionId = req.params.auctionId;
    const auction = await handlers.get_auction_handler(auctionId);
    const offers = await handlers.get_all_auction_offers_handler(auctionId);
    if (!auction) {
        return res.status(404).send("Auction not found");
    }
    res.render("auctionDetail", { auction, offers });
}));

router.get("/add-auction", (req, res) => {
    res.render("addAuction");
});

router.post("/auctions", asyncHandler(async (req, res) => {
    const { title, date_start, date_end, max_price, description } = req.body;
    const auction = new Auction(title, date_start, date_end, max_price, description);

    await handlers.add_auction_handler(auction);
    res.redirect("/auctions/active");
}));

router.get("/auctions/:auctionId/add-offer", (req, res) => {
    res.render("addOffer", { auctionId: req.params.auctionId });
});

router.post("/auctions/:auctionId/offers", asyncHandler(async (req, res) => {
    const { author, amount } = req.body;
    const auctionId = req.params.auctionId;

    const offer = new Offer(author, amount, auctionId)

    await handlers.add_offer_handler(offer);
    res.redirect(`/auctions/${auctionId}`);
}));

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});
