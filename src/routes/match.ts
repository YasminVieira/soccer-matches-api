import { Router } from "express";
import MatchController from "../controllers/MatchController";

const routes = Router();

routes.get("/match", MatchController.list);
routes.get("/match/:id", MatchController.search);
routes.post("/match", MatchController.create);
routes.put("/match", MatchController.update);
routes.delete("/match", MatchController.delete);

export default routes;