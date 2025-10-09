import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowLeft } from 'lucide-react';
import { templeAPI, eventAPI } from '../api';

interface Temple {
  id: number;
  name: string;
  location: string;
  image_url: string;
  description: string;
}

interface Event {
  id: number;
  temple_id: number;
  title: string;
  date: string;
  photos_url: string;
  videos_url: string;
  bills_url: string;
}

export default function TempleProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [temple, setTemple] = useState<Temple | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchTempleData();
    }
  }, [id]);

  const fetchTempleData = async () => {
    try {
      const [templeRes, eventsRes] = await Promise.all([
        templeAPI.getById(Number(id)),
        eventAPI.getByTemple(Number(id)),
      ]);
      setTemple(templeRes.data.temple);
      setEvents(eventsRes.data.events);
    } catch (error) {
      console.error('Error fetching temple data:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!temple) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Temple not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-orange-600 hover:text-orange-700 mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
          <div className="h-96 overflow-hidden bg-gradient-to-br from-orange-200 to-red-200">
            <img
              src={temple.image_url}
              alt={temple.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg';
              }}
            />
          </div>
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {temple.name}
            </h1>
            <div className="flex items-center text-gray-600 mb-6">
              <MapPin className="w-6 h-6 mr-2 text-orange-500" />
              <span className="text-lg">{temple.location}</span>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              {temple.description}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Upcoming & Past Events
          </h2>
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <p className="text-xl text-gray-600">No events available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span className="text-orange-100">{formatDate(event.date)}</span>
                  </div>
                </div>
                <div className="p-6">
                  <button
                    onClick={() => navigate(`/event/${event.id}`)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-md"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
