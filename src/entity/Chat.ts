import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, ManyToOne} from "typeorm";
import { Conversation } from "./Conversation";
import { User } from "./User";

@Entity()
export class Chat {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=>Conversation)
    conversation: Conversation;

    @Column({default : ""})
    msg : string

    @ManyToOne(()=>User)
    sender: User;

    @CreateDateColumn()
    createDate: Date;
}