import { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { templeAPI } from '../api';
import { useNavigate } from 'react-router-dom';

interface Temple {
  id: number;
  name: string;
  location: string;
  image_url: string;
  description: string;
}

export default function HomePage() {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemples();
  }, []);

  const fetchTemples = async () => {
    try {
      const response = await templeAPI.getAll();
      setTemples(response.data.temples);
    } catch (error) {
      console.error('Error fetching temples:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemples = temples.filter((temple) =>
    temple.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    temple.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Mukkani Devasthanam Portal
          </h1>
          <p className="text-xl text-gray-600">
            Explore Sacred Temples and Their Celebrations
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search Temple Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-lg shadow-lg"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemples.map((temple) => (
              <div
                key={temple.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="h-56 overflow-hidden bg-gradient-to-br from-orange-200 to-red-200">
                  <img
                    src={temple.image_url}
                    alt={temple.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {temple.name}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2 text-orange-500" />
                    <span>{temple.location}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/temple/${temple.id}`)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-md"
                  >
                    View Temple
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredTemples.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No temples found</p>
          </div>
        )}
      </div>
    </div>
  );
}
