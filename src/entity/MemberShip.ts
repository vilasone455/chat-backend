import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, ManyToOne} from "typeorm";
import { Conversation } from "./Conversation";
import { User } from "./User";

@Entity()
export class MemberShip {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=>Conversation , c=>c.memberships)
    conversation: Conversation;

    @ManyToOne(()=>User)
    user: User;

    @Column({default : 1})
    memberRole: number;
}