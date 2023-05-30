import { Router, Request, Response } from "express";
import team from './team';
import match from "./match";

const routes = Router();

routes.use(team);
routes.use(match);

routes.use( (req:Request,res:Response) => res.json({error:"Requisição desconhecida"}) );

export default routes;
