"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stripe_1 = __importDefault(require("stripe"));
const secret_key = "sk_test_51OtIvaFORGuFh6IZ488rjT7rHk1EZ7S1ddJCEj57g1fDkeHGcNB2VBEA9b5A82teh1rhqzYhrKYFxIiS5n4eqKwD00bCturkYt";
const router = (0, express_1.Router)();
router.get("/customer/:id", async (req, res) => {
    try {
        const customerId = req.params.id;
        const stripe = new stripe_1.default(secret_key, {
            apiVersion: "2023-10-16"
        });
        const customer = await stripe.customers.retrieve(customerId);
        res.status(200).json({ customer });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post("/", async (req, res) => {
    const { amount } = req.body;
    const stripe = new stripe_1.default(secret_key, {
        apiVersion: "2023-10-16",
        typescript: true,
    });
    try {
        const customers = await stripe.customers.list();
        const customer = customers.data[0];
        if (!customer) {
            return res.status(400).json({ error: "No customers found" });
        }
        const ephemeralKey = await stripe.ephemeralKeys.create({
            customer: customer.id,
        }, {
            apiVersion: '2023-10-16',
        });
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            customer: customer.id,
            payment_method_types: ["card"],
        });
        const setupIntents = await stripe.setupIntents.create({
            customer: customer.id,
            payment_method_types: ["card"],
        });
        res.status(200).json({
            paymentIntent: paymentIntent.client_secret,
            ephemeralKey: ephemeralKey.secret,
            customer: customer.id,
            setupIntents: setupIntents.client_secret
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
