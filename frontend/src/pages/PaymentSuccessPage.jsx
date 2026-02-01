import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const toastShown = useRef(false);
  
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

    // Set basic payment data from URL params
    setPaymentData({
      _id: registrationId,
      paymentId: paymentId
    });
    setLoading(false);
    
    // Show toast only once
    if (!toastShown.current) {
      toast.success('Payment successful! You are registered for the event.');
      toastShown.current = true;
    }
  }, [searchParams]);

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
              <h2 className="text-xl font-bold text-primary-dark mb-4">Payment Summary</h2>
              <div className="bg-light rounded-xl p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-primary-dark/70">Payment Status</span>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    Completed
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-dark/70">Payment ID</span>
                  <span className="font-mono text-sm text-primary-dark">{searchParams.get('payment_id')?.slice(-12) || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-dark/70">Registration ID</span>
                  <span className="font-mono text-sm text-primary-dark">{searchParams.get('registration_id')?.slice(-12) || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/events"
                className="flex-1 px-6 py-3 bg-accent text-white hover:bg-accent/90 rounded-xl transition-all duration-200 font-semibold text-center"
              >
                Browse Events
              </Link>
              <Link
                to="/my-registrations"
                className="flex-1 px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl transition-all duration-200 font-semibold text-center"
              >
                My Registrations
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
