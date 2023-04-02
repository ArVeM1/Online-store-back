import {Router} from "express";
import typeController from "../controllers/typeController.js";
import checkRoleMiddleware from "../middleware/checkRoleMiddleware.js";

export const typeRouter = new Router()

typeRouter.post("/", checkRoleMiddleware("ADMIN"), typeController.create)
typeRouter.get("/", typeController.getAll)