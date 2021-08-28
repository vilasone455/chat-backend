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
const Group_1 = require("./Group");
const MemberShip_1 = require("./MemberShip");
const User_1 = require("./User");
let Conversation = class Conversation {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Conversation.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Conversation.prototype, "title", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Conversation.prototype, "createDate", void 0);
__decorate([
    typeorm_1.Column({ default: 1 }),
    __metadata("design:type", Number)
], Conversation.prototype, "conversationType", void 0);
__decorate([
    typeorm_1.OneToMany(() => MemberShip_1.MemberShip, m => m.conversation),
    __metadata("design:type", Array)
], Conversation.prototype, "memberships", void 0);
__decorate([
    typeorm_1.OneToOne(() => Group_1.Group),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Group_1.Group)
], Conversation.prototype, "group", void 0);
__decorate([
    typeorm_1.ManyToMany(() => User_1.User),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Conversation.prototype, "members", void 0);
Conversation = __decorate([
    typeorm_1.Entity()
], Conversation);
exports.Conversation = Conversation;
//# sourceMappingURL=Conversation.js.map