import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-black/50 backdrop-blur-sm sticky top-0 z-50 border-b border-cyan-500/20">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-cyan-400 font-orbitron tracking-widest">
          ABITALIB NEWS VERIFIER
        </h1>
      </div>
    </header>
  );
};
