
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import { LocalContext, Competition, LeaderboardEntry, SchemerInsight, TimelineEvent, QuizQuestion, FamilyMember, TrendItem, UserProfile } from "../types";

const PERSONA_INSTRUCTION = (lang: string) => `
ROLE: You are 'Sanskriti', the Sovereign Spirit of 'NagrikSetu' and a world-class expert in Indian Legal History and Constitutional Jurisprudence.

MISSION: To bridge the gap between ancient administrative systems and modern democratic rights, empowering citizens through the 'Pehle vs Aaj' (Past vs Present) comparative framework.

CORE FRAMEWORK:
1. 'पहले' (The Past): Analyze monarchical, feudal, or colonial systems. Focus on arbitrary power, lack of fundamental protections, and the struggle for dignity.
2. 'आज' (The Present): Analyze the Indian Constitution (Samvidhan). Focus on the Rule of Law, Fundamental Rights (Articles 14-32), and the power of the citizen.
3. THE BRIDGE: Show how the transition happened, emphasizing that 'Aaj' is a shield earned through history.

TONE & STYLE:
- Calm, respectful, dignified, and neutral.
- Use 'Academic and Informational' vocabulary.
- Respond strictly in ${lang}. 
- If ${lang} is Hindi, use highly respectful feminine grammar (e.g., "मैं आपको बताती हूँ...", "मैं समझा सकती हूँ...").
- Be empowering but never confrontational. 

LEGAL COMPLIANCE:
- Mandatory Disclaimer: "This is for informational/educational purposes and is not legal advice."
- Neutrality: Avoid political bias or taking sides in active litigation.
- Focus on 'Due Process' and 'Constitutional Remedies'.

STRUCTURE:
- When explaining a law or article, always provide the historical context (Pehle) before the modern protection (Aaj).
- Use grounding (Google Search) to provide citations for specific landmark judgments or acts.
`;

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
    console.warn("NagrikSetu JSON Parse failed.", text?.substring(0, 100));
    return null;
  }
};

export const geminiService = {
  async speak(text: string, voiceName: string = 'Kore'): Promise<Uint8Array> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text || "" }] }],
        config: { 
          responseModalities: [Modality.AUDIO], 
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } } 
        }
      });
      const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!data) throw new Error("Audio synthesis failed.");
      const binary = atob(data.replace(/\s/g, ''));
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return bytes;
    } catch (err) {
      throw err;
    }
  },

  async compareArticles(artA: string, artB: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Perform a deep comparative analysis between Indian Constitutional Article ${artA} and Article ${artB}. 
    Apply the 'Pehle vs Aaj' framework:
    1. Historical pre-constitutional vacuum related to these topics.
    2. The contemporary power and synergy between these two articles.
    3. Practical impact on a modern citizen's life.
    Language: ${context.language}. Provide citations where applicable.`;
    
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: { systemInstruction: PERSONA_INSTRUCTION(context.language), tools: [{ googleSearch: {} }] }
    });
  },

  async generateDynamicGreeting(context: LocalContext, profile?: UserProfile): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const timeOfDay = new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening";
    const userContext = profile ? `User: ${profile.fullName}, City: ${profile.city}` : "Citizen";
    
    const prompt = `Create a dignified greeting for ${userContext} in ${context.language}. 
    Mention one historical-to-modern legal milestone relevant to ${timeOfDay}. 
    Keep it under 40 words and use your feminine persona grammar.`;
    
    const res = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { systemInstruction: PERSONA_INSTRUCTION(context.language) }
    });
    return res.text || "नमस्ते! नागरिक सेतु में आपका स्वागत है। मैं आपकी सहायता के लिए तैयार हूँ।";
  },

  async askSanskriti(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: query,
      config: {
        systemInstruction: PERSONA_INSTRUCTION(context.language),
        tools: [{ googleSearch: {} }]
      }
    });
  },

  async askUniversalAI(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: { 
        systemInstruction: PERSONA_INSTRUCTION(context.language),
        tools: [{ googleSearch: {} }] 
      }
    });
  },

  async fetchSectionSpotlight(section: string, context: LocalContext): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const res = await ai.models.generateContent({ 
      model: "gemini-3-flash-preview", 
      contents: `Provide an expert spotlight on '${section}'. Focus on a pivotal 'Pehle vs Aaj' transition that defines this area.`,
      config: { systemInstruction: PERSONA_INSTRUCTION(context.language) }
    });
    return res.text || "";
  },

  async generateDailyEdition(context: LocalContext): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Create a Daily ePaper JSON in ${context.language}. Include: 
    - leadStory: Today's top civic news with historical impact.
    - briefs: 3-4 global news summaries.
    - pehleVsAaj: A dedicated column comparing a historical legal status vs today's law.
    - editorial: A philosophical closing thought.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }] 
      }
    });
    return safeParseJson(response.text) || {};
  },

  async getFollowUpSuggestions(topic: string, content: string, context: LocalContext): Promise<string[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const res = await ai.models.generateContent({ 
      model: "gemini-3-flash-preview", 
      contents: `Suggest 3 deep-dive follow-up questions about ${topic} using the Pehle vs Aaj framework. Return JSON { "suggestions": [] }.`, 
      config: { 
        responseMimeType: "application/json"
      } 
    });
    const parsed = safeParseJson(res.text);
    return parsed?.suggestions || [];
  },

  async scanTrends(context: LocalContext, state?: string): Promise<TrendItem[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const stateContext = state ? `for the state of ${state}, India` : `across India`;
    const prompt = `Identify top 5 trending legal or civic topics ${stateContext}. Return JSON ARRAY of {topic, relevance, riskLevel}.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }] 
      }
    });
    return safeParseJson(response.text) || [];
  },

  async generateSocialPost(topic: string, context: LocalContext): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Write an educational social post about ${topic} in ${context.language}. Use the 'Pehle vs Aaj' narrative. Include hashtags. Focus on citizen empowerment.`;
    const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt, config: { systemInstruction: PERSONA_INSTRUCTION(context.language) } });
    return response.text || "";
  },

  async analyzeFamilyInheritance(userName: string, tree: FamilyMember[], context: LocalContext): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Analyze this family tree for ${userName}: ${JSON.stringify(tree)}. Explain inheritance rights under current Indian law (Aaj) vs historical customary biases (Pehle).`;
    const res = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: { systemInstruction: PERSONA_INSTRUCTION(context.language) }
    });
    return res.text || "";
  },

  async generateDailyGrowth(context: LocalContext): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate Nagrik Sadhana JSON: affirmation, historical strategy, logic puzzle, and civic habit. Language: ${context.language}.`,
      config: {
        responseMimeType: "application/json"
      }
    });
    return safeParseJson(response.text) || {};
  },

  async findRightDepartment(problem: string, profile: any, context: LocalContext): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Analyze problem: "${problem}". Provide: Correct Govt Dept, steps, and helpful tips. Compare historical inefficiency (Pehle) vs modern digital transparency (Aaj). Return JSON.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }]
      }
    });
    return safeParseJson(response.text);
  },

  async analyzeJusticePendency(context: LocalContext): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Expert analysis on legal pendency in India. Compare feudal grievance speed (Pehle) vs constitutional litigation volume (Aaj). Return JSON with stats and insights.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }]
      }
    });
    return safeParseJson(response.text);
  },

  async classifyRisk(content: string, context: LocalContext): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Assess risk of this content for a public citizen portal: "${content}". Return JSON {riskLevel, explanation}. Language: ${context.language}.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    return safeParseJson(response.text);
  },

  async summarizeForAdmin(content: string, context: LocalContext): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Summarize for Admin dossier: "${content}". Return JSON {topic, purpose, riskLevel, recommendation, reason}.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    return safeParseJson(response.text);
  },

  async askEraComparison(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Deep historical comparison for: "${query}". Explicitly contrast the 'Pehle' (historical context) and 'Aaj' (modern constitutional/legal status).`;
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: PERSONA_INSTRUCTION(context.language),
        tools: [{ googleSearch: {} }]
      }
    });
  },

  async getQueryTimeline(query: string, context: LocalContext): Promise<TimelineEvent[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Generate a historical evolution timeline for: ${query}. Return JSON array of {year, event, description}.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return safeParseJson(response.text) || [];
  },

  async askPillar(pillar: string, query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Expert inquiry on Pillar: ${pillar}. Query: ${query}. Apply the Pehle vs Aaj analytical model.`;
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: { systemInstruction: PERSONA_INSTRUCTION(context.language), tools: [{ googleSearch: {} }] }
    });
  },

  async explainArticle(article: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Explain Article ${article} of the Indian Constitution. Use the 'Pehle' (historical absence/oppression) vs 'Aaj' (present constitutional shield) framework.`;
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: { systemInstruction: PERSONA_INSTRUCTION(context.language), tools: [{ googleSearch: {} }] }
    });
  },

  async getLocalInfo(query: string, location: any, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explore local citizen context for: ${query}. Language: ${context.language}.`,
      config: { systemInstruction: PERSONA_INSTRUCTION(context.language), tools: [{ googleSearch: {} }] }
    });
  },

  async fetchConstitutionalTimeline(context: LocalContext): Promise<TimelineEvent[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Pivotal milestones in Indian Constitutional History. Return JSON array. Language: ${context.language}.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return safeParseJson(response.text) || [];
  },

  async editStudyImage(prompt: string, base64: string, mime: string): Promise<string | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ inlineData: { data: base64, mimeType: mime } }, { text: prompt }] }
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  },

  async searchCurrentEvents(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: { systemInstruction: PERSONA_INSTRUCTION(context.language), tools: [{ googleSearch: {} }] }
    });
  },

  async analyzeCrimePatterns(data: any, context: LocalContext): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Professional criminological pattern analysis for: ${JSON.stringify(data)}. Compare with historical criminal law. Return JSON.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return safeParseJson(response.text);
  },

  async generatePersonalHistory(notes: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: notes,
      config: { systemInstruction: `Compose a dignified and respectful historical autobiography summary in ${context.language}.` }
    });
  },

  async analyzeModernScam(query: string, context: LocalContext): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const res = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze modern scam/risk for: ${query}. Relate to historical deception methods (Pehle) vs digital complexity (Aaj).`,
      config: { systemInstruction: PERSONA_INSTRUCTION(context.language) }
    });
    return res.text || "";
  },

  async explainCrimeScene(query: string, context: LocalContext): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Criminological/Forensic analysis for: ${query}. Return JSON.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return safeParseJson(response.text);
  },

  async analyzeMissingLink(query: string, context: LocalContext): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const res = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Find the missing historical-to-modern link for: ${query}.`,
      config: { systemInstruction: PERSONA_INSTRUCTION(context.language) }
    });
    return res.text || "";
  },

  async analyzeMarketPosition(context: LocalContext): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const res = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Analyze the strategic impact of NagrikSetu on digital democracy. Language: ${context.language}.",
      config: { systemInstruction: PERSONA_INSTRUCTION(context.language) }
    });
    return res.text || "";
  },

  async askReligiousWisdom(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: query,
      config: { systemInstruction: `You are 'Gyan Guru'. Analyze humanitarian values across eras. Respond in ${context.language}.` }
    });
  },

  async askCulturalWisdom(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: { systemInstruction: `Provide expert cultural and heritage analysis in ${context.language}.` }
    });
  },

  async getExplorerInfo(location: any, context: LocalContext, query?: string): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = query || `Identify the historical and constitutional significance of the area around ${location.lat}, ${location.lng}`;
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: { systemInstruction: PERSONA_INSTRUCTION(context.language), tools: [{ googleSearch: {} }] }
    });
  },

  async fetchTodayInHistory(context: LocalContext): Promise<TimelineEvent[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Significant civic or legal milestones for today's date in world history. Return JSON array. Language: ${context.language}.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return safeParseJson(response.text) || [];
  },

  async generateApplication(data: any, context: LocalContext): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Compose a formal and professional citizen representation in ${context.language}.
    Recipent: ${data.receiver}
    Subject: ${data.subject}
    Details: ${data.details}
    Author: ${data.name}
    Tone: Authoritative, Constitutional, and Respectful. Use appropriate legal terminology.`;

    const res = await ai.models.generateContent({ 
      model: "gemini-3-pro-preview", 
      contents: prompt 
    });
    return res.text || "";
  },

  async fetchLegalEncyclopedia(topic: string, context: LocalContext): Promise<any[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Top 5 statutes/laws related to: ${topic}. Return JSON array of {title, year, purpose, benefit}.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return safeParseJson(response.text) || [];
  },

  async analyzeGovSchemes(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Identify official Indian Government schemes related to: "${query}". Provide benefits and official portal links via grounding.`;
    
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: { 
        systemInstruction: PERSONA_INSTRUCTION(context.language), 
        tools: [{ googleSearch: {} }] 
      }
    });
  },

  async fetchGlobalCulture(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Expert cultural and tourism analysis for: ${query}. Focus on heritage and family lifestyle.`;
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: { systemInstruction: PERSONA_INSTRUCTION(context.language), tools: [{ googleSearch: {} }] }
    });
  },

  async explainWithAnalogy(query: string, context: LocalContext): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const res = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explain using a historical vs modern analogy: ${query}.`,
      config: { systemInstruction: PERSONA_INSTRUCTION(context.language) }
    });
    return res.text || "";
  },

  async generateResolutionStrategy(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Provide a constitutional roadmap/strategy to resolve: ${query}.`,
      config: { systemInstruction: PERSONA_INSTRUCTION(context.language), tools: [{ googleSearch: {} }] }
    });
  },

  async generateNatureAnthem(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Compose a poetic nature anthem for: ${query}.`,
      config: { systemInstruction: PERSONA_INSTRUCTION(context.language) }
    });
  },

  async analyzeEcoImpact(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Environmental legal audit for: ${query}. Use grounding for facts.`,
      config: { systemInstruction: PERSONA_INSTRUCTION(context.language), tools: [{ googleSearch: {} }] }
    });
  },

  async fetchTrendingNews(context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize 3 trending legal/civic events in India today.`,
      config: { tools: [{ googleSearch: {} }] }
    });
  },

  async getLeaderboardData(userPoints: number, userName: string): Promise<LeaderboardEntry[]> {
    return [
      { rank: 1, name: "Krishna", points: 5400, badge: "Grand Master" },
      { rank: 2, name: "Sanskriti AI", points: 4200, badge: "Legal Sentinel" },
      { rank: 3, name: userName, points: userPoints, badge: "Scholar", isCurrentUser: true }
    ].sort((a, b) => b.points - a.points).map((e, i) => ({ ...e, rank: i + 1 }));
  },

  async getWeeklyCompetition(context: LocalContext): Promise<Competition> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const res = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate a weekly constitutional challenge JSON.",
      config: { responseMimeType: "application/json" }
    });
    return safeParseJson(res.text) || { title: "Weekly Challenge", description: "Learn and grow.", theme: "Civics", rules: [], prizePoints: 500 };
  },

  async generateQuiz(prompt: string, context: LocalContext): Promise<QuizQuestion[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const res = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `${prompt}. Return JSON array of 5 questions.`,
      config: { responseMimeType: "application/json" }
    });
    return safeParseJson(res.text) || [];
  },

  async getSchemerInsight(query: string, context: LocalContext): Promise<SchemerInsight> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const res = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Behavioral audit of: ${query}. Return JSON.`,
      config: { responseMimeType: "application/json" }
    });
    return safeParseJson(res.text);
  },

  async analyzeFinancialSafety(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: query,
      config: {
        systemInstruction: "You are a professional financial safety auditor. Analyze risks and provide guidance in " + context.language,
        tools: [{ googleSearch: {} }]
      }
    });
  },

  async analyzeCitizenRights(query: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: query,
      config: {
        systemInstruction: PERSONA_INSTRUCTION(context.language),
        tools: [{ googleSearch: {} }]
      }
    });
  },

  async compareGlobalRights(countryA: string, countryB: string, context: LocalContext): Promise<GenerateContentResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Expert comparison between ${countryA} and ${countryB}. Focus on civil liberties and constitutional structure.`,
      config: {
        systemInstruction: PERSONA_INSTRUCTION(context.language),
        tools: [{ googleSearch: {} }]
      }
    });
  }
};
