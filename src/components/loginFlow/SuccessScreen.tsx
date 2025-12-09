import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessScreenProps {
  onContinue: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ onContinue }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Success!
        </h2>
        <p className="text-gray-600 mb-8">
          You have successfully signed in to your account.
        </p>

        <button
          onClick={onContinue}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

