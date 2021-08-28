import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({default : ""})
    firstName: string;

    @Column({default : ""})
    lastName: string;

    @Column({default : ""})
    userEmail: string;

    @Column({default : ""})
    userPassword: string;

    @Column({default : ""})
    image : string

    
}