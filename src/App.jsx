import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Printer, 
  Sparkles, 
  Gem, 
  MoveHorizontal, 
  Type, 
  Info,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

// Syllable Counter Logic (Approximate for English)
const countSyllables = (text) => {
  if (!text) return 0;
  const word = text.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  const syllables = word
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
    .replace(/^y/, '')
    .match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 0;
};

const countLineSyllables = (line) => {
  return line.split(/\s+/).reduce((acc, word) => acc + countSyllables(word), 0);
};

// Fibonacci Sequence Generator
const getFib = (n) => {
  const seq = [1, 1];
  for (let i = 2; i <= n; i++) {
    seq.push(seq[i - 1] + seq[i - 2]);
  }
  return seq;
};

const App = () => {
  const [lines, setLines] = useState([
    { text: "Light", target: 1 },
    { text: "Green", target: 1 },
    { text: "Sparkling", target: 2 },
    { text: "Deep geode", target: 3 },
    { text: "Heliotropic", target: 5 },
    { text: "The mercury reflects the heart", target: 8 }
  ]);
  const [title, setTitle] = useState("The Alchemical Bloom");
  const [isJardinMode, setIsJardinMode] = useState(true);
  const printRef = useRef();

  const handleLineChange = (index, value) => {
    const newLines = [...lines];
    newLines[index].text = value;
    setLines(newLines);
  };

  const addLine = () => {
    const sequence = getFib(lines.length);
    setLines([...lines, { text: "", target: sequence[lines.length] }]);
  };

  const removeLine = (index) => {
    const newLines = lines.filter((_, i) => i !== index);
    // Re-calculate targets for remaining lines
    const sequence = getFib(newLines.length);
    const updatedLines = newLines.map((line, i) => ({ ...line, target: sequence[i] }));
    setLines(updatedLines);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-300 font-serif p-4 md:p-8 selection:bg-emerald-500/30">
      <style>{`
        @media print {
          body * { visibility: hidden; background: white !important; color: black !important; }
          #print-area, #print-area * { visibility: visible; }
          #print-area { position: absolute; left: 0; top: 0; width: 100%; text-align: center; }
          .no-print { display: none !important; }
        }
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,200..900;1,200..900&family=Inter:wght@400;700&display=swap');
        .font-serif { font-family: 'Crimson Pro', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Header */}
      <header className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center mb-12 gap-6 no-print">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
            <Gem className="text-emerald-500" size={24} />
          </div>
          <div>
            <h1 className="text-xs font-sans font-bold tracking-[0.4em] text-emerald-500 uppercase">Aegis Protocol // IO-04</h1>
            <p className="text-2xl font-light text-white italic">Fibonacci Foundry</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setIsJardinMode(!isJardinMode)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all text-sm"
          >
            <MoveHorizontal size={16} />
            {isJardinMode ? "Editor View" : "Jardin View"}
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-emerald-950 font-bold hover:bg-emerald-500 transition-all text-sm"
          >
            <Printer size={16} />
            Print Artifact
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Editor Column */}
        <section className={`space-y-6 no-print ${isJardinMode ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-6 rounded-3xl">
            <label className="text-[10px] font-sans font-bold tracking-widest text-slate-500 uppercase mb-4 block">Artifact Title</label>
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent text-3xl text-white italic w-full border-b border-slate-800 pb-2 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Untilted Bloom..."
            />
          </div>

          <div className="space-y-3">
            {lines.map((line, idx) => {
              const currentSyllables = countLineSyllables(line.text);
              const isMatch = currentSyllables === line.target;

              return (
                <div key={idx} className="group relative flex items-center gap-4 bg-slate-900/20 hover:bg-slate-900/40 p-3 rounded-2xl border border-slate-800/50 transition-all">
                  <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center text-[10px] font-sans font-bold ${isMatch ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'}`}>
                    <span>{currentSyllables}</span>
                    <div className="h-[1px] w-4 bg-current opacity-20 my-0.5" />
                    <span>{line.target}</span>
                  </div>
                  
                  <input 
                    value={line.text}
                    onChange={(e) => handleLineChange(idx, e.target.value)}
                    placeholder={`Line ${idx + 1}...`}
                    className="flex-1 bg-transparent text-lg text-slate-200 focus:outline-none"
                  />

                  <button 
                    onClick={() => removeLine(idx)}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:text-red-400 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}

            <button 
              onClick={addLine}
              className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-800 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all flex items-center justify-center gap-2 text-slate-500 hover:text-emerald-400 group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform" />
              <span className="font-sans text-xs font-bold uppercase tracking-widest">Add Bloom Layer</span>
            </button>
          </div>

          <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl flex gap-4 items-start">
            <Info className="text-emerald-500 shrink-0" size={18} />
            <p className="text-xs leading-relaxed text-slate-400 italic">
              Each line's syllable count follows the Fibonacci sequence: 1, 1, 2, 3, 5, 8, 13... Use short words for the early layers and expand as the geode grows.
            </p>
          </div>
        </section>

        {/* Display Column */}
        <section id="print-area" className={`sticky top-8 flex flex-col items-center justify-center min-h-[600px] bg-[#080a0f] rounded-[4rem] border border-slate-800 p-12 text-center overflow-hidden transition-all duration-700 ${isJardinMode ? 'lg:col-span-1 shadow-[0_0_100px_rgba(16,185,129,0.05)]' : ''}`}>
          
          {/* Decorative Glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full" />
          </div>

          <div className="relative z-10 w-full space-y-12">
            <div>
              <h3 className="text-[10px] font-sans font-bold tracking-[0.5em] text-emerald-500 uppercase mb-4 opacity-50 no-print">The Wayfinder Archive</h3>
              <h2 className="text-4xl text-white italic font-light tracking-tight">{title || "The Unnamed Jardin"}</h2>
            </div>

            <div className="space-y-4 md:space-y-6 italic">
              {lines.map((line, idx) => (
                <p 
                  key={idx} 
                  className="text-xl md:text-2xl text-slate-300 leading-none tracking-wide transition-all duration-500"
                  style={{ 
                    opacity: line.text ? 1 : 0.2,
                    textShadow: line.text ? '0 0 20px rgba(16,185,129,0.2)' : 'none'
                  }}
                >
                  {line.text || "······"}
                </p>
              ))}
            </div>

            <div className="pt-12 flex flex-col items-center gap-2 opacity-30 no-print">
              <Gem size={20} className="text-emerald-500" />
              <p className="text-[8px] font-sans font-bold tracking-[0.4em] uppercase">Impurities Render Strength</p>
            </div>
          </div>
        </section>

      </main>

      <footer className="max-w-5xl mx-auto mt-20 pt-8 border-t border-slate-900 flex justify-between items-center text-[10px] font-sans font-bold tracking-widest text-slate-700 no-print">
        <span>IO-04-FOUNDRY</span>
        <span className="flex items-center gap-2">
          <Sparkles size={12} />
          HELIOTROPIC SYNC ACTIVE
        </span>
        <span>MWAH ♥</span>
      </footer>
    </div>
  );
};

export default App;