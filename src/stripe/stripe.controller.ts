/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CourseService } from 'src/courses/courses.service';

@Controller('stripe')
export class StripeController {
  constructor(
    private stripeService: StripeService,
    private courseService: CourseService,
  ) {}
  /* 
  @Post('/checkout')
  async Checkout() {
    return this.stripeService.createCheckoutSession();
  } */
}
