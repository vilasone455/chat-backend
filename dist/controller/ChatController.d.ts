import Controller from "../interfaces/controller.interface";
declare class ChatController implements Controller {
    path: string;
    router: import("express-serve-static-core").Router;
    private chatRes;
    constructor();
    private initializeRoutes;
    private testcon;
    private getLastMessage;
    private getChatLog;
    private addMessage;
    private allCon;
    private allConversion;
    private allChat;
    private privateChat;
}
export default ChatController;
