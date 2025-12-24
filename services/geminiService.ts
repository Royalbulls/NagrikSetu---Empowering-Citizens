
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import { LocalContext, Competition, LeaderboardEntry, SchemerInsight, TimelineEvent } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const callWithRetry = async (fn: () => Promise<any>, retries = 3): Promise<any> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if ((error?.message?.includes('429')) && i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        continue;
      }
      throw error;
    }
  }
};

export const geminiService = {
  async speak(text: string, voiceName: string = 'Kore'): Promise<Uint8Array> {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `सुनाएँ: ${text}` }] }],
      config: { 
        responseModalities: [Modality.AUDIO], 
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } } 
      }
    });
    const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!data) throw new Error("Audio failed");
    const binary = atob(data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  },

  async explainWithAnalogy(text: string, context: LocalContext): Promise<string> {
    return callWithRetry(async () => {
      const ai = getAI();
      const prompt = `SIMPLIFY THIS LEGAL/CONSTITUTIONAL TEXT USING AN EVERYDAY ANALOGY: "${text}". 
      MISSION: Explain the core logic of this law/article to a common citizen who doesn't know legal jargon.
      REQUIREMENT: Use a simple analogy (उदाहरण/उपमा) like a game, a household rule, or a village custom.
      Language: ${context.language}.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      return response.text || "";
    });
  },

  async analyzeCitizenRights(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    return callWithRetry(async () => {
      const ai = getAI();
      const prompt = `SITUATION ANALYSIS FOR CITIZEN: "${query}". 
      MISSION: Empower the citizen with comprehensive legal knowledge.
      CATEGORIES TO COVER: 
      - Daily Life (Consumer issues, Warranties, Services).
      - Documentation (Birth to Death proofs, ID cards).
      - Property & Disputes (Theft, Fights, Land, Family).
      - Fundamental Rights & Police.
      Analyze and provide:
      1. Applicable Laws/Articles (संवैधानिक और कानूनी धाराएं).
      2. Step-by-Step Action Plan (क्या करें - कानूनी रास्ता).
      3. Documentation Advice (कौन से कागज लगेंगे).
      4. Helpline numbers/Consumer Court info.
      Language: ${context.language}. Professional yet simple.`;
      
      return await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
      });
    });
  },

  async fetchLegalEncyclopedia(category: string, context: LocalContext): Promise<any[]> {
    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide a list of 6 key laws/acts for the category: "${category}" in India. Language: Hindi.`,
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                year: { type: Type.STRING },
                purpose: { type: Type.STRING },
                benefit: { type: Type.STRING }
              },
              required: ["title", "year", "purpose", "benefit"]
            }
          }
        }
      });
      return JSON.parse(response.text || "[]");
    });
  },

  async analyzeLifeCycleDocs(context: LocalContext): Promise<any[]> {
    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "List the essential legal documentation journey for an Indian citizen from Birth to Death. Include: Birth, Education, Adulthood, Marriage, Property, Retirement, Will, Death. Language: Hindi.",
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stage: { type: Type.STRING },
                title: { type: Type.STRING },
                docs: { type: Type.ARRAY, items: { type: Type.STRING } },
                purpose: { type: Type.STRING },
                authority: { type: Type.STRING }
              },
              required: ["stage", "title", "docs", "purpose", "authority"]
            }
          }
        }
      });
      return JSON.parse(response.text || "[]");
    });
  },

  async generateApplication(data: { receiver: string, subject: string, details: string, name: string }, context: LocalContext): Promise<string> {
    return callWithRetry(async () => {
      const ai = getAI();
      const prompt = `Write a formal application (आवेदन पत्र) in ${context.language}. 
      To: ${data.receiver}
      Subject: ${data.subject}
      Issue Details: ${data.details}
      From: ${data.name}
      Format: Professional letter with space for date and signature. Include appropriate respect terms (Mahoday/Sriman).`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      return response.text || "";
    });
  },

  async analyzeFinancialSafety(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    return callWithRetry(async () => {
      const ai = getAI();
      const prompt = `Analyze financial safety/scam potential for: "${query}". 
      MISSION: Protect the citizen from financial fraud. 
      Explain: 
      1. Potential Red Flags (धोखे के लक्षण).
      2. Regulatory rules (RBI/SEBI/IRDAI context).
      3. Legal Rights if cheated.
      4. Safe Investment Principles.
      Language: ${context.language}. Structured with bold headings and icons.`;
      
      return await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
      });
    });
  },

  async askEraComparison(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    return callWithRetry(async () => {
      const ai = getAI();
      const prompt = `MISSION: Expert "Then vs Now" (पहिले and आज) comparison. 
      Topic: "${query}". 
      Explain:
      1. पहिले (History): Global/Ancient context of how things were.
      2. आज (Now): Modern Law and current events context.
      3. संविधान (Samvidhan): Specific Article context if applicable.
      Focus on Global History evolution. Language: ${context.language}.`;
      
      return await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
      });
    });
  },

  async askLinguisticRights(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    return callWithRetry(async () => {
      const ai = getAI();
      const prompt = `EXPLAIN LANGUAGE LAWS (Bhasha ka Kanun). 
      Specifically: "${query}". 
      Mandatory Focus: Indian Samvidhan Articles 343-351, 29, 30. 
      Mention historical context (Pehle) vs current usage (Aaj). 
      Answer in structured ${context.language}.`;
      
      return await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
      });
    });
  },

  async generateDidYouKnow(topic: string, context: LocalContext): Promise<string> {
    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `One short fascinating fact about: "${topic}" (Global History or Law). Language: ${context.language}.`,
      });
      return response.text || "";
    });
  },

  async generateDailyGrowth(context: LocalContext): Promise<any> {
    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Daily Learning Ritual for history and law scholar. Language: Hindi.",
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              affirmation: { type: Type.STRING },
              strategy: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                  source: { type: Type.STRING }
                },
                required: ["title", "content", "source"]
              },
              logicPuzzle: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
                },
                required: ["question", "options", "correctIndex", "explanation"]
              },
              ethicsHabit: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  action: { type: Type.STRING }
                },
                required: ["title", "action"]
              }
            },
            required: ["affirmation", "strategy", "logicPuzzle", "ethicsHabit"]
          }
        }
      });
      return JSON.parse(response.text || "{}");
    });
  },

  async getQueryTimeline(query: string, context: LocalContext): Promise<TimelineEvent[]> {
    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Historical timeline for: "${query}". 6 milestones. JSON array of {year, event, description}. Language: ${context.language}.`,
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                year: { type: Type.STRING },
                event: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["year", "event", "description"]
            }
          }
        }
      });
      return JSON.parse(response.text || "[]");
    });
  },

  async fetchTodayInHistory(context: LocalContext): Promise<TimelineEvent[]> {
    return callWithRetry(async () => {
      const ai = getAI();
      const now = new Date();
      const day = now.getDate();
      const month = now.toLocaleString('en-US', { month: 'long' });
      const year = now.getFullYear();
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide 7 MAJOR historical global events that happened on ${month} ${day}. Use the context of today being ${day} ${month} ${year}. Language: ${context.language}. Ensure events are diverse (Politics, Science, Law, War, Discovery).`,
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                year: { type: Type.STRING },
                event: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["year", "event", "description"]
            }
          }
        }
      });
      return JSON.parse(response.text || "[]");
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

  async getLocalInfo(prompt: string, location?: any, context?: LocalContext): Promise<GenerateContentResponse> {
    return callWithRetry(async () => {
      const ai = getAI();
      return await ai.models.generateContent({ 
        model: "gemini-3-flash-preview", 
        contents: prompt, 
        config: { tools: [{ googleSearch: {} }] } 
      });
    });
  },

  async generateQuiz(content: string, context?: LocalContext) {
    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Quiz on: ${content}. Language: Hindi.`,
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswerIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING }
              },
              required: ["question", "options", "correctAnswerIndex", "explanation"]
            }
          }
        }
      });
      return JSON.parse(response.text || "[]");
    });
  },

  async generatePersonalHistory(notes: string, context: LocalContext): Promise<GenerateContentResponse> {
    return callWithRetry(async () => {
      const ai = getAI();
      return await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Turn notes into biography: ${notes}. Language: ${context.language}.`,
      });
    });
  },

  async getRegionalContext(lat: number, lng: number): Promise<any> {
    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Country, city for coords: ${lat}, ${lng}.`,
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              country: { type: Type.STRING },
              city: { type: Type.STRING },
              language: { type: Type.STRING }
            },
            required: ["country", "city", "language"]
          }
        }
      });
      return JSON.parse(response.text || "{}");
    });
  },
  
  async getDailyHighlights(context: LocalContext): Promise<any> {
    return callWithRetry(async () => {
      const ai = getAI();
      const now = new Date();
      const dateStr = now.toDateString();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Based on today's date ${dateStr}, provide: 1. A daily legal article context. 2. A major historical event from this same calendar day in the past. Language: Hindi.`,
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              article: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING }
                },
                required: ["title", "content"]
              },
              history: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING }
                },
                required: ["title", "content"]
              }
            },
            required: ["article", "history"]
          }
        }
      });
      return JSON.parse(response.text || "{}");
    });
  },

  async getWeeklyCompetition(context: LocalContext): Promise<Competition> {
    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Weekly knowledge competition. Language: Hindi.",
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              theme: { type: Type.STRING },
              rules: { type: Type.ARRAY, items: { type: Type.STRING } },
              prizePoints: { type: Type.INTEGER }
            },
            required: ["title", "description", "theme", "rules", "prizePoints"]
          }
        }
      });
      return JSON.parse(response.text || "{}");
    });
  },

  async getRelatedTopics(text: string, context: LocalContext): Promise<string[]> {
    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Based on: "${text}", suggest 4 short related topics for history/law study. Language: ${context.language}.`,
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });
      return JSON.parse(response.text || "[]");
    });
  },

  async editStudyImage(prompt: string, base64: string, mime: string): Promise<string> {
    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64, mimeType: mime } },
            { text: prompt }
          ]
        }
      });
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
      throw new Error("Image edit failed");
    });
  },

  async askComplexQuestion(prompt: string, context: LocalContext): Promise<GenerateContentResponse> {
    return callWithRetry(async () => {
      const ai = getAI();
      return await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: { systemInstruction: `Expert in psychology and law. Answer in ${context.language}.` }
      });
    });
  },

  async getLeaderboardData(userPoints: number, userName: string): Promise<LeaderboardEntry[]> {
    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a JSON array of 10 competitive users for a leaderboard. Include "${userName}" with ${userPoints} points (isCurrentUser: true).`,
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                rank: { type: Type.INTEGER },
                name: { type: Type.STRING },
                points: { type: Type.INTEGER },
                badge: { type: Type.STRING },
                isCurrentUser: { type: Type.BOOLEAN }
              },
              required: ["rank", "name", "points", "badge"]
            }
          }
        }
      });
      return JSON.parse(response.text || "[]");
    });
  },

  async getSchemerInsight(query: string, context: LocalContext): Promise<SchemerInsight> {
    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze: "${query}". JSON output for psychological insight. Language: ${context.language}.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              era: { type: Type.STRING },
              tactic: { type: Type.STRING },
              lesson: { type: Type.STRING },
              warningSigns: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["name", "era", "tactic", "lesson", "warningSigns"]
          }
        }
      });
      return JSON.parse(response.text || "{}");
    });
  },

  async analyzeModernScam(query: string, context: LocalContext): Promise<string> {
    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze potential modern scam/deception: "${query}". Language: ${context.language}.`,
      });
      return response.text || "";
    });
  },

  async explainCrimeScene(query: string, context: LocalContext): Promise<any> {
    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Explain crime scene analysis: "${query}". Language: ${context.language}.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              simpleAnalogy: { type: Type.STRING },
              theoryExplained: { type: Type.STRING },
              motiveAnalysis: { type: Type.STRING },
              clues: { type: Type.ARRAY, items: { type: Type.STRING } },
              forensicFacts: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "simpleAnalogy", "theoryExplained", "motiveAnalysis", "clues", "forensicFacts"]
          }
        }
      });
      return JSON.parse(response.text || "{}");
    });
  },

  async analyzeMissingLink(query: string, context: LocalContext): Promise<string> {
    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Bridge historical wisdom with modern problem: "${query}". Language: ${context.language}.`,
      });
      return response.text || "";
    });
  },

  async analyzeMarketPosition(context: LocalContext): Promise<string> {
    return callWithRetry(async () => {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Strategic market analysis of NagrikSetu (Law/History AI) in India. Language: ${context.language}.`,
      });
      return response.text || "";
    });
  },

  async askReligiousWisdom(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    return callWithRetry(async () => {
      const ai = getAI();
      return await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Universal religious wisdom for: "${query}". Language: ${context.language}.`,
        config: { tools: [{ googleSearch: {} }] }
      });
    });
  },

  async askCulturalWisdom(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    return callWithRetry(async () => {
      const ai = getAI();
      return await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Cultural and heritage insights for: "${query}". Language: ${context.language}.`,
        config: { tools: [{ googleSearch: {} }] }
      });
    });
  },

  async getExplorerInfo(location: { lat?: number; lng?: number }, context: LocalContext, query?: string): Promise<GenerateContentResponse> {
    return callWithRetry(async () => {
      const ai = getAI();
      const prompt = query || `Explore regional context at ${location.lat}, ${location.lng}. Language: ${context.language}.`;
      return await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleMaps: {} }, { googleSearch: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: location.lat && location.lng ? {
                latitude: location.lat,
                longitude: location.lng
              } : undefined
            }
          }
        }
      });
    });
  }
};
