/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  RawBodyRequest,
  Headers,
  Body,
  Req,
} from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post('/webhook')
  async webhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ): Promise<{ recieved: boolean }> {
    // console.log("Raw Body",req)
    return await this.stripeService.webhook(req.rawBody, signature);
  }

  // @Post('/webhook-endpoint')
  // async createEndpoint(
  // ) {
  //   return await this.stripeService.webhookEndpoint();
  // }

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
      return { url: session.url };
    } catch (error) {
      throw error;
    }
  }

  @Post('/subscription/session')
  async subscriptionCheckoutSession() {
    try {
      const session = await this.stripeService.createSubscriptionSession();
      return { session: session };
    } catch (error) {
      throw error;
    }
  }
}
