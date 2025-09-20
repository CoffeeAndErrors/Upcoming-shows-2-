import React, { useState, useMemo } from 'react';
import { useEventData } from './hooks/useEventData';
import { EventForm } from './EventForm';

// --- Reusable Components (Keep these from your previous setup) ---

// Animated Background Component
const MusicBackground = () => (
  <div className="music-bg fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
    {Array.from({ length: 15 }).map((_, i) => (
      <span key={i} className="note absolute text-red-500/10 text-2xl" style={{
        left: `${Math.random() * 100}vw`,
        animation: `float ${Math.random() * 10 + 15}s linear ${Math.random() * 5}s infinite`,
      }}>
        {['♫', '♪', '♬'][Math.floor(Math.random() * 3)]}
      </span>
    ))}
  </div>
);

// Event Details Modal
const DetailsModal = ({ event, onClose }) => {
  if (!event) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg w-full">
        <h2 className="text-3xl font-bold mb-4">{event.title}</h2>
        <p className="text-gray-700 mb-2"><strong>Date:</strong> {new Date(event.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</p>
        <p className="text-gray-700 mb-2"><strong>Venue:</strong> {event.venue}, {event.city}</p>
        <p className="text-gray-700 mb-6">{event.details || 'No additional details available.'}</p>
        <button onClick={onClose} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">Close</button>
      </div>
    </div>
  );
};

// Event Card
const EventCard = ({ event, onDetailsClick, onEditClick, onDeleteClick }) => {
  const eventDate = new Date(event.date);
  const day = eventDate.getUTCDate();
  const month = eventDate.toLocaleString('default', { month: 'short', timeZone: 'UTC' }).toUpperCase();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl hover:shadow-red-200/50">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="text-center shrink-0">
            <div className="bg-red-600 text-white rounded-md px-3 py-1 text-sm font-bold">{month}</div>
            <div className="text-3xl font-bold mt-1 text-gray-800">{day}</div>
          </div>
          <div className="flex-grow">
            <h3 className="text-2xl font-bold mb-2 text-gray-900">{event.title}</h3>
            <p className="text-gray-600 mb-4">{event.venue}, {event.city}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{event.type}</span>
              {event.allAges && <span className="bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">All Ages</span>}
            </div>
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button onClick={() => onDetailsClick(event)} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-semibold">Details</button>
              <button onClick={() => onEditClick(event)} className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 text-sm font-semibold">Edit</button>
              <button onClick={() => onDeleteClick(event.id)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 text-sm font-semibold">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Main App Component ---
function App() {
  const { events, addEvent, updateEvent, deleteEvent } = useEventData();
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortOption, setSortOption] = useState('date-asc');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // Holds the event to be edited
  const [detailsEvent, setDetailsEvent] = useState(null); // Holds the event for the details view

  // Memoized filtering and sorting logic
  const filteredEvents = useMemo(() => {
    return events
      .filter(event => {
        const lowerSearch = searchTerm.toLowerCase();
        return (
          (event.title.toLowerCase().includes(lowerSearch) ||
           event.venue.toLowerCase().includes(lowerSearch) ||
           event.city.toLowerCase().includes(lowerSearch)) &&
          (cityFilter === '' || event.city === cityFilter) &&
          (typeFilter === '' || event.type === typeFilter)
        );
      })
      .sort((a, b) => {
        if (sortOption === 'date-asc') return new Date(a.date) - new Date(b.date);
        if (sortOption === 'date-desc') return new Date(b.date) - new Date(a.date);
        return 0;
      });
  }, [events, searchTerm, cityFilter, typeFilter, sortOption]);

  const cities = [...new Set(events.map(e => e.city).sort())];
  const eventTypes = [...new Set(events.map(e => e.type).sort())];

  // --- Event Handlers for Modals and Forms ---
  
  // Opens the form for editing an existing event
  const handleEditClick = (event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };
  
  // Opens the form for adding a new event
  const handleAddClick = () => {
    setEditingEvent(null); // Ensure no event is pre-filled
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  const handleSaveEvent = (eventData) => {
    if (eventData.id) {
      updateEvent(eventData); // If it has an ID, it's an update
    } else {
      addEvent(eventData); // Otherwise, it's a new event
    }
    handleCloseForm(); // Close the form after saving
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(eventId);
    }
  };

  return (
    <>
      <MusicBackground />
      <div className="container mx-auto p-4 sm:p-8">
        <header className="text-center my-12">
          <h1 className="text-5xl font-extrabold text-gray-800">Upcoming Shows</h1>
          <p className="text-xl text-gray-500 mt-2">Your event management dashboard</p>
        </header>

        {/* --- Controls, Filters, and Add Button --- */}
        <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg mb-8 sticky top-4 z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
            <input type="text" placeholder="Search events..." className="p-3 border rounded-lg w-full lg:col-span-2" onChange={e => setSearchTerm(e.target.value)} />
            <select className="p-3 border rounded-lg w-full" onChange={e => setCityFilter(e.target.value)}>
              <option value="">All Cities</option>
              {cities.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
            <select className="p-3 border rounded-lg w-full" onChange={e => setTypeFilter(e.target.value)}>
              <option value="">All Types</option>
              {eventTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <select className="p-3 border rounded-lg w-full" onChange={e => setSortOption(e.target.value)}>
              <option value="date-asc">Sort by Date (Asc)</option>
              <option value="date-desc">Sort by Date (Desc)</option>
            </select>
          </div>
          <div className="mt-4 text-center">
            <button onClick={handleAddClick} className="bg-red-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-red-700 transition-transform hover:scale-105">
              + Add New Event
            </button>
          </div>
        </div>

        {/* --- Events List --- */}
        <div className="space-y-8">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onDetailsClick={setDetailsEvent}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteEvent}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 py-16 bg-white/50 rounded-lg">
              <h3 className="text-2xl font-semibold">No events found.</h3>
              <p className="mt-2">Try adding a new event or clearing your filters.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* --- Modals (conditionally rendered) --- */}
      {isFormOpen && <EventForm event={editingEvent} onSave={handleSaveEvent} onClose={handleCloseForm} />}
      {detailsEvent && <DetailsModal event={detailsEvent} onClose={() => setDetailsEvent(null)} />}
    </>
  );
}

export default App;
