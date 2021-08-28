import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, ManyToOne} from "typeorm";

import { Conversation } from "./Conversation";
import { User } from "./User";

@Entity()
export class GroupRequest {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=>User)
    sender : User;

    @ManyToOne(()=>User)
    recipient : User;

    @ManyToOne(()=>Conversation)
    conversation : Conversation;

    @Column({default : 1})
    status : number

    @CreateDateColumn()
    createDate: Date;
}