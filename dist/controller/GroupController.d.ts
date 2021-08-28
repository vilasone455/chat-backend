declare class GroupController {
    path: string;
    router: import("express-serve-static-core").Router;
    private conversationRes;
    private memberShipRes;
    private groupRequestRes;
    constructor();
    private initializeRoutes;
    private findMyGroup;
    private findGroup;
    private acceptGroup;
    private inviteGroup;
    private createGroup;
}
export default GroupController;
