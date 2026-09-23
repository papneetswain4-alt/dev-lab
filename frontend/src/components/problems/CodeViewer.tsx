import React, { useState } from 'react';
import { Copy, Check, FileCode, Terminal } from 'lucide-react';
import type { Solution } from '../../types/dsa';

interface CodeViewerProps {
  solutions: Solution[];
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ solutions }) => {
  const [selectedSolutionIndex, setSelectedSolutionIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!solutions || solutions.length === 0) {
    return (
      <div className="liquid-glass rounded-2xl p-8 text-center text-muted-foreground border border-white/10">
        No solution file available for this problem.
      </div>
    );
  }

  const activeSolution = solutions[selectedSolutionIndex] || solutions[0];
  const lines = activeSolution.code.split(/\r?\n/);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeSolution.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  return (
    <div className="liquid-glass rounded-2xl border border-white/10 overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          {/* Solution tabs if multiple solutions exist, or language badge */}
          {solutions.length > 1 ? (
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-white/5 border border-white/10">
              {solutions.map((sol, idx) => (
                <button
                  key={sol.filename}
                  type="button"
                  onClick={() => setSelectedSolutionIndex(idx)}
                  className={`text-xs font-mono px-3 py-1 rounded transition-colors ${
                    selectedSolutionIndex === idx
                      ? 'bg-white/15 text-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {sol.filename}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-neon-accent font-semibold tracking-wider uppercase">
                <Terminal size={13} />
                {activeSolution.language}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-muted-foreground/80">
                <FileCode size={13} />
                {activeSolution.filename}
              </span>
            </div>
          )}
        </div>

        {/* Copy button */}
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy solution code"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg liquid-glass border border-white/10 hover:border-white/20 text-xs font-mono text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer active:scale-95"
        >
          {copied ? (
            <>
              <Check size={14} className="text-neon-accent" />
              <span className="text-neon-accent font-semibold">COPIED</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>COPY</span>
            </>
          )}
        </button>
      </div>

      {/* Code container with line numbers and horizontal scrolling */}
      <div className="overflow-x-auto p-4 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed text-foreground/90 selection:bg-neon-accent selection:text-background max-h-[700px] overflow-y-auto">
        <table className="border-collapse w-full">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                <td className="pr-5 select-none text-muted-foreground/40 text-right w-10 font-mono text-xs align-top">
                  {idx + 1}
                </td>
                <td className="whitespace-pre font-mono pl-3 border-l border-white/5">
                  {line || ' '}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
