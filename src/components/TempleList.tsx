import { MapPin, Edit, Trash2 } from 'lucide-react';
import { adminAPI } from '../api';

interface Temple {
  id: number;
  name: string;
  location: string;
  image_url: string;
  description: string;
}

interface TempleListProps {
  temples: Temple[];
  onEdit: (temple: Temple) => void;
  onRefresh: () => void;
}

export default function TempleList({ temples, onEdit, onRefresh }: TempleListProps) {
  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this temple?')) {
      try {
        await adminAPI.deleteTemple(id);
        onRefresh();
      } catch (error) {
        console.error('Error deleting temple:', error);
        alert('Failed to delete temple');
      }
    }
  };

  if (temples.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <p className="text-xl text-gray-600">No temples added yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {temples.map((temple) => (
        <div key={temple.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-48 overflow-hidden bg-gradient-to-br from-orange-200 to-red-200">
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">{temple.name}</h3>
            <div className="flex items-center text-gray-600 mb-3">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{temple.location}</span>
            </div>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {temple.description}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(temple)}
                className="flex-1 flex items-center justify-center bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(temple.id)}
                className="flex-1 flex items-center justify-center bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
