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
import { MailService } from 'src/mail/mail.service';
@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(Course) private courseRepository: Repository<Course>,
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
    @InjectRepository(Enrolment)
    private enrolmentRepository: Repository<Enrolment>,
    private readonly mailService: MailService,
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
      const stripePriceId = await this.createProductPrice(
        courseCode,
        unitAmount,
      );

      // let customer: Stripe.Customer;
      // const existingCustomer = await this.stripe.customers.list({
      //   email: studentEmail,
      //   limit: 1,
      // });

      // const customerData = existingCustomer.data;

      // if (customerData.length === 0) {
      //   customer = await this.stristomers.create({
      //     email: studentEmail,
      //   });
      // } else {
      //   customer = customerData[0];
      // }

      // const subscription = await this.stripe.subscriptions.create({
      //   customer: customer.id,
      //   payment_behavior: 'default_incomplete',
      //   items: [{ price: stripePrice.id }],
      // });

      // console.log('inside stripe service (stripe price):', stripePrice);
      const session = await this.stripe.checkout.sessions.create({
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
        payment_method_types: ['card'],

        line_items: [
          {
            price: stripePriceId,
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
      return session;
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error);
      throw new Error(
        `Failed to create Stripe checkout session: ${error.message}`,
      );
    }
  }

  async createProductPrice(course_code: string, coursePrice: number) {
    const stripePrice = await this.stripe.prices.create({
      currency: 'usd',
      unit_amount: coursePrice,
      product_data: {
        name: course_code,
      },
    });
    return stripePrice.id;
  }

  async createSubscriptionSession() {
    try {
      const prod = await this.stripe.products.retrieve('prod_QSfcsNEwlzvdHi');
      console.log('Product:', prod.id, prod.name);
      const price = await this.stripe.prices.retrieve(
        prod.default_price.toString(),
      );
      console.log('Price:', price.id, price.unit_amount);
      const session = await this.stripe.checkout.sessions.create({
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
        payment_method_types: ['card'],
        line_items: [
          {
            price: price.id,
            quantity: 2,
          },
        ],
        mode: 'subscription',
        metadata: {
          eventType: 'Purchase Course',
        },
        subscription_data: {
          // metadata: { course_code, student_email, amount },
        },
      });

      return session.url;
    } catch (error) {
      console.error('Error creating Stripe subscription session:', error);
      throw new Error(
        `Failed to create Stripe subscription session: ${error.message}`,
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
    // const payment = await this.paymentRepository.findOne({
    //   where: {
    //     paymentIntentId: 'pi_3Pb2pDFpHpOCAS9x18HTrq4x',
    //   },
    //   relations: ['student_id', 'course_code'],
    // });
    // console.log('inside webhook , payment:', payment);
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
        console.log(
          'inside payment intent suceeded: payment intent id is:',
          payment_succeeded.id,
        );
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

      case 'customer.subscription.created':
        const subscription_created = event.data.object;
        console.log('subscription created', subscription_created);
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
    //  const alreadySessionCreated=this.paymentRepository.findOne({
    //   where:{
    //     paymentIntentId:session.payment_intent.toString(),
    //     student_id:student,
    //     course_code:course,
    //     status:PaymentStatus.Pending,
    //     id:Not(id)
    //   }
    //  })
    console.log(
      'inside handle checkout session: session.payment_intent is:',
      session.payment_intent.toString(),
    );
    const newPayment = this.paymentRepository.create({
      paymentIntentId: session.payment_intent.toString(),
      student_id: student,
      course_code: course,
      amount: course.price,
      time: new Date(),
      status: PaymentStatus.Pending,
    });
    await this.paymentRepository.save(newPayment);
  }

  async handlePaymentIntentSucceeded(
    paymentIntent_id: string,
    email: string,
    course_code: string,
  ) {
    console.log(
      'inside handle payment intent succeeded: paymentIntent_id is :',
      paymentIntent_id,
    );
    console.log('course_code:', course_code);

    console.log('email:', email);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const payment = await this.paymentRepository.findOne({
      where: {
        paymentIntentId: paymentIntent_id,
      },
      relations: ['student_id', 'course_code'],
    });
    console.log('payment:', payment);
    if (!payment) {
      throw new NotFoundException('Payment Not found');
    }
    payment.status = PaymentStatus.Successful;
    await this.paymentRepository.save(payment);

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
    await this.enrolmentRepository.save(enrolment);
    await this.mailService.sendEnrollmentConfirmation(
      student.email,
      course.coursecode,
    );

    return enrolment;
  }

  async handlePaymentIntentFailed(paymentIntent_id: string) {
    console.log('payment session id:', paymentIntent_id);
    const payment = await this.paymentRepository.findOne({
      where: { paymentIntentId: paymentIntent_id },
    });
    if (!payment) {
      throw new NotFoundException('Payment Not found');
    }
    payment.status = PaymentStatus.Failed;
    await this.paymentRepository.save(payment);
  }
}
