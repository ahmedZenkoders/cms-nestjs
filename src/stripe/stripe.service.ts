/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(
      'sk_test_51PYqQ5FpHpOCAS9xeV35PK6tZtFwCi6miuhS5HNOaRcH0XF6K2S5f5jp3KVm0zfMVm7FWy6ILYCVhZg0Acrte9Sd00fMM2OvXK',
      {
        apiVersion: '2024-06-20',
      },
    );
  }

  async createCheckoutSession(
    courseCode: string,
    studentEmail: string,
    unitAmount: number,
  ) {
    try {
      const stripePrice = await this.stripe.prices.create({
        currency: 'usd',
        unit_amount: unitAmount,
        product_data: {
          name: 'Course Purchase',
          metadata: {
            course_id: courseCode,
            studentId: studentEmail,
          },
        },
      });

      const session = await this.stripe.checkout.sessions.create({
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
        payment_method_types: ['card'],
        line_items: [
          {
            price: stripePrice.id,
            quantity: 1,
          },
        ],
        mode: 'payment',
      });

      return session;
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error);
      throw new Error(
        `Failed to create Stripe checkout session: ${error.message}`,
      );
    }
  }
}
