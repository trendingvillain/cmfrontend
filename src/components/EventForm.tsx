import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { adminAPI } from '../api';

interface Event {
  id: number;
  temple_id: number;
  title: string;
  date: string;
  photos_url: string;
  videos_url: string;
  bills_url: string;
}

interface Temple {
  id: number;
  name: string;
  location: string;
  image_url: string;
  description: string;
}

interface EventFormProps {
  event: Event | null;
  temples: Temple[];
  onClose: () => void;
}

export default function EventForm({ event, temples, onClose }: EventFormProps) {
  const [formData, setFormData] = useState({
    temple_id: '',
    title: '',
    date: '',
    photos_url: '',
    videos_url: '',
    bills_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (event) {
      setFormData({
        temple_id: event.temple_id.toString(),
        title: event.title,
        date: new Date(event.date).toISOString().split('T')[0],
        photos_url: event.photos_url,
        videos_url: event.videos_url,
        bills_url: event.bills_url,
      });
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        temple_id: Number(formData.temple_id),
      };

      if (event) {
        await adminAPI.updateEvent(event.id, payload);
      } else {
        await adminAPI.addEvent(payload);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            {event ? 'Edit Event' : 'Add New Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temple
            </label>
            <select
              value={formData.temple_id}
              onChange={(e) => setFormData({ ...formData, temple_id: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              required
            >
              <option value="">Select a temple</option>
              {temples.map((temple) => (
                <option key={temple.id} value={temple.id}>
                  {temple.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="e.g., Panguni Uthiram 2025"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos URL (Google Drive)
            </label>
            <input
              type="url"
              value={formData.photos_url}
              onChange={(e) => setFormData({ ...formData, photos_url: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="https://drive.google.com/folder/photos"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Videos URL (Google Drive)
            </label>
            <input
              type="url"
              value={formData.videos_url}
              onChange={(e) => setFormData({ ...formData, videos_url: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="https://drive.google.com/folder/videos"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bills URL (Google Drive)
            </label>
            <input
              type="url"
              value={formData.bills_url}
              onChange={(e) => setFormData({ ...formData, bills_url: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="https://drive.google.com/folder/bills"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : event ? 'Update Event' : 'Add Event'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
