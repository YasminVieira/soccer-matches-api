import AppDataSource from "../data-source";
import { Request, Response } from 'express';
import { Match } from '../entities/Matches';
import { Like } from "typeorm";
import { Team } from "../entities/Teams";

class MatchController {
    
    public async list(req: Request, res: Response): Promise<Response> {
        const { limit, offset } = req.body;

        let skip: number = 0;
        let take: number = 5;

        if(offset) skip = offset
        if(limit) take = limit

        const repo = AppDataSource.getRepository(Match);

        const partidas = await repo.find({
            relations: {
                host: true,
                visitor: true
            },
            order: {
                date: 'desc'
            },
            skip: skip,
            take: take
        });

        return res.json(partidas);
    }

    public async search(req: Request, res: Response): Promise<Response> {
        let id = parseInt(req.params.id)

        if(!id) id = 0;

        const repo = AppDataSource.getRepository(Match);

        const partidas = await repo.find({
            relations: {
                host: true,
                visitor: true
            },
            where: [
                {
                    host: {
                        id: id
                    }
                },
                {
                    visitor: {
                        id: id
                    }
                }
            ],
            order: {
                date: 'desc'
            },
        });

        return res.json(partidas);
    }

    public async create(req: Request, res: Response): Promise<Response> {
        const { date, idhost, idvisitor } = req.body;
        
        if (!date || date.trim() === "") {
            return res.json({ error: "A data da partida é obrigatória!" });
        }

        if (!idhost || idhost === 0) {
            return res.json({ error: "O time mandante (host) é obrigatório!" });
        }

        if (!idvisitor || idvisitor === 0) {
            return res.json({ error: "O time visitante (visitor) é obrigatório!" });
        }

        const host: any = await AppDataSource.manager.findOneBy(Team, { id: idhost })

        if(!host) {
            return res.json({ error: 'Mandante (host) não encontrado!' });
        }

        const visitor: any = await AppDataSource.manager.findOneBy(Team, { id: idvisitor })

        if(!visitor) {
            return res.json({ error: 'Visitante (visitor) não encontrado!' });
        }

        const obj = new Match();
        obj.date = date;
        obj.host = host;
        obj.visitor = visitor;
        
        const partida: any = await AppDataSource.manager.save(Match, obj).catch((e) => {
            
            return { error: e.message };

        })
        
        return res.json(partida);
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const { id, date, idhost, idvisitor } = req.body;

        if (!id || id === 0) {
            return res.json({ error: "O id da partida é obrigatório!" });
        }
        
        if (!date || date.trim() === "") {
            return res.json({ error: "A data da partida é obrigatória!" });
        }

        if (!idhost || idhost === 0) {
            return res.json({ error: "O time mandante (host) é obrigatório!" });
        }

        if (!idvisitor || idvisitor === 0) {
            return res.json({ error: "O time visitante (visitor) é obrigatório!" });
        }

        const partida: any = await AppDataSource.manager.findOneBy(Match, { id })

        if(!partida) {
            return res.json({ error: 'Partida não encontrada!' });
        }

        const host: any = await AppDataSource.manager.findOneBy(Team, { id: idhost })

        if(!host) {
            return res.json({ error: 'Mandante (host) não encontrado!' });
        }

        const visitor: any = await AppDataSource.manager.findOneBy(Team, { id: idvisitor })

        if(!visitor) {
            return res.json({ error: 'Visitante (visitor) não encontrado!' });
        }

        partida.date = date;
        partida.host = host;
        partida.visitor = visitor;
        
        const partidaEditada: any = await AppDataSource.manager.save(Match, partida).catch((e) => {
            
            return { error: e.message };

        })
        
        return res.json(partidaEditada);
    }

    public async delete(req: Request, res: Response): Promise<Response> {    
        const { id } = req.body;
        
        const r = await AppDataSource
            .createQueryBuilder()
            .delete()
            .from(Match)
            .where("id=:id", { id })
            .execute()

        return res.json(r)
    }

}

export default new MatchController();