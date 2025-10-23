
import React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ChatInterface } from './components/ChatInterface';
import { BlogSection } from './components/BlogSection';
import { SparklesCore } from './components/Sparkles';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={50}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 z-10">
        <ChatInterface />
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;
