import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MockTestInterface from '../components/MockTestInterface';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function MockTestPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [testId, setTestId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTest, setShowTest] = useState(false);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setTestId(id);
      setShowTest(true);
    } else {
      setError('No test ID provided in URL');
    }
  }, [searchParams]);

  const handleClose = () => {
    // Close the window if it was opened via window.open
    if (window.opener) {
      window.close();
    } else {
      // Otherwise navigate to dashboard
      navigate('/');
    }
  };

  const handleTestComplete = () => {
    // Test completed and saved - could show a success message here
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-red-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all font-semibold"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!testId) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img
                src="https://economictimes.indiatimes.com/photo/119331595.cms"
                alt="AI Ready Logo"
                className="h-10 object-contain"
              />
              <span className="text-xl font-bold text-slate-900">Mock Test</span>
            </div>
            <button
              onClick={handleClose}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-semibold">Back to Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      {/* Test Interface */}
      {showTest && (
        <MockTestInterface
          testId={testId}
          onClose={handleClose}
          onTestComplete={handleTestComplete}
        />
      )}
    </div>
  );
}
