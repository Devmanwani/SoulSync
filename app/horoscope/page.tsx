//@ts-nocheck
'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const HoroscopePage = () => {
  const [activeTab, setActiveTab] = useState('today')
  const [birthdate, setBirthdate] = useState('')
  const [horoscope, setHoroscope] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isDateAdded, setIsDateAdded] = useState(false)

  // Check if the birthdate is in localStorage on page load
  useEffect(() => {
    const storedData = localStorage.getItem('kundaliFormData')
    if (storedData) {
      console.log('data is stored')
      const parsedData = JSON.parse(storedData)
      const { day, month, year } = parsedData
      const birthdateString = `${year}-${monthToNumber(month)}-${String(day).padStart(2, '0')}`

      setBirthdate(birthdateString)
      setIsDateAdded(true)
    }
  }, [])

  useEffect(() => {
    if (birthdate) {
      fetchHoroscope()
    }
  }, [birthdate, activeTab])

  const fetchHoroscope = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/horoscope?dateOfBirth=${birthdate}&type=${activeTab}`)
      if (!response.ok) {
        throw new Error('Failed to fetch horoscope')
      }
      const data = await response.json()
      setHoroscope(data)
    } catch (err) {
      setError('Failed to fetch horoscope. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddDate = (date) => {
    setBirthdate(date)
    localStorage.setItem('birthdate', date)
    setIsDateAdded(true)
  }

  const renderHoroscope = () => {
    if (!horoscope) return null

    if (activeTab === 'monthly') {
      return (
        <div className="space-y-4">
          <HoroscopeSection title="Love & Relationship" content={horoscope.horoscope.loveRelationship} details={horoscope.horoscope.loveRelationshipDetails} />
          <HoroscopeSection title="Health & Wellness" content={horoscope.horoscope.healthWellness} details={horoscope.horoscope.healthDetails} />
          <HoroscopeSection title="Career & Education" content={horoscope.horoscope.careerEducation} details={horoscope.horoscope.careerDetails} />
          <HoroscopeSection title="Money & Finances" content={horoscope.horoscope.moneyFinances} details={horoscope.horoscope.moneyDetails} />
          <HoroscopeSection title="Important Dates" content={horoscope.horoscope.importantDates} />
          <HoroscopeSection title="Tip of the Month" content={horoscope.horoscope.tipOfTheMonth} />
        </div>
      )
    } else {
      return (
        <div className="space-y-4">
          <HoroscopeSection title="Personal" content={horoscope.horoscope.personal} />
          <HoroscopeSection title="Travel" content={horoscope.horoscope.travel} />
          <HoroscopeSection title="Money" content={horoscope.horoscope.money} />
          <HoroscopeSection title="Career" content={horoscope.horoscope.career} />
          <HoroscopeSection title="Health" content={horoscope.horoscope.health} />
          <HoroscopeSection title="Emotions" content={horoscope.horoscope.emotions} />
        </div>
      )
    }
  }

  // Helper function to convert month name to number
  const monthToNumber = (month) => {
    const months = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
      Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    }
    return months[month] || '01' // Default to January if month is unknown
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-8 text-center text-teal-800 dark:text-teal-200">Your Horoscope</h1>

      {/* Birthdate Input or Option */}
      <div className="mb-8">
        {!isDateAdded ? (
          <div className="text-center">
            <p className="text-lg text-gray-700 dark:text-gray-300">Please add your birthdate:</p>
            <input
              type="date"
              id="birthdate"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-4"
            />
            <button
              onClick={() => handleAddDate(birthdate)}
              className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-md"
            >
              Save Birthdate
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg text-gray-700 dark:text-gray-300">Your stored birthdate is: {birthdate}</p>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="mb-8 flex justify-center">
        {['today', 'tomorrow', 'monthly'].map((tab) => (
          <motion.button
            key={tab}
            className={`mx-2 px-6 py-3 rounded-full text-lg font-semibold transition-colors ${activeTab === tab ? 'bg-teal-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-teal-200 dark:hover:bg-teal-700'
              }`}
            onClick={() => setActiveTab(tab)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Horoscope Result */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
      >
        {loading && <p className="text-center text-gray-600 dark:text-gray-400">Loading horoscope...</p>}
        {error && <p className="text-center text-red-600 dark:text-red-400">{error}</p>}
        {!loading && !error && horoscope && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-teal-700 dark:text-teal-300">
              {horoscope.zodiacSign.charAt(0).toUpperCase() + horoscope.zodiacSign.slice(1)} - {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Horoscope
            </h2>
            {renderHoroscope()}
          </>
        )}
      </motion.div>
    </motion.div>
  )
}

const HoroscopeSection = ({ title, content, details = null }) => (
  <div className="mb-4">
    <h3 className="text-xl font-semibold mb-2 text-teal-600 dark:text-teal-400">{title}</h3>
    <p className="text-gray-700 dark:text-gray-300">{content}</p>
    {details && <p className="mt-2 text-gray-600 dark:text-gray-400">{details}</p>}
  </div>
)

export default HoroscopePage
