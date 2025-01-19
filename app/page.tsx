//@ts-nocheck
'use client'


import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTheme } from 'next-themes'

const FeatureCard = ({ title, description, icon, delay }) => {
  const { theme } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-teal-600 dark:text-teal-400">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  )
}

export default function Home() {
  const { theme } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="text-center"
    >
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-5xl font-bold mb-4 text-teal-600 dark:text-teal-400"
      >
        Welcome to SoulSync
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-xl mb-8 text-gray-700 dark:text-gray-300"
      >
        Your personal astrology and spirituality companion
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Link href="/horoscope" className="bg-teal-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-teal-700 transition-colors">
          Explore Your Horoscope
        </Link>
      </motion.div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
        <FeatureCard
          title="Daily Horoscope"
          description="Get insights into your day with personalized horoscope readings."
          icon="♈"
          delay={0.8}
        />
        <FeatureCard
          title="Gemstone Guide"
          description="Discover the perfect gemstones to enhance your spiritual journey."
          icon="💎"
          delay={1}
        />
        <FeatureCard
          title="AI Astro Chat"
          description="Chat with our AI-powered astrologer for instant guidance."
          icon="🤖"
          delay={1.2}
        />
        <FeatureCard
          title="Kundali Generator"
          description="Generate your detailed birth chart and unlock cosmic insights."
          icon="🔮"
          delay={1.4}
        />
      </div>
    </motion.div>
  )
}

