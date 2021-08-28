import { User } from "./User";
export declare class FriendRequest {
    id: number;
    sender: User;
    recipient: User;
    status: number;
    createDate: Date;
}
