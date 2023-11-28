import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) throw new Error('Missing Stripe secret key')

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
})