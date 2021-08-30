import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, ManyToOne, getRepository} from "typeorm";

import { User } from "./User";

@Entity()
export class NoficationTb {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({default : ""})
    msg : string

    @ManyToOne(()=>User)
    sender: User;

    @ManyToOne(()=>User)
    recipient: User;

    @Column()
    noficationType : number

    @CreateDateColumn()
    createDate: Date;
}

export enum NoficationType{
    SendFriendRequest = 1,
    AcceptFriendRequest = 2,
    RejectFriendRequest = 3,
    SendGroupRequest = 4,
    AcceptGroupRequest = 5,
    RejectGroupRequest = 6
}

export const sendNofication = async (sender : User , recipient : User , type : NoficationType) => {
    const nofiRes = getRepository(NoficationTb)
    let add = new NoficationTb()
    add.noficationType = type
    add.sender = sender
    add.recipient = recipient
    return await nofiRes.save(add)
}

