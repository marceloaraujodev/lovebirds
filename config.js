// config.js
import dotenv from 'dotenv';

dotenv.config();

// Set up MODE (default to production if not explicitly set)
const MODE = process.env.NODE_ENV === 'development' ? 'dev' : 'production';

// Define reusable variables based on MODE
const siteUrl = MODE === 'dev' ? 'http://localhost:3000' : 'https://www.qrcodelove.com';


// Stripe configuration based on environment
const stripeSecretKey = MODE === 'dev' 
  ? process.env.STRIPE_SECRET_KEY
  : process.env.STRIPE_LIVE_SECRET_KEY;

const stripeWebhookSecret = MODE === 'dev' 
  ? process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET 
  : process.env.STRIPE_LIVE_WEBHOOK_ENDPOINT_SECRET;

export { MODE, siteUrl, stripeSecretKey, stripeWebhookSecret };
