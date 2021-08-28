import { Conversation } from "./Conversation";
import { User } from "./User";
export declare class Chat {
    id: number;
    conversation: Conversation;
    msg: string;
    sender: User;
    createDate: Date;
}
