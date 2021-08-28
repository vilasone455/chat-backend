import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, JoinTable, OneToMany, OneToOne, JoinColumn} from "typeorm";
import { MemberRole } from "../interfaces/MemberRole";
import { Group } from "./Group";
import { MemberShip } from "./MemberShip";
import { User } from "./User";

@Entity()
export class Conversation {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({default : ""})
    title: string;

    @CreateDateColumn()
    createDate: Date;

    @Column({default : 1})
    conversationType : number

    @OneToMany(()=>MemberShip , m=>m.conversation)
    memberships : MemberShip[]

    @OneToOne(()=>Group)
    @JoinColumn()
    group : Group

    @ManyToMany(() => User)
    @JoinTable()
    members: User[];

}