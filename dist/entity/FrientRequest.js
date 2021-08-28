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
let FriendRequest = class FriendRequest {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], FriendRequest.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User),
    __metadata("design:type", User_1.User)
], FriendRequest.prototype, "sender", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User),
    __metadata("design:type", User_1.User)
], FriendRequest.prototype, "recipient", void 0);
__decorate([
    typeorm_1.Column({ default: 1 }),
    __metadata("design:type", Number)
], FriendRequest.prototype, "status", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], FriendRequest.prototype, "createDate", void 0);
FriendRequest = __decorate([
    typeorm_1.Entity()
], FriendRequest);
exports.FriendRequest = FriendRequest;
//# sourceMappingURL=FrientRequest.js.map