import { useState, useEffect } from 'react';

// Initial data to populate the "database" if it's empty
const initialEvents = [
  {
    id: 1,
    date: '2025-10-15T19:00:00.000Z',
    title: 'Acoustic Night',
    venue: 'The Melody Makers',
    city: 'New York',
    type: 'Acoustic',
    allAges: true,
    details: 'An intimate evening of acoustic performances. Featuring a lineup of talented singer-songwriters.'
  },
  {
    id: 2,
    date: '2025-11-05T20:00:00.000Z',
    title: 'Rock Fest 2025',
    venue: 'The Grand Arena',
    city: 'Los Angeles',
    type: 'Rock',
    allAges: false,
    details: 'The biggest rock festival of the year! Featuring headliners and up-and-coming rock bands.'
  },
];

export function useEventData() {
  const [events, setEvents] = useState(() => {
    try {
      const savedEvents = localStorage.getItem('qalakaar_events');
      if (savedEvents) {
        return JSON.parse(savedEvents);
      }
      // If no saved events, seed with initial data
      localStorage.setItem('qalakaar_events', JSON.stringify(initialEvents));
      return initialEvents;
    } catch (error) {
      console.error("Could not read events from localStorage", error);
      return [];
    }
  });

  // Effect to save events to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('qalakaar_events', JSON.stringify(events));
    } catch (error) {
      console.error("Could not save events to localStorage", error);
    }
  }, [events]);

  const addEvent = (event) => {
    // Assign a unique ID using the current timestamp
    const newEvent = { ...event, id: Date.now() }; 
    setEvents(prevEvents => [...prevEvents, newEvent]);
  };

  const updateEvent = (updatedEvent) => {
    setEvents(prevEvents =>
      prevEvents.map(event => (event.id === updatedEvent.id ? updatedEvent : event))
    );
  };

  const deleteEvent = (eventId) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  };

  return { events, addEvent, updateEvent, deleteEvent };
}
