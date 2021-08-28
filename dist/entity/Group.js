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
var Visible;
(function (Visible) {
    Visible[Visible["Private"] = 1] = "Private";
    Visible[Visible["Public"] = 2] = "Public";
})(Visible = exports.Visible || (exports.Visible = {}));
let Group = class Group {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Group.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Group.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Group.prototype, "image", void 0);
__decorate([
    typeorm_1.Column({ default: 1 }),
    __metadata("design:type", Number)
], Group.prototype, "groupVisible", void 0);
Group = __decorate([
    typeorm_1.Entity()
], Group);
exports.Group = Group;
//# sourceMappingURL=Group.js.map