import AppDataSource from "../data-source";
import { Request, Response } from 'express';
import { Team } from "../entities/Teams";
import { Like } from "typeorm";

class TeamController {  

  public async list(req: Request, res: Response): Promise<Response> {
    const repo = AppDataSource.getRepository(Team);

    const times = await repo.find({
      order: {
          name: 'asc'
      }
    });

    return res.json(times);
  }

  public async search(req: Request, res: Response): Promise<Response> {
    const termo = req.params.termo as string

    const repo = AppDataSource.getRepository(Team);

    const times = await repo.find({
      where: { name: Like(`%${termo}%`) },
      order: {
          name: 'asc'
      }
    });

    return res.json(times);
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { name } = req.body;
    
    if (!name || name.trim() === "") {
      return res.json({ error: "O nome do time é obrigatório!" });
    }

    const obj = new Team();
    obj.name = name;
    
    const time: any = await AppDataSource.manager.save(Team, obj).catch((e) => {
      
      if (e.message === "SQLITE_CONSTRAINT: UNIQUE constraint failed: teams.name") {
        return { error: 'O nome já existe!' };
      }

      return { error: e.message };

    })
    
    return res.json(time);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id, name } = req.body;

    if (!id || id === 0) {
      return res.json({ error: "O id do time é obrigatório!" });
    }

    if (!name || name.trim() === "") {
      return res.json({ error: "O nome do time é obrigatório!" });
    }

    const time: any = await AppDataSource.manager.findOneBy(Team, { id })

    if(!time) {
      return res.json({ error: 'Time não encontrado!' });
    }

    time.name = name;
      
    const timeEditado = await AppDataSource.manager.save(Team, time).catch((e) => {
      
      if (e.message === "SQLITE_CONSTRAINT: UNIQUE constraint failed: teams.name") {
        return { error: 'O nome já existe!' };
      }

      return { error: e.message };

    })

    return res.json(timeEditado);
  }

  public async delete(req: Request, res: Response): Promise<Response> {    
    const { id } = req.body;
    
    const r = await AppDataSource
      .createQueryBuilder()
      .delete()
      .from(Team)
      .where("id=:id", { id })
      .execute()

    return res.json(r)
  }

}

export default new TeamController();