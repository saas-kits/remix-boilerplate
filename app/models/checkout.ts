import type { Price, User } from "@prisma/client";
import { stripe } from "~/services/stripe/setup.server";

export const createCheckoutSession = async (
    customerId: User["customerId"],
    priceId: Price["stripePriceId"],
    successUrl: string,
    cancelUrl: string
) => {
    const session = await stripe.checkout.sessions.create({
        customer: customerId as string,
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
    });
    return session;
}