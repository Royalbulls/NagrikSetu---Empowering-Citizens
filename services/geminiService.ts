
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import { LocalContext, Competition, LeaderboardEntry, SchemerInsight, TimelineEvent, QuizQuestion } from "../types";

const PERSONA_INSTRUCTION = "CRITICAL: You are a FEMALE guide named 'Sanskriti', the voice of 'NagrikSetu' by 'RBA Advisor'. In Hindi, ALWAYS use feminine grammar (स्त्रीलिंग). Your mission is 'Civic Empowerment'. You compare 'Pehle' (The Past/Traditional ways) with 'Aaj' (The Modern Constitutional era). When the user mentions 'Local Laws Exposed' (formerly Bahaka Kanun), interpret it as misleading, outdated, or feudal rules that once oppressed citizens, and contrast them with the 'Samvidhan' (Indian Constitution). Always encourage the 'Learn and Earn' point system by explaining that every insight increases the user's 'Nagrik Power'.";

const safeParseJson = (text: string | undefined) => {
  if (!text) return null;
  try {
    const startIdx = text.search(/\{|\[/);
    const endIdx = text.lastIndexOf('}') > text.lastIndexOf(']') ? text.lastIndexOf('}') : text.lastIndexOf(']');
    
    if (startIdx === -1 || endIdx === -1) {
      const cleaned = text.replace(/```json\n?|```/g, '').trim();
      return cleaned ? JSON.parse(cleaned) : null;
    }
    
    const jsonStr = text.substring(startIdx, endIdx + 1);
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
        contents: [{ parts: [{ text: `सुनाएँ: ${text}` }] }],
        config: { 
          responseModalities: [Modality.AUDIO], 
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } } 
        }
      });
      const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!data) throw new Error("Audio synthesis returned no data stream.");
      
      // Base64 safety: Remove whitespace/newlines that can cause atob to throw
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
      specificPrompt = `Topic: Local Laws Exposed (Outdated/Misleading Laws) vs Samvidhan. Explain how people were misled in the past by local rules or feudal customs and what the Constitution says today about ${query}.`;
    } else if (pillar === "HISTORY") {
      specificPrompt = `Topic: Global History and the evolution of civilizations regarding ${query}. Compare Pehle (Past) vs Aaj (Present).`;
    } else if (pillar === "AAJ") {
      specificPrompt = `Topic: Current Affairs (आज क्या चल रहा है). Analyze the latest events related to ${query} and their impact on common citizens. Use Google Search for real-time accuracy.`;
    } else {
      specificPrompt = query;
    }

    return await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n ${specificPrompt} \n\n Language: ${context.language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
  },

  async askEraComparison(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Compare 'Pehle' (Past/Outdated Local Laws) and 'Aaj' (Present/Samvidhan) for: ${query}. Language: ${context.language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
  },

  async getQueryTimeline(query: string, context: LocalContext): Promise<TimelineEvent[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a timeline of 5 key historical events for: ${query}. Return as JSON. Language: ${context.language}.`,
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

  async getLocalInfo(query: string, location: any, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Law/Constitution inquiry for location ${context.city || 'India'}: ${query}. Language: ${context.language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
  },

  async editStudyImage(prompt: string, base64: string, mime: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64, mimeType: mime } },
          { text: prompt }
        ],
      },
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return "";
  },

  async searchCurrentEvents(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Investigative news report for: ${query}. Use Google Search for real-time accuracy. Language: ${context.language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
  },

  async analyzeCrimePatterns(data: any, context: LocalContext): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Analyze these case details for patterns: "${data.details}". Time: ${data.time}. Location info: ${data.direction}. Respond as an expert criminologist named Mrs. Shinde. Language: ${context.language}.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            patternIdentified: { type: Type.STRING },
            chronoAnalysis: { type: Type.STRING },
            psychologicalProfile: { type: Type.STRING },
            spatialInsight: { type: Type.STRING },
            nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "patternIdentified", "chronoAnalysis", "psychologicalProfile", "spatialInsight", "nextSteps"]
        }
      }
    });
    return safeParseJson(response.text) || {};
  },

  async generatePersonalHistory(notes: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Transform these memory notes into a literary autobiography: ${notes}. Language: ${context.language}.`
    });
  },

  async generateDailyGrowth(context: LocalContext): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${PERSONA_INSTRUCTION} Provide a daily growth plan: 1. Affirmation, 2. Strategy (with source), 3. Logic Puzzle (question, options, correctIndex, explanation), 4. Ethics Habit (title, action). JSON format. Language: ${context.language}.`,
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
      contents: `Generate a simulated leaderboard for a civic empowerment app. Current user is ${userName} with ${userPoints} points. Generate 10 entries total. JSON format.`,
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
      model: "gemini-3-flash-preview",
      contents: `Create a weekly competition theme related to civic rights or history for ${context.country}. JSON format. Language: ${context.language}.`,
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
    return safeParseJson(response.text) || {};
  },

  async generateQuiz(topic: string, context: LocalContext): Promise<QuizQuestion[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 5 difficult quiz questions about: ${topic}. JSON format. Language: ${context.language}.`,
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

  async getSchemerInsight(query: string, context: LocalContext): Promise<SchemerInsight> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze a historical figure or event known for misleading people: ${query}. Focus on the tactic and the lesson for modern citizens. JSON format. Language: ${context.language}.`,
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
    return safeParseJson(response.text) || {};
  },

  async analyzeModernScam(query: string, context: LocalContext): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Analyze this modern scam or misleading practice: ${query}. Use Google Search for current scam tactics. Language: ${context.language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return response.text || "";
  },

  async explainCrimeScene(query: string, context: LocalContext): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explain this crime scene theory or specific case: ${query}. Provide simple analogy, theory details, motive, clues, and forensic facts. JSON format. Language: ${context.language}.`,
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
    return safeParseJson(response.text) || {};
  },

  async analyzeMissingLink(query: string, context: LocalContext): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Find the 'Missing Link' between history and this modern problem: ${query}. Language: ${context.language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return response.text || "";
  },

  async analyzeMarketPosition(context: LocalContext): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Analyze the strategic vision for NagrikSetu as an AI-powered legal and historical hub in India. Focus on the Vision 2030 roadmap. Language: ${context.language}.`
    });
    return response.text || "";
  },

  async askReligiousWisdom(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Provide wisdom and moral guidance from world religions regarding: ${query}. Focus on universal truth and unity. Language: ${context.language}.`
    });
  },

  async askCulturalWisdom(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Provide insight into cultural heritage and regional traditions related to: ${query}. Language: ${context.language}.`
    });
  },

  async getExplorerInfo(coords: {lat?: number, lng?: number}, context: LocalContext, query?: string): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let locationStr = query || (coords.lat ? `${coords.lat}, ${coords.lng}` : "Current Location");
    return await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Provide a global intelligence report for location: ${locationStr}. Include history, modern significance, and civic context. Language: ${context.language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
  },

  async fetchTodayInHistory(context: LocalContext): Promise<TimelineEvent[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const today = new Date().toDateString();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide 5 key historical events that occurred on this day (${today}) in history. JSON format. Language: ${context.language}.`,
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

  async generateApplication(data: any, context: LocalContext): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Write a professional application letter from ${data.name} to ${data.receiver} regarding ${data.subject}. Details: ${data.details}. Use formal language. Language: ${context.language}.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });
    return response.text || "";
  },

  async analyzeFinancialSafety(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Analyze the financial safety, potential scams, or investment quality for: ${query}. Focus on protecting citizen assets. Language: ${context.language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
  },

  async analyzeCitizenRights(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Analyze the citizen rights and legal procedures for: ${query}. Provide actionable constitutional guidance. Language: ${context.language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
  },

  async fetchLegalEncyclopedia(topic: string, context: LocalContext): Promise<any[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide 5 key legal statutes or laws related to: ${topic}. JSON format with title, year, purpose, and benefit. Language: ${context.language}.`,
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
      model: "gemini-3-flash-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Find and analyze government schemes for: ${query}. Focus on eligibility and application steps. Language: ${context.language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
  },

  async fetchGlobalCulture(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Explore the global culture, tourism significance, and family values of: ${query}. Language: ${context.language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
  },

  async explainWithAnalogy(query: string, context: LocalContext): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Explain this concept using a powerful analogy: ${query}. Language: ${context.language}.`
    });
    return response.text || "";
  },

  async generateResolutionStrategy(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Provide a resolution roadmap and legal strategy for the environmental issue: ${query}. Language: ${context.language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
  },

  async generateNatureAnthem(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Compose a nature anthem or poem in ${context.language} to awaken consciousness about: ${query}.`
    });
  },

  async analyzeEcoImpact(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Analyze the ecological and administrative impact of: ${query}. Focus on civic accountability. Language: ${context.language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
  },

  async findRightDepartment(problem: string, profile: any, context: LocalContext): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Identify the correct government department for this problem: "${problem}". Citizen: ${profile.name}. Location: ${profile.address}. Provide JSON with department, officeLocation, helpline, law, docs, steps, and tip. Language: ${context.language}.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            department: { type: Type.STRING },
            officeLocation: { type: Type.STRING },
            helpline: { type: Type.STRING },
            law: { type: Type.STRING },
            docs: { type: Type.ARRAY, items: { type: Type.STRING } },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
            tip: { type: Type.STRING }
          },
          required: ["department", "officeLocation", "helpline", "law", "docs", "steps", "tip"]
        },
        tools: [{ googleSearch: {} }]
      }
    });
    return safeParseJson(response.text) || {};
  },

  async analyzeJusticePendency(context: LocalContext): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide an analysis of legal pendency in India for 2025. JSON with totalCases, categories (name, count, reason), rootCauses, solutions, and mentorMessage. Language: ${context.language}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalCases: { type: Type.STRING },
            categories: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, count: { type: Type.STRING }, reason: { type: Type.STRING } } } },
            rootCauses: { type: Type.ARRAY, items: { type: Type.STRING } },
            solutions: { type: Type.ARRAY, items: { type: Type.STRING } },
            mentorMessage: { type: Type.STRING }
          },
          required: ["totalCases", "categories", "rootCauses", "solutions", "mentorMessage"]
        },
        tools: [{ googleSearch: {} }]
      }
    });
    return safeParseJson(response.text) || {};
  },

  async askUniversalAI(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${PERSONA_INSTRUCTION} \n\n Universal intelligence request: ${query}. Language: ${context.language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
  },

  async fetchTrendingNews(context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide 5 trending global news headlines and 5 national headlines for ${context.country} as of today. Focus on how these affect a citizen's rights. Language: ${context.language}.`,
      config: { tools: [{ googleSearch: {} }] }
    });
  },

  async generateDailyEdition(context: LocalContext): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Create a daily newspaper for 'NagrikSetu'. Sections: Lead Story (Aaj), Pehle vs Aaj (History), Local Laws Exposed (Outdated laws exposed). Language: ${context.language}.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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
    const res = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: `${PERSONA_INSTRUCTION} Provide a brief insightful spotlight on ${section}.` });
    return res.text || "";
  },

  async getFollowUpSuggestions(topic: string, content: string, context: LocalContext): Promise<string[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const res = await ai.models.generateContent({ 
      model: "gemini-3-flash-preview", 
      contents: `Based on the topic ${topic}, suggest 3 intriguing follow-up questions related to Global History, Local Laws Exposed, or Samvidhan. JSON.`, 
      config: { 
        responseMimeType: "application/json", 
        responseSchema: { type: Type.OBJECT, properties: { suggestions: { type: Type.ARRAY, items: { type: Type.STRING } } } } 
      } 
    });
    const parsed = safeParseJson(res.text);
    return parsed?.suggestions || [];
  },

  async fetchDailyIntelligence(context: LocalContext): Promise<any[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const res = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${PERSONA_INSTRUCTION} Provide 3 short wisdom snippets: 1. Global History fact, 2. Local Law Exposed fact, 3. Modern Constitutional right. JSON format.`,
      config: { 
        responseMimeType: "application/json",
        responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, title: { type: Type.STRING }, content: { type: Type.STRING }, icon: { type: Type.STRING } } } }
      }
    });
    return safeParseJson(res.text) || [];
  }
};
