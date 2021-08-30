"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
let NoficationTb = class NoficationTb {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], NoficationTb.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], NoficationTb.prototype, "msg", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User),
    __metadata("design:type", User_1.User)
], NoficationTb.prototype, "sender", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User),
    __metadata("design:type", User_1.User)
], NoficationTb.prototype, "recipient", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], NoficationTb.prototype, "noficationType", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], NoficationTb.prototype, "createDate", void 0);
NoficationTb = __decorate([
    typeorm_1.Entity()
], NoficationTb);
exports.NoficationTb = NoficationTb;
var NoficationType;
(function (NoficationType) {
    NoficationType[NoficationType["SendFriendRequest"] = 1] = "SendFriendRequest";
    NoficationType[NoficationType["AcceptFriendRequest"] = 2] = "AcceptFriendRequest";
    NoficationType[NoficationType["RejectFriendRequest"] = 3] = "RejectFriendRequest";
    NoficationType[NoficationType["SendGroupRequest"] = 4] = "SendGroupRequest";
    NoficationType[NoficationType["AcceptGroupRequest"] = 5] = "AcceptGroupRequest";
    NoficationType[NoficationType["RejectGroupRequest"] = 6] = "RejectGroupRequest";
})(NoficationType = exports.NoficationType || (exports.NoficationType = {}));
exports.sendNofication = async (sender, recipient, type) => {
    const nofiRes = typeorm_1.getRepository(NoficationTb);
    let add = new NoficationTb();
    add.noficationType = type;
    add.sender = sender;
    add.recipient = recipient;
    return await nofiRes.save(add);
};
//# sourceMappingURL=NoficationTb.js.map