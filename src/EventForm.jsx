import React, { useState, useEffect } from 'react';

export function EventForm({ event, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    venue: '',
    city: '',
    type: '',
    details: '',
    allAges: false,
  });

  // When the 'event' prop changes, pre-fill the form
  useEffect(() => {
    if (event) {
      // Format the date for the date input field (YYYY-MM-DD)
      const formattedDate = event.date ? new Date(event.date).toISOString().split('T')[0] : '';
      setFormData({ ...event, date: formattedDate });
    } else {
      // Reset form if no event is passed (for adding a new one)
      setFormData({
        title: '', date: '', venue: '', city: '', type: '', details: '', allAges: false
      });
    }
  }, [event]);

  // Update form state as the user types
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert date string back to a full Date object before saving
    const eventToSave = { 
        ...formData, 
        id: event ? event.id : undefined,
        date: new Date(formData.date).toISOString()
    };
    onSave(eventToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{event ? 'Edit Event' : 'Add New Event'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Event Title" className="w-full p-2 border rounded-lg" required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="date" type="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
            <input name="type" value={formData.type} onChange={handleChange} placeholder="Event Type (e.g., Rock)" className="w-full p-2 border rounded-lg" required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="venue" value={formData.venue} onChange={handleChange} placeholder="Venue" className="w-full p-2 border rounded-lg" required />
            <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full p-2 border rounded-lg" required />
          </div>
          <textarea name="details" value={formData.details} onChange={handleChange} placeholder="Event Details" className="w-full p-2 border rounded-lg h-24" />
          <div className="flex items-center">
            <input id="allAges" name="allAges" type="checkbox" checked={formData.allAges} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
            <label htmlFor="allAges" className="ml-2 block text-sm text-gray-900">All Ages Event</label>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
