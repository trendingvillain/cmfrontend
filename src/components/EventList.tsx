import { Calendar, Edit, Trash2 } from 'lucide-react';
import { adminAPI } from '../api';

interface Event {
  id: number;
  temple_id: number;
  title: string;
  date: string;
  photos_url: string;
  videos_url: string;
  bills_url: string;
  temple_name?: string;
}

interface Temple {
  id: number;
  name: string;
}

interface EventListProps {
  events: Event[];
  temples: Temple[];
  onEdit: (event: Event) => void;
  onRefresh: () => void;
}

export default function EventList({ events, temples, onEdit, onRefresh }: EventListProps) {
  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await adminAPI.deleteEvent(id);
        onRefresh();
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event');
      }
    }
  };

  const getTempleName = (templeId: number) => {
    const temple = temples.find((t) => t.id === templeId);
    return temple?.name || 'Unknown Temple';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <p className="text-xl text-gray-600">No events added yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
            <h3 className="text-xl font-bold mb-2">{event.title}</h3>
            <p className="text-orange-100 text-sm mb-2">
              {event.temple_name || getTempleName(event.temple_id)}
            </p>
            <div className="flex items-center text-orange-100">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{formatDate(event.date)}</span>
            </div>
          </div>
          <div className="p-6">
            <div className="text-sm text-gray-600 mb-4 space-y-1">
              <div className="truncate">
                <span className="font-medium">Photos:</span> {event.photos_url}
              </div>
              <div className="truncate">
                <span className="font-medium">Videos:</span> {event.videos_url}
              </div>
              <div className="truncate">
                <span className="font-medium">Bills:</span> {event.bills_url}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(event)}
                className="flex-1 flex items-center justify-center bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(event.id)}
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
