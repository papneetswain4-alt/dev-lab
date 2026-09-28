import React, { useState } from 'react';
import { Copy, Check, FileCode, Terminal } from 'lucide-react';
import type { Solution } from '../../types/dsa';
import { AsciiImageTexture } from '../cinematic/AsciiImageTexture';

interface CodeViewerProps {
  solutions: Solution[];
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ solutions }) => {
  const [selectedSolutionIndex, setSelectedSolutionIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!solutions || solutions.length === 0) {
    return (
      <div className="cinematic-panel rounded-2xl p-8 text-center text-[#9a9a9a] border border-white/10 font-mono text-xs">
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
    <div className="relative cinematic-panel rounded-2xl border border-white/10 overflow-hidden group">
      {/* Subtle Code Header Texture */}
      <AsciiImageTexture
        texture="texture-02"
        crop="top-right"
        fade="to-b"
        dotSpacing={6.2}
        density={1.0}
        detail={1.10}
        contrast={1.35}
        opacity={0.20}
        hoverOpacity={0.34}
      />

      <div className="relative z-10">
        {/* Header bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          {solutions.length > 1 ? (
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-black/60 border border-white/10">
              {solutions.map((sol, idx) => (
                <button
                  key={sol.filename}
                  type="button"
                  onClick={() => setSelectedSolutionIndex(idx)}
                  className={`text-xs font-mono px-3 py-1 rounded transition-colors ${
                    selectedSolutionIndex === idx
                      ? 'bg-white/15 text-white font-medium'
                      : 'text-[#9a9a9a] hover:text-white'
                  }`}
                >
                  {sol.filename}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 font-mono text-xs text-[#9a9a9a]">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white font-mono uppercase">
                <Terminal size={12} className="opacity-80" />
                {activeSolution.language}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[#6f6f6f]">
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
          className="metallic-btn px-3 py-1 text-xs font-mono text-[#9a9a9a] hover:text-white inline-flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? (
            <>
              <Check size={13} className="text-white" />
              <span className="text-white">COPIED</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>COPY</span>
            </>
          )}
        </button>
      </div>

      {/* Code container with line numbers and horizontal scrolling */}
      <div className="overflow-x-auto p-4 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed text-[#d4d4d4] selection:bg-white/20 selection:text-white max-h-[700px] overflow-y-auto">
        <table className="border-collapse w-full">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                <td className="pr-5 select-none text-[#6f6f6f]/50 text-right w-10 font-mono text-xs align-top">
                  {idx + 1}
                </td>
                <td className="whitespace-pre font-mono pl-3 border-l border-white/5 text-[#d8d8d8]">
                  {line || ' '}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
};
