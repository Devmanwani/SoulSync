
'use server'
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function askAI(input: string) {
  const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);
  const promodel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const flashmodel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  const prompt = `

use this data and get me Personalized gemstone suggestions. Pooja (rituals) recommendations with importance and benefits explained. Do’s and Don’ts based on astrological insights.
Spiritual Content Delivery:
Meditation and workout suggestions aligned with horoscope insights. Sleep content tailored to user needs.
give answers in 2-3 lines for every topic 
Input Data:
${JSON.stringify(input)}
`;
  try {
    let result = await promodel.generateContent(prompt);
    return (result.response.text());
  } catch (e) {
    console.log(e)
    const result = await flashmodel.generateContent(prompt);
    return (result.response.text());
  }
}
