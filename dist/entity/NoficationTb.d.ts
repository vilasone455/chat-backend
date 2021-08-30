import { User } from "./User";
export declare class NoficationTb {
    id: number;
    msg: string;
    sender: User;
    recipient: User;
    noficationType: number;
    createDate: Date;
}
export declare enum NoficationType {
    SendFriendRequest = 1,
    AcceptFriendRequest = 2,
    RejectFriendRequest = 3,
    SendGroupRequest = 4,
    AcceptGroupRequest = 5,
    RejectGroupRequest = 6
}
export declare const sendNofication: (sender: User, recipient: User, type: NoficationType) => Promise<NoficationTb>;
