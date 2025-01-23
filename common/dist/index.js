"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessageSchema = exports.ReplySchema = exports.PostSchema = exports.UpdateUserSchema = exports.LoginUserSchema = exports.SignupUserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
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
    name: zod_1.default.string().min(3).max(40),
    username: zod_1.default.string().min(3).max(20),
    password: zod_1.default.string().min(6).max(20),
    email: zod_1.default.string().email(),
    bio: zod_1.default.string().max(50).optional().nullable(),
    profilePic: zod_1.default.string().optional().nullable(),
});
exports.PostSchema = zod_1.default.object({
    postedBy: zod_1.default.string(),
    text: zod_1.default.string().optional(),
    img: zod_1.default.string().optional(),
});
exports.ReplySchema = zod_1.default.object({
    text: zod_1.default.string(),
});
exports.SendMessageSchema = zod_1.default.object({
    recipientId: zod_1.default.string(),
    message: zod_1.default.string(),
    img: zod_1.default.string().optional(),
});
