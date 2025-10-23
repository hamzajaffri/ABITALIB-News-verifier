
import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-black/50 border-t border-cyan-500/20 py-6 z-10">
      <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
        <p>&copy; {currentYear} ABITALIB GROUPS. All Rights Reserved.</p>
        <p className="mt-1">Created by HAMZA JAFFRI, CEO & Founder of ABITALIB GROUPS.</p>
      </div>
    </footer>
  );
};
