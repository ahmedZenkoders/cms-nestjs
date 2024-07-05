/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  RawBodyRequest,
  Request,
  Headers,
  Body,
} from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post('/webhook')
  async handleWebhook(
    @Request() { rawBody }: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    await this.stripeService.webhook(rawBody, signature);
  }

  @Post('create-checkout-session')
  async createCheckoutSession(
    @Body('courseCode') courseCode: string,
    @Body('studentEmail') studentEmail: string,
    @Body('unitAmount') unitAmount: number,
  ) {
    try {
      const session = await this.stripeService.createCheckoutSession(
        courseCode,
        studentEmail,
        unitAmount,
      );
      return { sessionId: session.id };
    } catch (error) {
      throw error;
    }
  }
}
