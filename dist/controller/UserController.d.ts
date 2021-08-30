import Controller from "../interfaces/controller.interface";
declare class UserController implements Controller {
    path: string;
    router: import("express-serve-static-core").Router;
    private userRes;
    constructor();
    private initializeRoutes;
    private editUser;
    private login;
    private register;
    private allUsers;
    private createToken;
}
export default UserController;
