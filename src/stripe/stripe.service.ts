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
import { Enrolment } from 'src/enrolment/entities/enrolment';
import { EnrolmentStatus } from 'src/enum/enrolment.enum';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(Course) private courseRepository: Repository<Course>,
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
    @InjectRepository(Enrolment)
    private enrolmentRepository: Repository<Enrolment>,
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
      const product = await this.stripe.products.create({
        name: 'Course Purchase',
        metadata: {
          course_id: courseCode,
          studentId: studentEmail,
        },
      });
      // console.log('inside stripe service (product): ', product);
      const stripePrice = await this.stripe.prices.create({
        currency: 'usd',
        unit_amount: unitAmount,
        product: product.id,
      });
      // console.log('inside stripe service (stripe price):', stripePrice);
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
        metadata: {
          course_id: courseCode,
          studentId: studentEmail,
        },
        payment_intent_data: {
          metadata: { course_code: courseCode, student_email: studentEmail },
        },
      });
      // console.log('inside strip service (create checkout session):', session);
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
  ): Promise<{ recieved: boolean }> {
    // console.log('Inside service', payload);
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
    // console.log('event: ', event.type);
    switch (event.type) {
      case 'checkout.session.completed':
        // console.log('inside session.completed:');
        const session = event.data.object;
        await this.handleCheckoutSessionCompleted(session);
        break;
      case 'payment_intent.succeeded':
        const payment_succeeded = event.data.object;
        const course_metadata = payment_succeeded.metadata.course_code;
        const student_metadata = payment_succeeded.metadata.student_email;
        console.log('inside payment intent suceeded: ', payment_succeeded);
        console.log('course metadata: ', course_metadata);
        console.log('student metadata: ', student_metadata);
        await this.handlePaymentIntentSucceeded(
          payment_succeeded.id,
          student_metadata,
          course_metadata,
        );
        break;

      case 'payment_intent.payment_failed':
        const payment_failed = event.data.object.id;

        console.log('payment_intent payment_failed:', payment_failed);
        await this.handlePaymentIntentFailed(payment_failed);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return;
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
      sessionId: session.id,
      student_id: student,
      course_code: course,
      amount: course.price,
      time: new Date(),
      status: PaymentStatus.Pending,
    });
    await this.paymentRepository.save(newPayment);
  }

  async handlePaymentIntentSucceeded(
    session_id: string,
    email: string,
    course_code: string,
  ) {
    console.log('inside handle payment intent succeeded:');
    const payment = await this.paymentRepository.findOne({
      where: { sessionId: session_id },
    });
    console.log('payment:', payment);
    if (!payment) {
      throw new NotFoundException('Payment Not found');
    }
    payment.status = PaymentStatus.Successful;
    await this.paymentRepository.save(payment);

    console.log('course_code:', course_code);

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
    const enrolment = this.enrolmentRepository.create({
      course_code: course,
      student_id: student,
      status: EnrolmentStatus.active,
      created_at: new Date(),
    });
    return this.enrolmentRepository.save(enrolment);
  }

  async handlePaymentIntentFailed(sessionId: string) {
    console.log('payment session id:', sessionId);
    const payment = await this.paymentRepository.findOne({
      where: { sessionId },
    });
    if (!payment) {
      throw new NotFoundException('Payment Not found');
    }
    payment.status = PaymentStatus.Failed;
    await this.paymentRepository.save(payment);
  }
}
