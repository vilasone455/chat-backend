import { Conversation } from "./Conversation";
import { User } from "./User";
export declare class GroupRequest {
    id: number;
    sender: User;
    recipient: User;
    conversation: Conversation;
    status: number;
    createDate: Date;
}
