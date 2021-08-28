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
let Friend = class Friend {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Friend.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User),
    __metadata("design:type", User_1.User)
], Friend.prototype, "follower", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User),
    __metadata("design:type", User_1.User)
], Friend.prototype, "following", void 0);
__decorate([
    typeorm_1.Column({ default: 1 }),
    __metadata("design:type", Number)
], Friend.prototype, "friendType", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Friend.prototype, "createDate", void 0);
Friend = __decorate([
    typeorm_1.Entity()
], Friend);
exports.Friend = Friend;
//# sourceMappingURL=Friend.js.map