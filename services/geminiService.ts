import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_API_KEY } from "@env";
import { Book } from "../types";

const apiKey = GEMINI_API_KEY;

export const getReadingSuggestions = async (finishedBooks: Book[]): Promise<string> => {
    if (!apiKey) {
        console.error("API_KEY is not set. Cannot fetch suggestions.");
        throw new Error("API_KEY for Gemini is not configured.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const bookList = finishedBooks.map(b => `- "${b.title}" by ${b.authors.join(', ')}`).join('\n');
    const prompt = `Based on the following list of books I've finished and enjoyed, please recommend 2 new books I can find on Google Books. For each recommendation, provide a title, author, and a short, compelling reason why I would like it.
    
    Finished books:
    ${bookList}
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: "The title of the suggested book." },
                            author: { type: Type.STRING, description: "The author of the suggested book." },
                            reason: { type: Type.STRING, description: "Why the user might like this book based on their reading history." }
                        },
                        required: ["title", "author", "reason"]
                    }
                }
            }
        });

        return response.text;
    } catch (error) {
        console.error("Error fetching reading suggestions from Gemini:", error);
        throw new Error("Failed to get reading suggestions.");
    }
};