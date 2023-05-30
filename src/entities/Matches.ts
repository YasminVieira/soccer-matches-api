import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { Team } from "./Teams";

@Entity({ name: "matches" })
export class Match {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false, type:'date', default:()=>"CURRENT_TIMESTAMP"})
    date: Date;

    @ManyToOne((type) => Team, { onDelete: 'CASCADE' })
    
    @JoinColumn({
    name: "idhost",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_host_id"
    })
    host: Team;

    @ManyToOne((type) => Team, { onDelete: 'CASCADE' })
    
    @JoinColumn({
    name: "idvisitor",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fk_visitor_id"
    })
    visitor: Team;
}