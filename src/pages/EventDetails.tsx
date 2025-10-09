import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, ImageIcon, Video, FileText } from 'lucide-react';
import { eventAPI } from '../api';

interface Event {
  id: number;
  temple_id: number;
  title: string;
  date: string;
  photos_url: string;
  videos_url: string;
  bills_url: string;
}

type TabType = 'photos' | 'videos' | 'bills';

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('photos');

  useEffect(() => {
    if (id) {
      fetchEventData();
    }
  }, [id]);

  const fetchEventData = async () => {
    try {
      const response = await eventAPI.getAll();
      const foundEvent = response.data.events.find((e: Event) => e.id === Number(id));
      setEvent(foundEvent);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const extractGoogleDriveId = (url: string) => {
    const match = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const renderContent = () => {
    if (!event) return null;

    const url = activeTab === 'photos' ? event.photos_url : activeTab === 'videos' ? event.videos_url : event.bills_url;
    const driveId = extractGoogleDriveId(url);

    if (driveId) {
      return (
        <div className="w-full h-[600px] bg-white rounded-xl shadow-lg overflow-hidden">
          <iframe
            src={`https://drive.google.com/embeddedfolderview?id=${driveId}#grid`}
            className="w-full h-full"
            frameBorder="0"
          />
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <div className="mb-4">
          {activeTab === 'photos' && <ImageIcon className="w-16 h-16 mx-auto text-gray-400" />}
          {activeTab === 'videos' && <Video className="w-16 h-16 mx-auto text-gray-400" />}
          {activeTab === 'bills' && <FileText className="w-16 h-16 mx-auto text-gray-400" />}
        </div>
        <p className="text-xl text-gray-600 mb-4">
          {activeTab === 'photos' && 'Photos'}
          {activeTab === 'videos' && 'Videos'}
          {activeTab === 'bills' && 'Bills'}
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-md"
        >
          View in Google Drive
        </a>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Event not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-orange-600 hover:text-orange-700 mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
          <div className="flex items-center text-orange-100">
            <Calendar className="w-6 h-6 mr-2" />
            <span className="text-xl">{formatDate(event.date)}</span>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex space-x-4 bg-white rounded-xl shadow-lg p-2">
            <button
              onClick={() => setActiveTab('photos')}
              className={`flex-1 flex items-center justify-center py-4 px-6 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'photos'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ImageIcon className="w-5 h-5 mr-2" />
              Photos
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex-1 flex items-center justify-center py-4 px-6 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'videos'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Video className="w-5 h-5 mr-2" />
              Videos
            </button>
            <button
              onClick={() => setActiveTab('bills')}
              className={`flex-1 flex items-center justify-center py-4 px-6 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'bills'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-5 h-5 mr-2" />
              Bills
            </button>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}
