import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    const registrationId = searchParams.get('registration_id');
    
    if (!paymentId || !registrationId) {
      setError('Invalid payment details');
      setLoading(false);
      return;
    }

    fetchRegistrationDetails(registrationId);
  }, [searchParams]);

  const fetchRegistrationDetails = async (registrationId) => {
    try {
      const response = await api.get(`/registrations/${registrationId}`);
      setPaymentData(response.data.data);
      toast.success('Payment successful! You are registered for the event.');
    } catch (error) {
      console.error('Fetch registration error:', error);
      setError(error.response?.data?.message || 'Failed to fetch payment details');
      toast.error('Failed to fetch payment details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light via-white to-accent-light flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent mb-4"></div>
          <p className="text-primary-dark font-medium">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light via-white to-accent-light flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-primary/10 shadow-subtle p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-primary-dark mb-2">Payment Verification Failed</h1>
          <p className="text-primary-dark/70 mb-6">{error}</p>
          <Link
            to="/events"
            className="inline-block px-6 py-3 bg-accent text-white hover:bg-accent/90 rounded-xl transition-all duration-200 font-semibold"
          >
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-accent-light py-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-2xl border border-primary/10 shadow-subtle overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-white/90">You're all set for the event</p>
          </div>

          {/* Payment Details */}
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-primary-dark mb-4">Event Details</h2>
              <div className="bg-light rounded-xl p-6 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-primary-dark/70">Event</span>
                  <span className="font-semibold text-primary-dark text-right">{paymentData?.registration?.event?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-dark/70">Date</span>
                  <span className="font-semibold text-primary-dark">
                    {new Date(paymentData?.registration?.event?.startDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-dark/70">Location</span>
                  <span className="font-semibold text-primary-dark">
                    {paymentData?.registration?.event?.location?.type === 'online' 
                      ? 'Online Event' 
                      : paymentData?.registration?.event?.location?.venue}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-primary-dark mb-4">Payment Summary</h2>
              <div className="bg-light rounded-xl p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-primary-dark/70">Amount Paid</span>
                  <span className="font-semibold text-primary-dark">
                    ₹{paymentData?.registration?.paymentAmount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-dark/70">Payment Status</span>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold capitalize">
                    {paymentData?.registration?.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-dark/70">Payment ID</span>
                  <span className="font-mono text-sm text-primary-dark">{searchParams.get('payment_id')?.slice(-12)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to={`/events/${paymentData?.registration?.event?._id}`}
                className="flex-1 px-6 py-3 bg-accent text-white hover:bg-accent/90 rounded-xl transition-all duration-200 font-semibold text-center"
              >
                View Event Details
              </Link>
              <Link
                to="/my-registrations"
                className="flex-1 px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl transition-all duration-200 font-semibold text-center"
              >
                My Registrations
              </Link>
            </div>

            {/* Confirmation Email Notice */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">Confirmation Email Sent</p>
                <p className="text-sm text-blue-700">
                  We've sent a confirmation email to <strong>{paymentData?.registration?.attendee?.email}</strong> with your event details and ticket.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
