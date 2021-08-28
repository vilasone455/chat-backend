import { Group } from "./Group";
import { MemberShip } from "./MemberShip";
import { User } from "./User";
export declare class Conversation {
    id: number;
    title: string;
    createDate: Date;
    conversationType: number;
    memberships: MemberShip[];
    group: Group;
    members: User[];
}
