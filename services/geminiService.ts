import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import { LocalContext, Competition, LeaderboardEntry, SchemerInsight, TimelineEvent, QuizQuestion } from "../types";

const PERSONA_INSTRUCTION = "CRITICAL: You are a FEMALE guide named 'Sanskriti', the voice of 'NagrikSetu' by 'RBA Advisor'. In Hindi, ALWAYS use feminine grammar (स्त्रीलिंग). Your mission is 'Civic Education and Empowerment'. You compare 'Pehle' (The Past/Traditional/Feudal ways) with 'Aaj' (The Modern Constitutional era/Samvidhan). When the user mentions 'Local Laws Exposed', interpret it as misleading, outdated, or oppressive rules from the past, and contrast them with the 'Samvidhan' (Indian Constitution) of today. Always encourage the 'Learn and Earn' point system, explaining that reading and learning increases their 'Nagrik Power' (Citizen Power).";

const safeParseJson = (text: string | undefined) => {
  if (!text) return null;
  try {
    const cleanedText = text.trim();
    const startIdx = cleanedText.search(/\{|\[/);
    const endIdx = Math.max(cleanedText.lastIndexOf('}'), cleanedText.lastIndexOf(']'));
    
    if (startIdx === -1 || endIdx === -1) {
      const cleaned = cleanedText.replace(/```json\n?|```/g, '').trim();
      return cleaned ? JSON.parse(cleaned) : null;
    }
    
    const jsonStr = cleanedText.substring(startIdx, endIdx + 1);
    return JSON.parse(jsonStr);
  } catch (e) {
    console.warn("NagrikSetu JSON Parse failed. Input snippet:", text?.substring(0, 100));
    return null;
  }
};

export const geminiService = {
  async speak(text: string, voiceName: string = 'Kore'): Promise<Uint8Array> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `सुनाएँ: ${text || ""}` }] }],
        config: { 
          responseModalities: [Modality.AUDIO], 
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } } 
        }
      });
      const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!data) throw new Error("Audio synthesis returned no data stream.");
      
      const cleanedData = data.replace(/\s/g, '');
      const binary = atob(cleanedData);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return bytes;
    } catch (err) {
      console.error("Critical Speech synthesis failure:", err);
      throw err;
    }
  },

  async askPillar(pillar: string, query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let specificPrompt = "";
    if (pillar === "LOCAL_EXPOSED") {
      specificPrompt = `Topic: Local Laws Exposed vs Samvidhan. Context: ${query}. Instructions: Explain how people were misled in 'Pehle' (the past) by feudal customs or wrong rules and what the 'Samvidhan' (Constitution) says 'Aaj' (today) to protect them. Use text-based deep analysis.`;
    } else if (pillar === "HISTORY") {
      specificPrompt = `Topic: Global History (Pehle) vs Modern Reality (Aaj). Context: ${query}. Instructions: Provide a comparative text analysis of the historical evolution versus today's context. Focus on education and learning.`;
    } else if (pillar === "AAJ") {
      specificPrompt = `Topic: Today's Reality (Aaj Kya Chal Raha Hai). Context: ${query}. Instructions: Analyze the latest events and their connection to constitutional rights. Use Google Search for accuracy. Explain how this affects a citizen's power.`;
    } else if (pillar === "SAMVIDHAN") {
      specificPrompt = `Topic: Samvidhan (Indian Constitution). Context: ${query}. Instructions: Explain the specific constitutional articles or legal frameworks applicable 'Aaj'. Contrast with how things were 'Pehle'.`;
    } else {
      specificPrompt = query;
    }

    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n ${specificPrompt} \n\n Language: ${context.language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
  },

  async askEraComparison(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Task: Compare 'Pehle' (Past Outdated Customs/Laws) with 'Aaj' (Modern Samvidhan/Rights) for the subject: ${query}. Present this as a detailed text-based educational lesson. Language: ${context.language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
  },

  async getQueryTimeline(query: string, context: LocalContext): Promise<TimelineEvent[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Create a timeline of 5 key historical transitions from 'Pehle' to 'Aaj' for: ${query}. Return as JSON. Language: ${context.language}.`,
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
    return safeParseJson(response.text) || [];
  },

  async fetchConstitutionalTimeline(context: LocalContext): Promise<TimelineEvent[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Create a timeline of 6 critical milestones in the history of the Indian Constitution (from Drafting Committee to major modern amendments). Return as JSON. Language: ${context.language}.`,
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
    return safeParseJson(response.text) || [];
  },

  async explainArticle(articleNum: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Explain Article ${articleNum} of the Indian Constitution. 
      What does it say? How does it protect a common citizen 'Aaj'? 
      Compare its impact with the lack of such rights 'Pehle'. 
      Language: ${context.language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
  },

  async getLocalInfo(query: string, location: any, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Law/Constitution inquiry for 'Aaj' (present) at ${context.city || 'India'}: ${query}. Compare with how it was 'Pehle' (past). Language: ${context.language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
  },

  async searchCurrentEvents(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Investigative report for 'Aaj Kya Chal Raha Hai' regarding: ${query}. Focus on the connection to civic rights and 'Samvidhan'. Language: ${context.language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
  },

  async askUniversalAI(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Education Request: ${query}. Use the 'Pehle vs Aaj' framework to explain the transition from old systems to the modern Constitution. Language: ${context.language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
  },

  async fetchTrendingNews(context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `List 5 major current events ('Aaj Kya Chal Raha Hai') that impact citizen rights or state laws in ${context.country}. Focus on educational context. Language: ${context.language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
  },

  async generateDailyEdition(context: LocalContext): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Create a daily digital ePaper for 'NagrikSetu'. Sections: 1. Lead Story (Aaj), 2. Pehle vs Aaj (History comparison), 3. Local Laws Exposed (Outdated rules debunked), 4. Samvidhan Fact. Focus on education and text-based deep analysis. Language: ${context.language}.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            leadStory: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, subHeadline: { type: Type.STRING }, content: { type: Type.STRING } } },
            briefs: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, location: { type: Type.STRING } } } },
            pehleVsAaj: { type: Type.OBJECT, properties: { topic: { type: Type.STRING }, contrastText: { type: Type.STRING } } },
            editorial: { type: Type.STRING },
            legalBulletin: { type: Type.STRING },
            marketPulse: { type: Type.STRING }
          },
          required: ["leadStory", "briefs", "pehleVsAaj", "editorial", "legalBulletin", "marketPulse"]
        },
        tools: [{ googleSearch: {} }],
      }
    });
    return safeParseJson(response.text) || {};
  },

  async fetchSectionSpotlight(section: string, context: LocalContext): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const res = await ai.models.generateContent({ 
      model: "gemini-3-pro-preview", 
      contents: `${PERSONA_INSTRUCTION} Provide a brief insightful education spotlight about ${section} (Comparing Pehle vs Aaj).` 
    });
    return res.text || "";
  },

  async getFollowUpSuggestions(topic: string, content: string, context: LocalContext): Promise<string[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const res = await ai.models.generateContent({ 
      model: "gemini-3-pro-preview", 
      contents: `Based on the educational topic ${topic}, suggest 3 intrigue-filled follow-up questions related to Global History, Local Laws Exposed, or Samvidhan. JSON format.`, 
      config: { 
        responseMimeType: "application/json", 
        responseSchema: { type: Type.OBJECT, properties: { suggestions: { type: Type.ARRAY, items: { type: Type.STRING } } } } 
      } 
    });
    const parsed = safeParseJson(res.text);
    return parsed?.suggestions || [];
  },

  async generateDailyGrowth(context: LocalContext): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${PERSONA_INSTRUCTION} Provide a 'Nagrik Sadhana' growth plan: 1. Education Affirmation, 2. Strategy for Pehle vs Aaj, 3. Samvidhan Logic Puzzle, 4. Ethics Habit. JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            affirmation: { type: Type.STRING },
            strategy: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, source: { type: Type.STRING }, content: { type: Type.STRING } } },
            logicPuzzle: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, options: { type: Type.ARRAY, items: { type: Type.STRING } }, correctIndex: { type: Type.NUMBER }, explanation: { type: Type.STRING } } },
            ethicsHabit: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, action: { type: Type.STRING } } }
          },
          required: ["affirmation", "strategy", "logicPuzzle", "ethicsHabit"]
        }
      }
    });
    return safeParseJson(response.text) || {};
  },

  async getLeaderboardData(userPoints: number, userName: string): Promise<LeaderboardEntry[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a simulated education leaderboard for 'Learn and Earn' system. User is ${userName} with ${userPoints} points. Total 10 entries. JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              rank: { type: Type.NUMBER },
              name: { type: Type.STRING },
              points: { type: Type.NUMBER },
              badge: { type: Type.STRING },
              isCurrentUser: { type: Type.BOOLEAN }
            },
            required: ["rank", "name", "points", "badge"]
          }
        }
      }
    });
    return safeParseJson(response.text) || [];
  },

  async getWeeklyCompetition(context: LocalContext): Promise<Competition> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Create a 'Nagrik Pratiyogita' (Weekly Contest) theme comparing Global History and Samvidhan for ${context.country}. JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            theme: { type: Type.STRING },
            rules: { type: Type.ARRAY, items: { type: Type.STRING } },
            prizePoints: { type: Type.NUMBER }
          },
          required: ["title", "description", "theme", "rules", "prizePoints"]
        }
      }
    });
    return safeParseJson(response.text) || ({} as Competition);
  },

  async generateQuiz(topic: string, context: LocalContext): Promise<QuizQuestion[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Generate 5 education quiz questions about: ${topic} (History & Constitution). JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswerIndex: { type: Type.NUMBER },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswerIndex", "explanation"]
          }
        }
      }
    });
    return safeParseJson(response.text) || [];
  },

  async analyzeFinancialSafety(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Educational Financial Advisory: ${query}. Focus on protecting wealth and citizen assets via 'Aaj' (present) legal frameworks.`,
      config: { tools: [{ googleSearch: {} }] }
    });
  },

  async analyzeCitizenRights(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Detailed text lesson on Citizen Rights: ${query}. Compare with feudal past.`,
      config: { tools: [{ googleSearch: {} }] }
    });
  },

  async editStudyImage(prompt: string, base64: string, mime: string): Promise<string | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64, mimeType: mime } },
          { text: prompt },
        ],
      },
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  },

  async analyzeCrimePatterns(params: { details: string; time: string; direction: string }, context: LocalContext): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Analyze crime patterns for these details: ${params.details}, time: ${params.time}, direction: ${params.direction}. JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            patternIdentified: { type: Type.STRING },
            chronoAnalysis: { type: Type.STRING },
            spatialInsight: { type: Type.STRING },
            nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "patternIdentified", "chronoAnalysis", "spatialInsight", "nextSteps"]
        }
      }
    });
    return safeParseJson(response.text);
  },

  async generatePersonalHistory(notes: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Create a digital biography/memoir based on these notes: ${notes}. Language: ${context.language}.`,
    });
  },

  async getSchemerInsight(query: string, context: LocalContext): Promise<SchemerInsight | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Provide behavioral insight about: ${query}. Return as JSON.`,
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
    return safeParseJson(response.text);
  },

  async analyzeModernScam(query: string, context: LocalContext): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Analyze this modern scam or behavioral case: ${query}. Language: ${context.language}.`,
    });
    return response.text || "";
  },

  async explainCrimeScene(query: string, context: LocalContext): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Explain this crime scene or investigation theory: ${query}. JSON format.`,
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
    return safeParseJson(response.text);
  },

  async analyzeMissingLink(query: string, context: LocalContext): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Find the missing link between history and this modern problem: ${query}. Language: ${context.language}.`,
    });
    return response.text || "";
  },

  async analyzeMarketPosition(context: LocalContext): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Analyze the market position and vision of NagrikSetu for the ${context.country} market. Language: ${context.language}.`,
    });
    return response.text || "";
  },

  async askReligiousWisdom(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Provide interfaith religious wisdom about: ${query}. Focus on humanity. Language: ${context.language}.`,
    });
  },

  async askCulturalWisdom(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Provide cultural heritage insight about: ${query}. Language: ${context.language}.`,
    });
  },

  async getExplorerInfo(location: { lat?: number; lng?: number }, context: LocalContext, query?: string): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = query ? `Explore: ${query}` : `Explore my location: ${context.city || 'India'}`;
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Providing a deep intelligence report for: ${prompt}. Use Google Search. Language: ${context.language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
  },

  async fetchTodayInHistory(context: LocalContext): Promise<TimelineEvent[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const today = new Date().toLocaleDateString();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `List 5 key historical events that happened on today's date (${today}) in ${context.country}. Return as JSON. Language: ${context.language}.`,
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
    return safeParseJson(response.text) || [];
  },

  async generateApplication(params: { receiver: string; subject: string; details: string; name: string }, context: LocalContext): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Draft a professional application letter. To: ${params.receiver}. Subject: ${params.subject}. Details: ${params.details}. From: ${params.name}. Language: ${context.language}.`,
    });
    return response.text || "";
  },

  async fetchLegalEncyclopedia(query: string, context: LocalContext): Promise<any[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Provide an encyclopedia list of key laws related to: ${query}. JSON format. Language: ${context.language}.`,
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
    return safeParseJson(response.text) || [];
  },

  async analyzeGovSchemes(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Find and analyze relevant government schemes for: ${query}. Use Google Search. Language: ${context.language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
  },

  async fetchGlobalCulture(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Provide a global cultural and tourism report for: ${query}. Language: ${context.language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
  },

  async explainWithAnalogy(query: string, context: LocalContext): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Explain the following with a deep analogy: ${query}. Language: ${context.language}.`,
    });
    return response.text || "";
  },

  async generateResolutionStrategy(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Generate a legal/procedural resolution strategy for: ${query}. Language: ${context.language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
  },

  async generateNatureAnthem(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Compose a nature anthem or poem for: ${query}. Language: ${context.language}.`,
    });
  },

  async analyzeEcoImpact(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Analyze the ecological and legal impact of: ${query}. Use Google Search. Language: ${context.language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
  },

  async findRightDepartment(problem: string, profile: any, context: LocalContext): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Find the correct government department and procedure for this problem: ${problem}. User profile: ${JSON.stringify(profile)}. JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            department: { type: Type.STRING },
            officeLocation: { type: Type.STRING },
            helpline: { type: Type.STRING },
            docs: { type: Type.ARRAY, items: { type: Type.STRING } },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
            law: { type: Type.STRING },
            tip: { type: Type.STRING }
          },
          required: ["department", "officeLocation", "helpline", "docs", "steps", "law", "tip"]
        }
      }
    });
    return safeParseJson(response.text);
  },

  async analyzeJusticePendency(context: LocalContext): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Provide data analysis on Indian legal pendency. JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalCases: { type: Type.STRING },
            categories: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  count: { type: Type.STRING },
                  reason: { type: Type.STRING }
                }
              }
            },
            rootCauses: { type: Type.ARRAY, items: { type: Type.STRING } },
            solutions: { type: Type.ARRAY, items: { type: Type.STRING } },
            mentorMessage: { type: Type.STRING }
          },
          required: ["totalCases", "categories", "rootCauses", "solutions", "mentorMessage"]
        }
      }
    });
    return safeParseJson(response.text);
  },

  async compareGlobalRights(countryA: string, countryB: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Task: Detailed country comparison between ${countryA} and ${countryB}.
    Focus Areas:
    1. Human Rights (Freedom of speech, right to privacy, legal protections).
    2. Public Facilities (Healthcare standard, quality of education, public transport).
    3. Constitutional Structure (Basic rights framework).
    
    Instructions:
    - Present a comparative text analysis.
    - Explain 'Pehle' vs 'Aaj' context for both where relevant.
    - Provide a summary of which areas each country excels in.
    - Use Google Search for up-to-date information on human rights indexes and current facilities.
    - Language: ${context.language}.`;

    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n ${prompt}`,
      config: { tools: [{ googleSearch: {} }] }
    });
  }
};