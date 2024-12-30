"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserSchema = exports.LoginUserSchema = exports.SignupUserSchema = exports.SearchUserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.SearchUserSchema = zod_1.default.object({
    filter: zod_1.default.string().optional(),
});
exports.SignupUserSchema = zod_1.default.object({
    name: zod_1.default.string().min(3).max(40),
    username: zod_1.default.string().min(3).max(20),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6).max(20),
});
exports.LoginUserSchema = zod_1.default.object({
    username: zod_1.default.string().min(3).max(20),
    password: zod_1.default.string().min(6).max(20),
});
exports.UpdateUserSchema = zod_1.default.object({
    name: zod_1.default.string().min(3).max(40).optional(),
    username: zod_1.default.string().min(3).max(20).optional(),
    password: zod_1.default.string().min(6).max(20).optional().or(zod_1.default.literal("")),
    email: zod_1.default.string().email().optional(),
    bio: zod_1.default.string().max(50).optional().nullable(),
    profilePic: zod_1.default.string().optional().nullable(),
});
