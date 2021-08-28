import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, ManyToOne} from "typeorm";
import { Conversation } from "./Conversation";
import { User } from "./User";

@Entity()
export class Friend {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=>User)
    follower: User;

    @ManyToOne(()=>User)
    following: User;

    @Column({default : 1})
    friendType : number

    @CreateDateColumn()
    createDate : Date;
}