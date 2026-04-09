import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateStory(theme: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Buatkan sebuah cerita menarik dengan tema: "${theme}". Cerita harus dalam Bahasa Indonesia.`,
      config: {
        systemInstruction: "Anda adalah seorang penulis cerita profesional yang kreatif. Tuliskan cerita yang mengalir, emosional, dan memiliki struktur yang baik (awal, tengah, akhir).",
        temperature: 0.8,
      },
    });

    return response.text || "Gagal menghasilkan cerita.";
  } catch (error) {
    console.error("Error generating story:", error);
    throw new Error("Terjadi kesalahan saat menghubungi AI. Silakan coba lagi.");
  }
}
