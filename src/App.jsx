import React, { useState, useMemo } from 'react';

// Hardcoded event data
const events = [
  {
    id: 1,
    date: '2025-10-25',
    title: 'MUSEPAD',
    venue: 'VIVANTA BY TAJ',
    city: 'Bhubaneswar',
    type: 'Acoustic',
    allAges: true,
    details: 'An intimate evening of acoustic performances. Featuring a lineup of talented singer-songwriters.'
  },
  {
    id: 2,
    date: '2025-11-05',
    title: 'ACOUSTIC EVENING',
    venue: 'LYFE',
    city: 'Bhubaneswar',
    type: 'Jazz',
    allAges: true,
    details: 'Featuring headliners and up-and-coming jazz bands.'
  },
  {
    id: 3,
    date: '2025-10-25',
    title: 'Jazz in the Park',
    venue: 'Central Park',
    city: 'New York',
    type: 'Jazz',
    allAges: true,
    details: 'A relaxing afternoon of smooth jazz in the beautiful setting of Central Park.'
  },
  {
    id: 4,
    date: '2025-12-01',
    title: 'Electronic Dance Party',
    venue: 'Warehouse 305',
    city: 'Miami',
    type: 'Electronic',
    allAges: false,
    details: 'Dance the night away to the beats of top electronic music DJs from around the world.'
  },
  {
    id: 5,
    date: '2025-11-20',
    title: 'Indie Showcase',
    venue: 'The Underground',
    city: 'Chicago',
    type: 'Indie',
    allAges: true,
    details: 'Discover your new favorite indie bands at our monthly showcase.'
  },
];

// Animated Background Component
const MusicBackground = () => {
  const notes = ['♪', '♫', '♬', '♩', '♭', '♯'];
  return (
    <div className="music-bg">
      {Array.from({ length: 15 }).map((_, index) => (
        <span
          key={index}
          className="note"
          style={{
            left: `${Math.random() * 100}vw`,
            animationDuration: `${Math.random() * 10 + 15}s`,
            animationDelay: `${Math.random() * 10}s`,
            fontSize: `${Math.random() * 2 + 1}rem`,
          }}
        >
          {notes[Math.floor(Math.random() * notes.length)]}
        </span>
      ))}
    </div>
  );
};

// Event Card Component
const EventCard = ({ event, onDetailsClick }) => {
  const eventDate = new Date(event.date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 hover:shadow-xl hover:shadow-red-200">
      <div className="p-6">
        <div className="flex items-start">
          <div className="text-center mr-6">
            <div className="bg-red-500 text-white rounded-md px-3 py-1 text-sm font-bold">{month}</div>
            <div className="text-3xl font-bold mt-1">{day}</div>
          </div>
          <div className="flex-grow">
            <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
            <p className="text-gray-600 mb-4">{event.venue}, {event.city}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{event.type}</span>
              {event.allAges && <span className="bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">All Ages</span>}
            </div>
            <button
              onClick={() => onDetailsClick(event)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal Component
const Modal = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg w-full">
        <h2 className="text-3xl font-bold mb-4">{event.title}</h2>
        <p className="text-gray-700 mb-2"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p className="text-gray-700 mb-2"><strong>Venue:</strong> {event.venue}, {event.city}</p>
        <p className="text-gray-700 mb-6">{event.details}</p>
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortOption, setSortOption] = useState('date-asc');
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Memoized filtering and sorting logic
  const filteredEvents = useMemo(() => {
    return events
      .filter(event => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
          (event.title.toLowerCase().includes(lowerSearchTerm) ||
           event.venue.toLowerCase().includes(lowerSearchTerm) ||
           event.city.toLowerCase().includes(lowerSearchTerm)) &&
          (cityFilter === '' || event.city === cityFilter) &&
          (typeFilter === '' || event.type === typeFilter)
        );
      })
      .sort((a, b) => {
        switch (sortOption) {
          case 'date-asc':
            return new Date(a.date) - new Date(b.date);
          case 'date-desc':
            return new Date(b.date) - new Date(a.date);
          case 'title-az':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
  }, [searchTerm, cityFilter, typeFilter, sortOption]);

  const cities = [...new Set(events.map(event => event.city))];
  const types = [...new Set(events.map(event => event.type))];

  return (
    <>
      <MusicBackground />
      <div className="container mx-auto p-4 sm:p-8">
        <header className="text-center my-12">
          <h1 className="text-5xl font-extrabold text-gray-800">Upcoming Shows</h1>
          <p className="text-xl text-gray-500 mt-2">Your next live music experience awaits.</p>
        </header>

        {/* Filters Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by title, venue, or city..."
              className="p-3 border rounded-lg w-full"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="p-3 border rounded-lg w-full"
              onChange={(e) => setCityFilter(e.target.value)}
            >
              <option value="">All Cities</option>
              {cities.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
            <select
              className="p-3 border rounded-lg w-full"
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All Event Types</option>
              {types.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <select
              className="p-3 border rounded-lg w-full"
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="date-asc">Sort by Date (Asc)</option>
              <option value="date-desc">Sort by Date (Desc)</option>
              <option value="title-az">Sort by Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <EventCard key={event.id} event={event} onDetailsClick={setSelectedEvent} />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">No events found. Try adjusting your filters.</p>
          )}
        </div>

        {/* Modal */}
        <Modal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      </div>
    </>
  );
}

export default App;
