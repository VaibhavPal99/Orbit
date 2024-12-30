"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplySchema = exports.PostSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.PostSchema = zod_1.default.object({
    postedBy: zod_1.default.string(),
    text: zod_1.default.string().optional(),
    img: zod_1.default.string().optional(),
});
exports.ReplySchema = zod_1.default.object({
    text: zod_1.default.string(),
});
