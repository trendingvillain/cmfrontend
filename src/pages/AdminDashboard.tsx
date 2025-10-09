import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, Building2, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { templeAPI, eventAPI } from '../api';
import TempleForm from '../components/TempleForm';
import EventForm from '../components/EventForm';
import TempleList from '../components/TempleList';
import EventList from '../components/EventList';

type ViewType = 'temples' | 'events';
type ModalType = 'temple' | 'event' | null;

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
  temple_name?: string;
}

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<ViewType>('temples');
  const [showModal, setShowModal] = useState<ModalType>(null);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [editingItem, setEditingItem] = useState<Temple | Event | null>(null);

  useEffect(() => {
    fetchTemples();
    fetchEvents();
  }, []);

  const fetchTemples = async () => {
    try {
      const response = await templeAPI.getAll();
      setTemples(response.data.temples);
    } catch (error) {
      console.error('Error fetching temples:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await eventAPI.getAll();
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleAddTemple = () => {
    setEditingItem(null);
    setShowModal('temple');
  };

  const handleEditTemple = (temple: Temple) => {
    setEditingItem(temple);
    setShowModal('temple');
  };

  const handleAddEvent = () => {
    setEditingItem(null);
    setShowModal('event');
  };

  const handleEditEvent = (event: Event) => {
    setEditingItem(event);
    setShowModal('event');
  };

  const handleCloseModal = () => {
    setShowModal(null);
    setEditingItem(null);
    fetchTemples();
    fetchEvents();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-orange-100 mt-1">Welcome, {admin?.username}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-all duration-300 shadow-md"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveView('temples')}
            className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeView === 'temples'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Building2 className="w-5 h-5 mr-2" />
            Temples
          </button>
          <button
            onClick={() => setActiveView('events')}
            className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeView === 'events'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Events
          </button>
        </div>

        <div className="mb-6">
          <button
            onClick={activeView === 'temples' ? handleAddTemple : handleAddEvent}
            className="flex items-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add {activeView === 'temples' ? 'Temple' : 'Event'}
          </button>
        </div>

        {activeView === 'temples' ? (
          <TempleList temples={temples} onEdit={handleEditTemple} onRefresh={fetchTemples} />
        ) : (
          <EventList events={events} temples={temples} onEdit={handleEditEvent} onRefresh={fetchEvents} />
        )}
      </div>

      {showModal === 'temple' && (
        <TempleForm
          temple={editingItem as Temple}
          onClose={handleCloseModal}
        />
      )}

      {showModal === 'event' && (
        <EventForm
          event={editingItem as Event}
          temples={temples}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
