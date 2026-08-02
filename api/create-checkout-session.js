// Vercel serverless function — runs on the server, so it's safe to use
// the Stripe SECRET key here (never expose that key in frontend code).
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { userId, email } = req.body

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: { userId },
      success_url: `${process.env.PUBLIC_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.PUBLIC_URL}/dashboard`,
    })

    res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe session error:', err)
    res.status(500).json({ error: err.message })
  }
}
