import { User } from "./User";
export declare class Friend {
    id: number;
    follower: User;
    following: User;
    friendType: number;
    createDate: Date;
}
