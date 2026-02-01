import { Link, useSearchParams } from 'react-router-dom';

const PaymentCancelPage = () => {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('event_id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-accent-light flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-primary/10 shadow-subtle overflow-hidden">
        {/* Cancel Header */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Payment Cancelled</h1>
          <p className="text-white/90">Your payment was not completed</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-primary-dark/70 mb-6 text-center">
            You cancelled the payment process. No charges were made to your account.
          </p>

          <div className="space-y-3">
            {eventId && (
              <Link
                to={`/events/${eventId}`}
                className="block w-full px-6 py-3 bg-accent text-white hover:bg-accent/90 rounded-xl transition-all duration-200 font-semibold text-center"
              >
                Back to Event
              </Link>
            )}
            <Link
              to="/events"
              className="block w-full px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl transition-all duration-200 font-semibold text-center"
            >
              Browse Events
            </Link>
          </div>

          {/* Help Section */}
          <div className="mt-6 p-4 bg-light rounded-xl">
            <h3 className="font-semibold text-primary-dark mb-2">Need Help?</h3>
            <p className="text-sm text-primary-dark/70 mb-3">
              If you experienced any issues during checkout, please contact our support team.
            </p>
            <Link
              to="/contact"
              className="text-accent hover:text-accent/80 font-medium text-sm"
            >
              Contact Support →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
