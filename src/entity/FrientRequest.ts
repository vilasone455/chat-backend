import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, ManyToOne} from "typeorm";
import { User } from "./User";

@Entity()
export class FriendRequest {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=>User)
    sender : User;

    @ManyToOne(()=>User)
    recipient : User;

    @Column({default : 1})
    status : number

    @CreateDateColumn()
    createDate: Date;
}