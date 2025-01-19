'use client'
import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation';
import { insertOne } from '@/db/action';

type Place = {
  id: string;
  name: string;
  state: string;
  countryName: string;
  latitude: number;
  longitude: number;
};

type FormData = {
  name: string;
  gender: 'Male' | 'Female';
  day: number;
  month: string;
  year: number;
  hour: number;
  minute: number;
  second: number;
  birthplace: string;
  latitude: number | null;
  longitude: number | null;
};

const KundaliPage = () => {
  const router = useRouter();

  // Check if window is defined (client-side only)
  const isClient = typeof window !== 'undefined';

  // Load stored data from localStorage only on the client side
  const storedData = isClient ? localStorage.getItem('kundaliFormData') : null;
  const initialFormData: FormData = storedData ? JSON.parse(storedData) : {
    name: '',
    gender: 'Male',
    day: 1,
    month: 'Jan',
    year: 1990,
    hour: 15,
    minute: 22,
    second: 10,
    birthplace: '',
    latitude: null,
    longitude: null,
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [placeOptions, setPlaceOptions] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null); // Store the timeout reference

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Trigger the place search when user types more than 3 characters
  useEffect(() => {
    if (formData.birthplace.length > 3) {
      // Clear the previous timeout if any
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      // Set a new timeout to delay the request by 300ms
      debounceTimeout.current = setTimeout(() => {
        handlePlaceSearch();
      }, 300);
    } else {
      setPlaceOptions([]);
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current); // Clean up the timeout on unmount or before the next search
      }
    };
  }, [formData.birthplace]);

  const handlePlaceSearch = async () => {
    setIsSearching(true);
    try {
      const response = await fetch(`/api/places?query=${formData.birthplace}`);
      const data = await response.json();

      if (data.places) {
        setPlaceOptions(data.places);
      }
    } catch (error) {
      console.error('Error fetching place data:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
    // Set the full address in the birthPlace input field
    const fullPlaceName = `${place.name}, ${place.state}, ${place.countryName}`;
    setFormData({
      ...formData,
      birthplace: fullPlaceName,
      latitude: place.latitude,
      longitude: place.longitude,
    });
    setPlaceOptions([]); // Clear the dropdown suggestions after selection
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { ...formData, ...selectedPlace });

    // Store the form data in localStorage only on the client-side
    if (isClient) {
      localStorage.setItem('kundaliFormData', JSON.stringify(formData));
    }
    router.push('/kundali')
    insertOne(formData)
  };

  const handleReset = () => {
    // Reset the form and clear the localStorage
    if (isClient) {
      localStorage.removeItem('kundaliFormData');
    }
    setFormData({
      name: '',
      gender: 'Male',
      day: 1,
      month: 'Jan',
      year: 1990,
      hour: 15,
      minute: 22,
      second: 10,
      birthplace: '',
      latitude: null,
      longitude: null,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <h1 className="text-4xl font-bold mb-8 text-center text-teal-800">Generate Kundali</h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {/* Name input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <label htmlFor="name" className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">Name*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-400"
          />
        </motion.div>

        {/* Gender select */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-4"
        >
          <label htmlFor="gender" className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">Gender*</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-400"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </motion.div>

        {/* Birth Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-4"
        >
          <h3 className="font-bold mb-2 text-gray-700 dark:text-gray-300">Birth Details</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="day" className="block mb-2 text-gray-700 dark:text-gray-300">Day*</label>
              <input
                type="number"
                id="day"
                name="day"
                value={formData.day}
                onChange={handleInputChange}
                required
                min="1"
                max="31"
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-400"
              />
            </div>
            <div>
              <label htmlFor="month" className="block mb-2 text-gray-700 dark:text-gray-300">Month*</label>
              <select
                id="month"
                name="month"
                value={formData.month}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-400"
              >
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="year" className="block mb-2 text-gray-700 dark:text-gray-300">Year*</label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                required
                min="1900"
                max="2099"
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-400"
              />
            </div>
          </div>
        </motion.div>

        {/* Time Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-4"
        >
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="hour" className="block mb-2 text-gray-700 dark:text-gray-300">Hour*</label>
              <input
                type="number"
                id="hour"
                name="hour"
                value={formData.hour}
                onChange={handleInputChange}
                required
                min="0"
                max="23"
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-400"
              />
            </div>
            <div>
              <label htmlFor="minute" className="block mb-2 text-gray-700 dark:text-gray-300">Minute*</label>
              <input
                type="number"
                id="minute"
                name="minute"
                value={formData.minute}
                onChange={handleInputChange}
                required
                min="0"
                max="59"
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-400"
              />
            </div>
            <div>
              <label htmlFor="second" className="block mb-2 text-gray-700 dark:text-gray-300">Second</label>
              <input
                type="number"
                id="second"
                name="second"
                value={formData.second}
                onChange={handleInputChange}
                min="0"
                max="59"
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-400"
              />
            </div>
          </div>
        </motion.div>

        {/* Birth Place */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-4"
        >
          <label htmlFor="birthplace" className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">Birth Place*</label>
          <input
            type="text"
            id="birthplace"
            name="birthplace"
            value={formData.birthplace}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-400"
          />
          {/* Place suggestions */}
          {placeOptions.length > 0 && (
            <ul className="mt-2 bg-white dark:bg-gray-700 border rounded-md max-h-40 overflow-y-auto">
              {isSearching ? (
                <li className="p-2 text-gray-500">Searching...</li>
              ) : (
                placeOptions.map((place) => (
                  <li
                    key={place.id}
                    onClick={() => handlePlaceSelect(place)}
                    className="cursor-pointer p-2 hover:bg-teal-200 dark:hover:bg-teal-600"
                  >
                    {place.name}, {place.state}, {place.countryName}
                  </li>
                ))
              )}
            </ul>
          )}
        </motion.div>

        {/* Latitude and Longitude */}
        {formData.latitude !== null && formData.longitude !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="latitude" className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">Latitude</label>
                <input
                  type="text"
                  id="latitude"
                  value={formData.latitude}
                  readOnly
                  className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="longitude" className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">Longitude</label>
                <input
                  type="text"
                  id="longitude"
                  value={formData.longitude}
                  readOnly
                  className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white focus:outline-none"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Submit and Reset Buttons */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-teal-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-300"
          >
            Generate Kundali
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="ml-4 bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Reset
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default KundaliPage;
