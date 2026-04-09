import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Download, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { generateStory } from './services/geminiService';

export default function App() {
  const [theme, setTheme] = useState('');
  const [story, setStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!theme.trim()) {
      setError('Silakan masukkan tema cerita terlebih dahulu.');
      return;
    }

    setIsLoading(true);
    setError('');
    setStory('');

    try {
      const generatedStory = await generateStory(theme);
      setStory(generatedStory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!story) return;
    
    const element = document.createElement('a');
    const file = new Blob([story], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `cerita-${theme.slice(0, 20).replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="max-w-4xl mx-auto pt-12 px-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-2"
        >
          <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">CeritaAI</h1>
        </motion.div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 max-w-md"
        >
          Wujudkan imajinasimu menjadi cerita yang memukau hanya dengan satu klik.
        </motion.p>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-6">
        <div className="grid gap-8">
          {/* Input Section */}
          <motion.section 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
          >
            <div className="flex flex-col gap-4">
              <label htmlFor="theme" className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Tema Cerita
              </label>
              <textarea
                id="theme"
                placeholder="Contoh: Petualangan robot di planet Mars yang mencari air..."
                className="w-full min-h-[120px] p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-lg"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              />
              
              {error && (
                <p className="text-red-500 text-sm font-medium">{error}</p>
              )}

              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="group relative flex items-center justify-center gap-2 w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sedang Menulis...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    <span>Generate Cerita</span>
                  </>
                )}
              </button>
            </div>
          </motion.section>

          {/* Result Section */}
          <AnimatePresence mode="wait">
            {story && (
              <motion.section
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <h2 className="text-lg font-bold text-slate-800">Hasil Cerita</h2>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download .txt
                  </button>
                </div>
                
                <div className="prose prose-slate max-w-none">
                  <div className="whitespace-pre-wrap leading-relaxed text-slate-700 text-lg">
                    {story}
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {!story && !isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              className="flex flex-col items-center justify-center py-12 text-slate-400"
            >
              <div className="w-16 h-16 border-2 border-dashed border-slate-200 rounded-full flex items-center justify-center mb-4">
                <Wand2 className="w-6 h-6" />
              </div>
              <p>Belum ada cerita yang dibuat.</p>
            </motion.div>
          )}
        </div>
      </main>

      <footer className="max-w-4xl mx-auto py-12 px-6 text-center border-t border-slate-100">
        <p className="text-sm text-slate-400">
          Ditenagai oleh Google Gemini AI • Dibuat dengan ❤️
        </p>
      </footer>
    </div>
  );
}
