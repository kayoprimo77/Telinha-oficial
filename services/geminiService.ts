import { GoogleGenAI } from "@google/genai";
import { Message } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateReply = async (
  history: Message[],
  systemInstruction: string
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Format history for the model to understand the context
    // We limit to last 10 messages to keep context relevant and fast
    const recentHistory = history.slice(-10).map(msg => 
      `${msg.sender === 'me' ? 'User' : 'You'}: ${msg.text}`
    ).join('\n');

    const prompt = `
      Context: This is a roleplay chat on WhatsApp.
      Role: ${systemInstruction}
      
      Conversation history:
      ${recentHistory}
      
      Reply to the last message as the character defined in Role. 
      Keep the response short, casual, and styled like a text message. 
      Do not include "You:" prefix.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating reply:", error);
    return "Desculpe, estou sem sinal agora... (Erro de API)";
  }
};