import { Router } from "express";
import TeamController from "../controllers/TeamController";

const routes = Router();

routes.get("/team", TeamController.list);
routes.get("/team/:termo", TeamController.search);
routes.post("/team", TeamController.create);
routes.put("/team", TeamController.update);
routes.delete("/team", TeamController.delete);

export default routes;