import express from 'express'
import {router} from "./model/endpoints.js";
import path from "path";

const app = express()
const port = 3000

app.use(express.static(path.join(path.resolve(), 'public')));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", router)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
