import express from 'express'
import bodyParser from "express";
import {router} from "./endpoints.js";

const app = express()
const port = 3000

app.use(bodyParser.json());
app.use("/api", router)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
