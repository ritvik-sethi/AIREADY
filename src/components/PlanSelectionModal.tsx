import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setAvailablePlans } from '../store/slices/loginFlowSlice';
import { PaymentPlan, continueToPay } from '../utils/paymentUtils';
import { PlanSelectionScreen } from './loginFlow/PlanSelectionScreen';

interface PlanSelectionModalProps {
  onClose: () => void;
  onPlanSelected?: (plan: PaymentPlan) => void;
}

export default function PlanSelectionModal({ onClose, onPlanSelected }: PlanSelectionModalProps) {
  const dispatch = useAppDispatch();
  const availablePlans = useAppSelector((state) => state.loginFlow.availablePlans);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize default plans if not already set
  useEffect(() => {
    if (availablePlans.length === 0) {
      const defaultPlans: PaymentPlan[] = [
        {
          planCode: 'ET_AI_READY_BASIC',
          planName: 'ET AI Ready Basic',
          flatDiscount: '20%',
          recurring: 'true',
          planPeriod: '1',
          planPeriodUnit: 'month',
          finalPlanPrice: 1999,
          currency: 'INR',
          abTestKey: { set: 'default' },
          checkReferer: false,
        },
        {
          planCode: 'ET_AI_READY_PREMIUM',
          planName: 'ET AI Ready Premium',
          flatDiscount: '25%',
          recurring: 'true',
          planPeriod: '3',
          planPeriodUnit: 'month',
          finalPlanPrice: 4999,
          currency: 'INR',
          abTestKey: { set: 'default' },
          checkReferer: false,
        },
      ];
      dispatch(setAvailablePlans(defaultPlans));
    }
  }, [dispatch, availablePlans.length]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handlePlanSelection = async (plan: PaymentPlan) => {
    setIsSubmitting(true);
    try {
      // Call the onPlanSelected callback if provided
      if (onPlanSelected) {
        await onPlanSelected(plan);
      } else {
        // Default behavior: proceed to payment
        await continueToPay(plan);
      }
      setIsSubmitting(false);
      onClose();
    } catch (error) {
      console.error('Error processing plan selection:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-slate-900">Select Your Plan</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <PlanSelectionScreen
            plans={availablePlans}
            onPlanSelect={handlePlanSelection}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}

