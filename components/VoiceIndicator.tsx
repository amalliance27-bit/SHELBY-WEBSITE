import React from 'react';

interface VoiceIndicatorProps {
  isActive: boolean;
  isSpeaking: boolean;
  toggle: () => void;
  error?: string | null;
}

export const VoiceIndicator: React.FC<VoiceIndicatorProps> = ({ isActive, isSpeaking, toggle, error }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2">
      {error && (
        <div className="bg-red-600 text-white text-xs px-3 py-1 rounded-full mb-2 animate-bounce text-center border border-red-400 shadow-lg max-w-[200px]">
          {error}
        </div>
      )}
      {isActive && !error && (
        <div className="bg-teal-900/90 text-white text-sm px-3 py-1 rounded-full backdrop-blur-md mb-2 animate-fade-in text-center border border-yellow-400/30">
          {isSpeaking ? "Pandora is explaining..." : "Pandora is listening..."}
        </div>
      )}
      <button
        onClick={toggle}
        className={`relative flex items-center justify-center w-12 h-12 rounded-full shadow-2xl transition-all duration-300 border-2 ${
          isActive ? 'bg-red-600 border-red-400 scale-110' : 'bg-teal-900 border-yellow-400 hover:scale-105 hover:bg-teal-800'
        }`}
      >
        {/* Pulsing rings when active */}
        {isActive && (
          <>
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
            <span className={`absolute inline-flex h-full w-full rounded-full border-2 border-white opacity-50 ${isSpeaking ? 'animate-pulse scale-125' : ''}`}></span>
          </>
        )}
        
        {/* Mic Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </button>
    </div>
  );
};