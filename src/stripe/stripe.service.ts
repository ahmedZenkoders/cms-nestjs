/* eslint-disable prettier/prettier */
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  RawBodyRequest,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from 'src/courses/entities/course';
import { Student } from 'src/students/entities/student';
import Stripe from 'stripe';
import { Payment } from 'src/payment/entities/payment';
import { PaymentStatus } from 'src/enum/payment.enum';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(Course) private courseRepository: Repository<Course>,
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
  ) {
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

  async webhook(
    payload: RawBodyRequest<Request>['rawBody'],
    signature: string,
  ) {
    if (!signature) {
      console.log(`Signature:  ${signature}`);
      throw new HttpException(
        'Missing Stripe-signature header ',
        HttpStatus.BAD_REQUEST,
      );
    }
    const webhook_secret =
      'whsec_bdd405c8bb6c745f10c9f4fb9dc52c38399e6f1211907408024829403d0d3c0d';
    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhook_secret,
    );
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await this.handleCheckoutSessionCompleted(session);
        break;
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('payment_intent ', paymentIntent);
        await this.handlePaymentIntentSucceeded(paymentIntent);
        break;
      case 'payment_intent.payment_failed':
        const paymentFailed = event.data.object as Stripe.PaymentIntent;
        console.log('payment_failed ', paymentFailed);
        await this.handlePaymentIntentFailed(paymentFailed);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    return { received: true };
  }

  async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const course_code = session.metadata.course_id;
    console.log('course_code:', course_code);
    const email = session.metadata.studentId;
    console.log('email:', email);
    const course = await this.courseRepository.findOne({
      where: { coursecode: course_code },
    });
    const student = await this.studentRepository.findOneBy({ email });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const newPayment = this.paymentRepository.create({
      student_id: student,
      course_code: course,
      amount: course.price,
      time: new Date(),
      status: PaymentStatus.Pending,
    });
    await this.paymentRepository.save(newPayment);
  }

  async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    const paymentId = parseInt(paymentIntent.id, 10);
    console.log('payment id:', paymentId);
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });
    if (!payment) {
      throw new NotFoundException('Payment Not found');
    }
    payment.status = PaymentStatus.Successful;
    await this.paymentRepository.save(payment);
  }

  async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
    const paymentId = parseInt(paymentIntent.id, 10);
    console.log('payment id:', paymentId);
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });
    if (!payment) {
      throw new NotFoundException('Payment Not found');
    }
    payment.status = PaymentStatus.Failed;
    await this.paymentRepository.save(payment);
  }
}
