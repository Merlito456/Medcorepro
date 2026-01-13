
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async getSymptomAnalysis(symptoms: string) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyze the following symptoms and provide a potential list of clinical considerations, triage level, and suggested follow-up questions for a medical professional. Symptoms: ${symptoms}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              considerations: { type: Type.ARRAY, items: { type: Type.STRING } },
              triageLevel: { type: Type.STRING, description: "Low, Medium, or High priority" },
              followUpQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
              summary: { type: Type.STRING }
            },
            required: ["considerations", "triageLevel", "followUpQuestions", "summary"]
          }
        }
      });
      // Use .text property and trim it as recommended for JSON extraction
      const text = response.text;
      return text ? JSON.parse(text.trim()) : null;
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      return null;
    }
  },

  async draftSoapNotes(transcript: string) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Convert the following patient consultation transcript into a professional SOAP note (Subjective, Objective, Assessment, Plan). Transcript: ${transcript}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              subjective: { type: Type.STRING },
              objective: { type: Type.STRING },
              assessment: { type: Type.STRING },
              plan: { type: Type.STRING }
            },
            required: ["subjective", "objective", "assessment", "plan"]
          }
        }
      });
      // Use .text property and trim it as recommended for JSON extraction
      const text = response.text;
      return text ? JSON.parse(text.trim()) : null;
    } catch (error) {
      console.error("Gemini SOAP Error:", error);
      return null;
    }
  }
};