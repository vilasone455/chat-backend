import Controller from "../interfaces/controller.interface";
declare class NoficationController implements Controller {
    path: string;
    router: import("express-serve-static-core").Router;
    private nofiRes;
    constructor();
    private initializeRoutes;
    private allNofication;
}
export default NoficationController;
