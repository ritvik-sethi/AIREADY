import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { PaymentPlan } from '../../utils/paymentUtils';

interface PlanSelectionScreenProps {
  plans: PaymentPlan[];
  onPlanSelect: (plan: PaymentPlan) => void;
  isLoading?: boolean;
}

export const PlanSelectionScreen: React.FC<PlanSelectionScreenProps> = ({
  plans,
  onPlanSelect,
  isLoading = false,
}) => {
  const formatPrice = (price?: number, currency: string = 'INR') => {
    if (!price) return 'Free';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatPeriod = (period?: string, unit?: string) => {
    if (!period || !unit) return '';
    return `${period} ${unit}${period === '1' ? '' : 's'}`;
  };

  return (
    <div className="flex flex-col min-h-[400px] p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choose Your Plan
        </h2>
        <p className="text-gray-600">
          Select a subscription plan to continue
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {plans.map((plan, index) => (
          <div
            key={plan.planCode || index}
            className={`relative border-2 rounded-lg p-5 cursor-pointer transition-all hover:shadow-lg ${
              plan.flatDiscount
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-300 hover:border-blue-500'
            }`}
            onClick={() => !isLoading && onPlanSelect(plan)}
          >
            {plan.flatDiscount && (
              <div className="absolute top-0 right-0 bg-purple-600 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-xs font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {plan.flatDiscount} OFF
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {plan.planName || plan.planCode}
              </h3>
              {plan.recurring && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {plan.recurring === 'true' ? 'Recurring' : 'One-time'}
                </span>
              )}
            </div>

            <div className="mb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(plan.finalPlanPrice, plan.currency)}
                </span>
                {plan.planPeriod && plan.planPeriodUnit && (
                  <span className="text-sm text-gray-500">
                    / {formatPeriod(plan.planPeriod, plan.planPeriodUnit)}
                  </span>
                )}
              </div>
              {plan.dealCode && (
                <p className="text-xs text-green-600 mt-1">
                  Deal Code: {plan.dealCode}
                </p>
              )}
            </div>

            <button
              className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors ${
                plan.flatDiscount
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                plan.flatDiscount
                  ? 'focus:ring-purple-500'
                  : 'focus:ring-blue-500'
              } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              disabled={isLoading}
              onClick={(e) => {
                e.stopPropagation();
                if (!isLoading) {
                  onPlanSelect(plan);
                }
              }}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Select Plan
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {plans.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No plans available at the moment.
        </div>
      )}
    </div>
  );
};

