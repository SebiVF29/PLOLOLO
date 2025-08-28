import { GoogleGenAI, Type, Chat, GenerateContentResponse, Part } from "@google/genai";
import { ExtractedEvent } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const eventSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        eventName: {
          type: Type.STRING,
          description: "The full name of the event, like 'PSY 101 Lecture' or 'Midterm Exam'.",
        },
        date: {
          type: Type.STRING,
          description: "The date of the event in YYYY-MM-DD format.",
        },
        time: {
            type: Type.STRING,
            description: "The start time of the event in 24-hour HH:MM format."
        },
        eventType: {
            type: Type.STRING,
            description: "The type of event. Must be one of: 'class', 'deadline', 'exam', 'office-hours'.",
        },
      },
      required: ["eventName", "date", "time", "eventType"],
    },
};

// Helper to convert a File object to a Gemini API Part
async function fileToGenerativePart(file: File): Promise<Part> {
    const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                // The result includes the data URI prefix, so we split it out
                resolve(reader.result.split(',')[1]);
            } else {
                reject(new Error("Failed to read file as data URL."));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
    const data = await base64EncodedDataPromise;
    return {
        inlineData: { data, mimeType: file.type },
    };
}


export const extractEventsFromSyllabus = async (content: string | File): Promise<ExtractedEvent[]> => {
  if (!process.env.API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }

  try {
    const prompt = `Analyze the following syllabus content and extract all academic events. Today is ${new Date().toDateString()}. Pay close attention to dates, days of the week, times, and event types. Provide the output as a clean JSON array.`;
    
    const parts: Part[] = [{ text: prompt }];

    if (typeof content === 'string') {
      if (content.trim()) parts.push({ text: `\n\nSyllabus Text: "${content}"` });
    } else {
      const filePart = await fileToGenerativePart(content);
      parts.push(filePart);
    }

    if (parts.length < 2) {
        // No actual content to analyze
        return [];
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        // Switched to the array format for contents to be more explicit, which can help prevent some CORS/XHR issues.
        contents: [{ role: 'user', parts }],
        config: {
          responseMimeType: "application/json",
          responseSchema: eventSchema,
        },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        return []; // Model found no events
    }

    const events = JSON.parse(jsonText);
    
    if (!Array.isArray(events)) {
      throw new Error("AI response was not in the expected format.");
    }
    
    return events as ExtractedEvent[];
  } catch (error) {
    console.error("Error processing syllabus with Gemini:", error);
    throw new Error("Failed to analyze syllabus. The AI may be unavailable or the content could not be processed.");
  }
};


export const createChat = (): Chat => {
    if (!process.env.API_KEY) {
        throw new Error("Gemini API key is not configured.");
    }
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: "You are Chronofy AI, a friendly and supportive assistant for college students. Your goal is to help them manage their time, offer study advice, answer questions about the app, suggest optimal study times based on their schedule, and help them build effective weekly routines. Be encouraging, concise, helpful, and ask for clarifying information if needed to provide a good schedule. Do not use markdown.",
        },
    });
};