import { useState } from 'react';
import { X, Plus, Edit2, Trash2, Save } from 'lucide-react';

interface Module {
  id: string;
  title: string;
  duration: string;
  description: string;
  topics: string[];
  pdfUrl: string;
}

interface CourseEditorProps {
  module?: Module;
  onClose: () => void;
  onSave: (module: Module) => void;
}

export default function CourseEditor({ module, onClose, onSave }: CourseEditorProps) {
  const [editedModule, setEditedModule] = useState<Module>(
    module || {
      id: '',
      title: '',
      duration: '',
      description: '',
      topics: [''],
      pdfUrl: ''
    }
  );

  const isNewModule = !module;

  const handleAddTopic = () => {
    setEditedModule({
      ...editedModule,
      topics: [...editedModule.topics, '']
    });
  };

  const handleRemoveTopic = (index: number) => {
    setEditedModule({
      ...editedModule,
      topics: editedModule.topics.filter((_, i) => i !== index)
    });
  };

  const handleTopicChange = (index: number, value: string) => {
    const newTopics = [...editedModule.topics];
    newTopics[index] = value;
    setEditedModule({
      ...editedModule,
      topics: newTopics
    });
  };

  const handleSave = () => {
    // Generate ID if new module
    if (isNewModule) {
      const newId = (Math.max(...[1, 2, 3, 4, 5]) + 1).toString();
      onSave({ ...editedModule, id: newId });
    } else {
      onSave(editedModule);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-red-600 p-6 text-white relative sticky top-0 z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold">
            {isNewModule ? 'Add New Module' : 'Edit Module'}
          </h2>
          <p className="text-white/90 mt-1">
            {isNewModule ? 'Create a new course module' : 'Update module details'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Module Title */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Module Title *
            </label>
            <input
              type="text"
              value={editedModule.title}
              onChange={(e) => setEditedModule({ ...editedModule, title: e.target.value })}
              placeholder="e.g., Introduction to AI"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
              required
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Duration *
            </label>
            <input
              type="text"
              value={editedModule.duration}
              onChange={(e) => setEditedModule({ ...editedModule, duration: e.target.value })}
              placeholder="e.g., 2 hours"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Description *
            </label>
            <textarea
              value={editedModule.description}
              onChange={(e) => setEditedModule({ ...editedModule, description: e.target.value })}
              placeholder="Provide a brief description of the module..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
              required
            />
          </div>

          {/* Topics */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-slate-700">
                Topics Covered *
              </label>
              <button
                onClick={handleAddTopic}
                className="flex items-center space-x-1 text-purple-600 hover:text-purple-800 font-semibold text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Topic</span>
              </button>
            </div>
            <div className="space-y-3">
              {editedModule.topics.map((topic, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => handleTopicChange(index, e.target.value)}
                    placeholder={`Topic ${index + 1}`}
                    className="flex-1 px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                  {editedModule.topics.length > 1 && (
                    <button
                      onClick={() => handleRemoveTopic(index)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* PDF URL */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              PDF URL *
            </label>
            <input
              type="text"
              value={editedModule.pdfUrl}
              onChange={(e) => setEditedModule({ ...editedModule, pdfUrl: e.target.value })}
              placeholder="/curriculum/module-x.pdf"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              Provide the relative or absolute URL to the PDF document
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 bg-slate-50 flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 border-2 border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100 transition-all font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-red-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all font-semibold"
          >
            <Save className="w-4 h-4" />
            <span>{isNewModule ? 'Create Module' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
