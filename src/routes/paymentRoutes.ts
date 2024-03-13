import { Request, Response, Router } from "express";

import Stripe from "stripe";

const secret_key =
  "sk_test_51OtIvaFORGuFh6IZ488rjT7rHk1EZ7S1ddJCEj57g1fDkeHGcNB2VBEA9b5A82teh1rhqzYhrKYFxIiS5n4eqKwD00bCturkYt";

const router = Router();

router.get("/customer/:id", async (req: Request, res: Response) => {
  try {
    const customerId = req.params.id;
    const stripe = new Stripe(secret_key, {
      apiVersion: "2023-10-16"
    });

    const customer = await stripe.customers.retrieve(customerId);

    res.status(200).json({ customer });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const {amount} = req.body
  const stripe = new Stripe(secret_key as string, {
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


    res.status(200).json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
