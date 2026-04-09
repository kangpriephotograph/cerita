import { GoogleGenAI } from "@google/genai";

// Lazy initialization to avoid crashes if API key is missing at load time
let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("API Key Gemini belum dikonfigurasi. Silakan tambahkan GEMINI_API_KEY di panel Secrets.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function generateStory(theme: string) {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Buatkan sebuah cerita menarik dengan tema: "${theme}". Cerita harus dalam Bahasa Indonesia.`,
      config: {
        systemInstruction: "Anda adalah seorang penulis cerita profesional yang kreatif. Tuliskan cerita yang mengalir, emosional, dan memiliki struktur yang baik (awal, tengah, akhir).",
        temperature: 0.8,
      },
    });

    if (!response.text) {
      throw new Error("AI tidak memberikan respon teks.");
    }

    return response.text;
  } catch (error: any) {
    console.error("Error generating story:", error);
    
    // Provide more specific error messages
    if (error.message?.includes("API Key")) {
      throw error;
    }
    
    if (error.message?.includes("fetch")) {
      throw new Error("Gagal terhubung ke server AI. Periksa koneksi internet Anda.");
    }

    throw new Error(`Gagal membuat cerita: ${error.message || "Terjadi kesalahan pada server AI."}`);
  }
}
