import { useState } from 'react';
import { X, Plus, Edit2, Trash2, Save, Clock, Award, HelpCircle } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Test {
  id: string;
  title: string;
  duration: number;
  totalQuestions: number;
  passingScore: number;
  questions: Question[];
}

interface TestEditorProps {
  test?: Test;
  onClose: () => void;
  onSave: (test: Test) => void;
}

export default function TestEditor({ test, onClose, onSave }: TestEditorProps) {
  const [editedTest, setEditedTest] = useState<Test>(
    test || {
      id: '',
      title: '',
      duration: 60,
      totalQuestions: 10,
      passingScore: 70,
      questions: []
    }
  );

  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: 1,
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  });

  const isNewTest = !test;

  const handleAddQuestion = () => {
    if (editingQuestionIndex !== null) {
      // Update existing question
      const newQuestions = [...editedTest.questions];
      newQuestions[editingQuestionIndex] = currentQuestion;
      setEditedTest({
        ...editedTest,
        questions: newQuestions,
        totalQuestions: newQuestions.length
      });
    } else {
      // Add new question
      const newQuestion = {
        ...currentQuestion,
        id: editedTest.questions.length + 1
      };
      setEditedTest({
        ...editedTest,
        questions: [...editedTest.questions, newQuestion],
        totalQuestions: editedTest.questions.length + 1
      });
    }
    // Reset form
    setCurrentQuestion({
      id: editedTest.questions.length + 2,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    });
    setEditingQuestionIndex(null);
  };

  const handleEditQuestion = (index: number) => {
    setCurrentQuestion(editedTest.questions[index]);
    setEditingQuestionIndex(index);
  };

  const handleDeleteQuestion = (index: number) => {
    const newQuestions = editedTest.questions.filter((_, i) => i !== index);
    // Renumber questions
    const renumberedQuestions = newQuestions.map((q, i) => ({
      ...q,
      id: i + 1
    }));
    setEditedTest({
      ...editedTest,
      questions: renumberedQuestions,
      totalQuestions: renumberedQuestions.length
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions
    });
  };

  const handleSave = () => {
    if (isNewTest) {
      // Generate a unique ID based on timestamp and random number
      const newId = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      onSave({ ...editedTest, id: newId });
    } else {
      onSave(editedTest);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-red-600 p-6 text-white relative sticky top-0 z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold">
            {isNewTest ? 'Create New Mock Test' : `Edit ${editedTest.title}`}
          </h2>
          <p className="text-white/90 mt-1">
            Configure test settings and manage questions
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Test Settings */}
          <div className="bg-slate-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Test Settings</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Test Title *
                </label>
                <input
                  type="text"
                  value={editedTest.title}
                  onChange={(e) => setEditedTest({ ...editedTest, title: e.target.value })}
                  placeholder="e.g., Mock Test 3"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Duration (minutes) *</span>
                </label>
                <input
                  type="number"
                  value={editedTest.duration}
                  onChange={(e) => setEditedTest({ ...editedTest, duration: parseInt(e.target.value) })}
                  placeholder="60"
                  min="1"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center space-x-2">
                  <Award className="w-4 h-4" />
                  <span>Passing Score (%) *</span>
                </label>
                <input
                  type="number"
                  value={editedTest.passingScore}
                  onChange={(e) => setEditedTest({ ...editedTest, passingScore: parseInt(e.target.value) })}
                  placeholder="70"
                  min="1"
                  max="100"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Total Questions
                </label>
                <input
                  type="number"
                  value={editedTest.totalQuestions}
                  disabled
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg bg-slate-100 text-slate-600"
                />
                <p className="text-xs text-slate-500 mt-1">Auto-calculated based on added questions</p>
              </div>
            </div>
          </div>

          {/* Question Form */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <HelpCircle className="w-6 h-6 text-blue-600" />
                <span>{editingQuestionIndex !== null ? 'Edit Question' : 'Add New Question'}</span>
              </h3>
              {editingQuestionIndex !== null && (
                <button
                  onClick={() => {
                    setEditingQuestionIndex(null);
                    setCurrentQuestion({
                      id: editedTest.questions.length + 1,
                      question: '',
                      options: ['', '', '', ''],
                      correctAnswer: 0,
                      explanation: ''
                    });
                  }}
                  className="text-slate-600 hover:text-slate-800 text-sm font-semibold"
                >
                  Cancel Edit
                </button>
              )}
            </div>
            <div className="space-y-4">
              {/* Question Text */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Question *
                </label>
                <textarea
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                  placeholder="Enter your question here..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                  required
                />
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Answer Options *
                </label>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={currentQuestion.correctAnswer === index}
                        onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                        className="w-5 h-5 text-green-600"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
                        required
                      />
                      <span className="text-xs text-slate-500 w-20">
                        {currentQuestion.correctAnswer === index && (
                          <span className="text-green-600 font-semibold">✓ Correct</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Select the radio button next to the correct answer
                </p>
              </div>

              {/* Explanation */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Explanation *
                </label>
                <textarea
                  value={currentQuestion.explanation}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
                  placeholder="Provide an explanation for the correct answer..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                  required
                />
              </div>

              <button
                onClick={handleAddQuestion}
                disabled={
                  !currentQuestion.question ||
                  currentQuestion.options.some(o => !o) ||
                  !currentQuestion.explanation
                }
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
                <span>{editingQuestionIndex !== null ? 'Update Question' : 'Add Question to Test'}</span>
              </button>
            </div>
          </div>

          {/* Questions List */}
          {editedTest.questions.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Questions ({editedTest.questions.length})
              </h3>
              <div className="space-y-4">
                {editedTest.questions.map((q, index) => (
                  <div key={q.id} className="bg-white rounded-lg border-2 border-slate-200 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start space-x-3 mb-3">
                          <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {q.id}
                          </span>
                          <p className="font-semibold text-slate-900">{q.question}</p>
                        </div>
                        <div className="ml-11 space-y-2">
                          {q.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-2 rounded-lg text-sm ${
                                q.correctAnswer === optIndex
                                  ? 'bg-green-100 border border-green-300 font-semibold'
                                  : 'bg-slate-50'
                              }`}
                            >
                              {option}
                              {q.correctAnswer === optIndex && (
                                <span className="ml-2 text-green-700">✓ Correct Answer</span>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="ml-11 mt-3 bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                          <p className="text-sm font-semibold text-blue-900 mb-1">Explanation:</p>
                          <p className="text-sm text-blue-800">{q.explanation}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEditQuestion(index)}
                          className="text-blue-600 hover:text-blue-800 p-2"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(index)}
                          className="text-red-600 hover:text-red-800 p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 bg-slate-50 sticky bottom-0 flex justify-between items-center">
          <div className="text-sm text-slate-600">
            {editedTest.questions.length} question{editedTest.questions.length !== 1 ? 's' : ''} added
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100 transition-all font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={editedTest.questions.length === 0 || !editedTest.title}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-red-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{isNewTest ? 'Create Test' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
