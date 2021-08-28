declare class FriendController {
    path: string;
    router: import("express-serve-static-core").Router;
    private friendRequestRes;
    private friendRes;
    constructor();
    private initializeRoutes;
    private allRequest;
    private searchFriend;
    private getNoneFriends;
    private getFriends;
    private rejectRequest;
    private acceptRequest;
    private getFriendRequest;
    private sendFriendRequest;
}
export default FriendController;
