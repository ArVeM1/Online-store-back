import express from "express";
import * as dotenv from "dotenv";
import db from "./db.js";
import cors from "cors";
import {router} from "./routes/index.js";
import fileUpload from "express-fileupload"
import {
    User,
    Basket,
    BasketDevice,
    Device,
    Type,
    Brand,
    Rating,
    DeviceInfo,
    TypeBrand,
} from "./models/models.js";
import ErrorHandlingMiddleware from "./middleware/ErrorHandlingMiddleware.js";
import * as path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PORT = process.env.PORT || 7777;

const app = express();
app.use(cors())
app.use(express.json())
app.use(fileUpload({}))
app.use(express.static(path.resolve(__dirname, 'static')))
app.use("/api", router)

app.use(ErrorHandlingMiddleware)

const start = async () => {
    try {
        await db.authenticate()
        await db.sync()
        app.listen(PORT, () => {
            console.log(`Server start on port ${PORT}`);
        })
    } catch (e) {
        console.log(e)
    }
}

start();

