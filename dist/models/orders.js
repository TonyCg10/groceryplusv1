"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            productId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: mongoose_1.default.Schema.Types.Number,
                default: 1,
            },
        },
    ],
    issuedDate: {
        type: mongoose_1.default.Schema.Types.Date,
        required: true,
    },
    hours: {
        type: mongoose_1.default.Schema.Types.String,
        required: true,
    },
    status: {
        type: mongoose_1.default.Schema.Types.String,
        enum: ['ongoing', 'completed', 'cancelled'],
        default: 'pending',
    },
}, {
    timestamps: true,
    versionKey: false,
});
orderSchema.pre('find', function (next) {
    this.populate('products.productId');
    next();
});
exports.default = mongoose_1.default.model('Order', orderSchema);
