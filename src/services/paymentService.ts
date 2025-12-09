// Razorpay Payment Integration Service

export interface PaymentDetails {
  orderId: string;
  amount: number;
  currency: string;
  courseName: string;
  userEmail: string;
  userName: string;
  userPhone: string;
}

export interface CoursePrice {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
}

// Available courses with prices
export const COURSES: CoursePrice[] = [
  {
    id: 'ai-technical',
    name: 'AI Ready Technical Track',
    price: 4999,
    currency: 'INR',
    description: 'Comprehensive AI technical certification for developers and engineers'
  },
  {
    id: 'ai-business',
    name: 'AI Ready Business Track',
    price: 3999,
    currency: 'INR',
    description: 'AI literacy and strategy for business professionals'
  },
  {
    id: 'ai-marketing',
    name: 'AI Ready Marketing Track',
    price: 3499,
    currency: 'INR',
    description: 'AI applications in marketing and customer engagement'
  },
  {
    id: 'ai-complete',
    name: 'AI Ready Complete Bundle',
    price: 9999,
    currency: 'INR',
    description: 'All-inclusive AI certification across all tracks'
  }
];

class PaymentService {
  private razorpayKeyId = 'rzp_test_YOUR_KEY_ID'; // Replace with actual Razorpay key

  // Initialize Razorpay script
  loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  // Create Razorpay order
  async createOrder(courseId: string, userDetails: { name: string; email: string; phone: string }): Promise<PaymentDetails> {
    const course = COURSES.find(c => c.id === courseId);

    if (!course) {
      throw new Error('Course not found');
    }

    // In production, this should call your backend API to create a Razorpay order
    // For now, we'll simulate it
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      orderId,
      amount: course.price,
      currency: course.currency,
      courseName: course.name,
      userEmail: userDetails.email,
      userName: userDetails.name,
      userPhone: userDetails.phone
    };
  }

  // Process Razorpay payment
  async processPayment(paymentDetails: PaymentDetails): Promise<{ success: boolean; paymentId?: string; error?: string }> {
    const isScriptLoaded = await this.loadRazorpayScript();

    if (!isScriptLoaded) {
      return { success: false, error: 'Failed to load payment gateway' };
    }

    return new Promise((resolve) => {
      const options = {
        key: this.razorpayKeyId,
        amount: paymentDetails.amount * 100, // Amount in paise
        currency: paymentDetails.currency,
        name: 'ET AI Ready',
        description: paymentDetails.courseName,
        order_id: paymentDetails.orderId,
        prefill: {
          name: paymentDetails.userName,
          email: paymentDetails.userEmail,
          contact: paymentDetails.userPhone
        },
        theme: {
          color: '#9333ea' // Purple theme
        },
        handler: function (response: any) {
          resolve({
            success: true,
            paymentId: response.razorpay_payment_id
          });
        },
        modal: {
          ondismiss: function () {
            resolve({
              success: false,
              error: 'Payment cancelled by user'
            });
          }
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    });
  }

  // Verify payment (should be done on backend)
  async verifyPayment(paymentId: string, orderId: string): Promise<boolean> {
    // In production, this should call your backend API to verify the payment
    // For now, we'll simulate successful verification
    return true;
  }

  getCourseById(courseId: string): CoursePrice | undefined {
    return COURSES.find(c => c.id === courseId);
  }

  getAllCourses(): CoursePrice[] {
    return COURSES;
  }
}

export const paymentService = new PaymentService();
