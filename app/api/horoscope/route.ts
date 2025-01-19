import { NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'

// Helper function to determine the zodiac sign based on the date of birth
function getZodiacSign(dateOfBirth: Date) {
  const month = dateOfBirth.getMonth() + 1
  const day = dateOfBirth.getDate()

  const zodiacSigns = [
    { sign: 'aries', start: [3, 21], end: [4, 19] },
    { sign: 'taurus', start: [4, 20], end: [5, 20] },
    { sign: 'gemini', start: [5, 21], end: [6, 20] },
    { sign: 'cancer', start: [6, 21], end: [7, 22] },
    { sign: 'leo', start: [7, 23], end: [8, 22] },
    { sign: 'virgo', start: [8, 23], end: [9, 22] },
    { sign: 'libra', start: [9, 23], end: [10, 22] },
    { sign: 'scorpio', start: [10, 23], end: [11, 21] },
    { sign: 'sagittarius', start: [11, 22], end: [12, 21] },
    { sign: 'capricorn', start: [12, 22], end: [1, 19] },
    { sign: 'aquarius', start: [1, 20], end: [2, 18] },
    { sign: 'pisces', start: [2, 19], end: [3, 20] },
  ]

  for (const zodiac of zodiacSigns) {
    const [startMonth, startDay] = zodiac.start
    const [endMonth, endDay] = zodiac.end

    if (
      (month === startMonth && day >= startDay) ||
      (month === endMonth && day <= endDay) ||
      (month > startMonth && month < endMonth)
    ) {
      return zodiac.sign
    }
  }

  return 'aries'
}

// Function to fetch horoscope data
async function fetchHoroscope(zodiacSign: string, type: 'today' | 'tomorrow' | 'monthly') {
  const baseUrl = 'https://astrotalk.com/horoscope'
  const url = `${baseUrl}/${type === 'monthly' ? 'monthly' : type === 'tomorrow' ? 'tomorrow' : 'todays'}-horoscope/${zodiacSign.toLowerCase()}`

  try {
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    if (type === 'monthly') {
      return {
        loveRelationship: $('.parah_aries_horocope p').eq(0).text().trim(),
        loveRelationshipDetails: $('.parah_aries_horocope p').eq(1).text().trim(),
        healthWellness: $('.parah_aries_horocope p').eq(3).text().trim(),
        healthDetails: $('.parah_aries_horocope p').eq(4).text().trim(),
        careerEducation: $('.parah_aries_horocope p').eq(6).text().trim(),
        careerDetails: $('.parah_aries_horocope p').eq(7).text().trim(),
        moneyFinances: $('.parah_aries_horocope p').eq(9).text().trim(),
        moneyDetails: $('.parah_aries_horocope p').eq(10).text().trim(),
        importantDates: $('.parah_aries_horocope p').eq(12).text().trim(),
        tipOfTheMonth: $('.parah_aries_horocope p').eq(14).text().trim(),
      }
    } else {
      return {
        personal: $('.parah_aries_horocope p').eq(0).text().trim(),
        travel: $('.parah_aries_horocope p').eq(1).text().trim(),
        money: $('.parah_aries_horocope p').eq(2).text().trim(),
        career: $('.parah_aries_horocope p').eq(3).text().trim(),
        health: $('.parah_aries_horocope p').eq(4).text().trim(),
        emotions: $('.parah_aries_horocope p').eq(5).text().trim(),
      }
    }
  } catch (error) {
    console.error(`Error fetching ${type} horoscope:`, error)
    return null
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const dateOfBirth = searchParams.get('dateOfBirth')
  const type = searchParams.get('type') as 'today' | 'tomorrow' | 'monthly'

  if (!dateOfBirth || !type) {
    return NextResponse.json({ error: 'Missing dateOfBirth or type parameter' }, { status: 400 })
  }

  const birthDate = new Date(dateOfBirth)
  const zodiacSign = getZodiacSign(birthDate)
  const horoscope = await fetchHoroscope(zodiacSign, type)

  if (!horoscope) {
    return NextResponse.json({ error: 'Failed to fetch horoscope' }, { status: 500 })
  }

  return NextResponse.json({ zodiacSign, horoscope })
}

