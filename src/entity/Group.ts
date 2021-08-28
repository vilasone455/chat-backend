import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, JoinTable, OneToMany, ManyToOne} from "typeorm";


export enum Visible{
    Private = 1,
    Public = 2
}

@Entity()
export class Group {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({default : ""})
    title: string;

    @Column({default : ""})
    image: string;

    @Column({default : 1})
    groupVisible : number

}