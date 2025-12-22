
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import { LocalContext, Competition, LeaderboardEntry, SchemerInsight, TimelineEvent } from "../types";

// Always use a named parameter for the API key.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const CACHE_KEY_PREFIX = 'nagriksetu_v3_cache_';

/**
 * Caching utility to significantly reduce API hits and avoid 429 Resource Exhausted errors.
 */
const getCache = (key: string) => {
  const cached = localStorage.getItem(CACHE_KEY_PREFIX + key);
  if (!cached) return null;
  try {
    const { data, expiry } = JSON.parse(cached);
    if (Date.now() > expiry) {
      localStorage.removeItem(CACHE_KEY_PREFIX + key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

const setCache = (key: string, data: any, ttlHours: number = 12) => {
  const expiry = Date.now() + ttlHours * 60 * 60 * 1000;
  localStorage.setItem(CACHE_KEY_PREFIX + key, JSON.stringify({ data, expiry }));
};

/**
 * Enhanced retry mechanism with Jittered Exponential Backoff for 429/Resource Exhausted.
 */
const callWithRetry = async (fn: () => Promise<any>, retries = 4): Promise<any> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const errorStr = typeof error === 'string' ? error : JSON.stringify(error);
      const errorMsg = error?.message || "";
      
      const isRateLimit = 
        errorStr.includes('429') || 
        errorStr.includes('RESOURCE_EXHAUSTED') || 
        errorMsg.includes('429') || 
        errorMsg.includes('RESOURCE_EXHAUSTED') ||
        error?.status === 'RESOURCE_EXHAUSTED' ||
        error?.status === 429;

      if (isRateLimit && i < retries - 1) {
        const waitTime = Math.pow(2, i) * 2000 + Math.random() * 1500;
        console.warn(`[NagrikSetu] Quota limit hit. Retrying in ${Math.round(waitTime)}ms... (Attempt ${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      if (isRateLimit) {
        const busyError = new Error("SYSTEM_BUSY");
        (busyError as any).details = errorMsg;
        throw busyError;
      }
      
      throw error;
    }
  }
};

export const geminiService = {
  // Specialized: Linguistic Rights & Law (Bhasha ka Kanun)
  async askLinguisticRights(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    return callWithRetry(async () => {
      const ai = getAI();
      const prompt = `
        MISSION: Explain Linguistic Rights and Language Laws (भाषा का कानून).
        Topic: "${query}"
        Focus on:
        1. 📜 **संविधान (Samvidhan):** Focus on Articles 343-351, 29, 30 and Eighth Schedule.
        2. 🗣️ **भाषाई अधिकार:** Legal rights of speakers in ${context.city || 'their region'}.
        3. ⚖️ **कानूनी प्रभाव:** Court proceedings and administrative language rules.
        
        Answer in ${context.language}. Wrap legal articles in **Double Asterisks**.
      `;
      return await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
      });
    });
  },

  // Historical Intersection & Era Comparison (Pehle vs Aaj)
  async askEraComparison(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    return callWithRetry(async () => {
      const ai = getAI();
      const prompt = `
        MISSION: Compare "Then vs Now" (पहिले और आज) through a Constitutional and Global lens.
        Subject: "${query}"
        
        Structure:
        1. 🕰️ **पहिले (The Past):** How it worked before the Indian Constitution (British era or Ancient).
        2. 📜 **संविधान का प्रभाव (Constitutional Shift):** How the Law/Constitution changed this.
        3. ⚡ **आज (Today):** Current state in 2024.
        4. 🌍 **ग्लोबल कड़ी (Global View):** One parallel fact from world history about this.
        
        Language: ${context.language}. Use structured Markdown.
      `;
      return await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
      });
    });
  },

  // Weekly Timeline Generator - CACHED
  async fetchWeeklyTimeline(context: LocalContext): Promise<TimelineEvent[]> {
    const cacheKey = `timeline_v2_${context.language}_${new Date().toDateString()}`;
    const cached = getCache(cacheKey);
    if (cached) return cached;

    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate 5-7 major global/Indian historical events for this week. Output JSON array of objects: {year, event, description}. Language: ${context.language}.`,
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || "[]");
      setCache(cacheKey, data, 24);
      return data;
    });
  },

  // Daily Growth / Sadhana - CACHED
  async generateDailyGrowth(context: LocalContext): Promise<any> {
    const cacheKey = `daily_growth_v2_${context.language}_${new Date().toDateString()}`;
    // Fix: Block-scoped variable 'cached' was being used before its declaration. Pass 'cacheKey' to getCache.
    const cached = getCache(cacheKey);
    if (cached) return cached;

    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Daily Growth Ritual for an Empowered Citizen. JSON: affirmation, strategy (title, content, source), logicPuzzle (question, options, correctIndex, explanation), ethicsHabit (title, action).",
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || "{}");
      setCache(cacheKey, data, 12);
      return data;
    });
  },

  // Explorer Deep Intelligence Scan
  async getExplorerInfo(location: { lat?: number; lng?: number }, context: LocalContext, searchQuery?: string): Promise<GenerateContentResponse> {
    return callWithRetry(async () => {
      const ai = getAI();
      const target = searchQuery ? `Location: ${searchQuery}` : `Coordinates lat: ${location.lat}, lng: ${location.lng}`;
      const prompt = `Deep Intelligence Scan of "${target}". Structure: 1. History (Pehle), 2. Current State (Aaj), 3. Law/Language (Bhasha aur Kanoon), 4. Food (Khau Gali), 5. Nature (Prakriti). Language: ${context.language}.`;
      
      const config: any = {
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { tools: [{ googleMaps: {} }, { googleSearch: {} }] }
      };
      if (location.lat && location.lng && !searchQuery) {
        config.config.toolConfig = { retrievalConfig: { latLng: { latitude: location.lat, longitude: location.lng } } };
      }
      return await ai.models.generateContent(config);
    });
  },

  async askComplexQuestion(prompt: string, context?: LocalContext): Promise<GenerateContentResponse> {
    return callWithRetry(async () => {
      const ai = getAI();
      return await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
      });
    });
  },

  async getLocalInfo(prompt: string, location?: { lat: number; lng: number }, context?: LocalContext): Promise<GenerateContentResponse> {
    return callWithRetry(async () => {
      const ai = getAI();
      const config: any = { tools: [{ googleMaps: {} }] };
      if (location) config.toolConfig = { retrievalConfig: { latLng: { latitude: location.lat, longitude: location.lng } } };
      return await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt, config: config });
    });
  },

  async searchCurrentEvents(prompt: string, context?: LocalContext): Promise<GenerateContentResponse> {
    return callWithRetry(async () => {
      const ai = getAI();
      return await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
      });
    });
  },

  async generateDidYouKnow(topic: string, context: LocalContext): Promise<string> {
    const cacheKey = `did_you_know_v2_${topic}_${context.language}_${new Date().toDateString()}`;
    const cached = getCache(cacheKey);
    if (cached) return cached;

    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Surprising historical/legal fact about: "${topic}". Language: ${context.language}. Short!`,
      });
      const text = response.text || "";
      setCache(cacheKey, text, 24);
      return text;
    });
  },

  async getDailyHighlights(context: LocalContext): Promise<any> {
    const cacheKey = `highlights_v2_${context.city}_${new Date().toDateString()}`;
    const cached = getCache(cacheKey);
    if (cached) return cached;

    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Daily highlights for ${context.city}. JSON: article (title, content), history (title, content).`,
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || "{}");
      setCache(cacheKey, data, 12);
      return data;
    });
  },

  async getRegionalContext(lat: number, lng: number): Promise<any> {
    const cacheKey = `location_v2_${lat.toFixed(2)}_${lng.toFixed(2)}`;
    const cached = getCache(cacheKey);
    if (cached) return cached;

    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Country, city, language for coordinates: ${lat}, ${lng}. JSON.`,
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || "{}");
      setCache(cacheKey, data, 168);
      return data;
    });
  },

  async speak(text: string, voiceName: string = 'Kore'): Promise<ArrayBuffer> {
    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: { responseModalities: [Modality.AUDIO], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } } }
      });
      const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!data) throw new Error("Audio failed");
      const binary = atob(data);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return bytes.buffer;
    });
  },

  async generateQuiz(content: string, context?: LocalContext) {
    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Quiz on: ${content}. JSON array of QuizQuestion objects.`,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || "[]");
    });
  },

  async getSchemerInsight(query: string, context: LocalContext): Promise<SchemerInsight> {
    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Psych profile of: ${query}. JSON.`,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || "{}");
    });
  },

  async getWeeklyCompetition(context: LocalContext): Promise<Competition> {
    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Weekly knowledge competition. JSON keys: title, description, theme, rules, prizePoints.",
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || "{}");
    });
  },

  async getLeaderboardData(userPoints: number, userName: string): Promise<LeaderboardEntry[]> {
    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Leaderboard for ${userName} (${userPoints}). JSON array.`,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || "[]");
    });
  },

  async editStudyImage(prompt: string, base64: string, mime: string): Promise<string | null> {
    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ inlineData: { data: base64, mimeType: mime } }, { text: prompt }] },
      });
      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      return part ? `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` : null;
    });
  },

  async generatePersonalHistory(notes: string, context: LocalContext): Promise<GenerateContentResponse> {
    return callWithRetry(async () => {
      const ai = getAI();
      return await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: notes,
        config: { systemInstruction: `Professional biographer in ${context.language}.` }
      });
    });
  },

  async analyzeModernScam(query: string, context: LocalContext): Promise<string> {
    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze scam: ${query}. Language: ${context.language}.`,
        config: { tools: [{ googleSearch: {} }] }
      });
      return response.text || "";
    });
  },

  async analyzeMarketPosition(context: LocalContext): Promise<string> {
    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `NagrikSetu strategy for ${context.country}.`,
      });
      return response.text || "";
    });
  },

  async askReligiousWisdom(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    return callWithRetry(async () => {
      const ai = getAI();
      return await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: { systemInstruction: `Gyan Guru in ${context.language}.` }
      });
    });
  },

  async askCulturalWisdom(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    return callWithRetry(async () => {
      const ai = getAI();
      return await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: { systemInstruction: `Cultural Guru in ${context.language}.` }
      });
    });
  },

  // Added explainCrimeScene for CrimeSceneExplainer
  async explainCrimeScene(query: string, context: LocalContext): Promise<any> {
    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `MISSION: Analyze a crime scene or forensic theory for a student of criminology.
          Topic: "${query}"
          Output: JSON object with keys:
          - title: A catchy title for the case.
          - simpleAnalogy: A very simple comparison to explain the concept.
          - theoryExplained: Detailed explanation of the underlying criminology theory.
          - motiveAnalysis: Psychological insight into why such a crime might be committed.
          - clues: Array of 3-5 typical clues found in such scenes.
          - forensicFacts: Array of 3-5 scientific or forensic facts related to this.
          
          Language: ${context.language}.`,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || "{}");
    });
  },

  // Added analyzeMissingLink for CrimeSceneExplainer
  async analyzeMissingLink(query: string, context: LocalContext): Promise<string> {
    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `MISSION: Analyze the "Missing Link" (लुप्त कड़ी) between historical patterns and modern problems.
          Subject: "${query}"
          Focus on:
          1. Historical context and how similar problems were solved in the past.
          2. Modern technology or legal shifts that changed the landscape.
          3. The bridge: What we are missing today that the past had, or vice versa.
          
          Language: ${context.language}. Provide deep philosophical and strategic insight.`,
      });
      return response.text || "";
    });
  },
};
