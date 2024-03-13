"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: mongoose_1.default.Schema.Types.String,
        required: true,
    },
    email: {
        type: mongoose_1.default.Schema.Types.String,
        required: true,
    },
    password: {
        type: mongoose_1.default.Schema.Types.String,
        required: true,
    },
    phone: {
        type: mongoose_1.default.Schema.Types.String,
        required: true,
    },
    img: {
        type: mongoose_1.default.Schema.Types.String,
    },
    stripeCustomerId: {
        type: mongoose_1.default.Schema.Types.String,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.default = mongoose_1.default.model('User', userSchema);
