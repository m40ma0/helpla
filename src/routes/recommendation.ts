import { Hono } from "hono";
import { db } from "../firebaseAdmin";
import { isExpired } from "../utils";
import { GoogleGenAI } from "@google/genai";

type RecommendationRequest = {
  message: string
}

type InventoryItem = {
  name?: unknown
  expiry?: unknown
}

const recommendation = new Hono()

recommendation.post('/', async (c) => {
  let body: RecommendationRequest

  try {
    body = await c.req.json<RecommendationRequest>()
  } catch {
    return c.json({ error: 'Body must be valid JSON' }, 400)
  }

  if (typeof body.message !== 'string' || body.message.trim().length === 0) {
    return c.json({ error: 'Message cannot be empty' }, 400)
  }

  const snapshot = await db.collection('inventory').get()
  const inventoryList = snapshot.docs
    .map((doc) => doc.data() as InventoryItem)
    .filter((item) => !isExpired(item.expiry))
    .map((item) => item.name)

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based off the current lists of foods that we have; [${inventoryList.join(', ')}], and based off the statement made by the user here; [${body.message}], suggest what foods from our list they might like.`,
  });

  return c.json({msg: response.text})
})


export default recommendation
