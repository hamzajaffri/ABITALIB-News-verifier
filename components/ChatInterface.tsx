import React, { useState, useRef, useEffect } from 'react';
import type { Message, VerificationResultData } from '../types';
import { type GroundingChunk, type Chat } from '@google/genai';
import { startChatSession } from '../services/geminiService';
import { Gauge } from './Gauge';
import { Typewriter } from './Typewriter';

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d="m22 2-7 20-4-9-9-4Z"/><path d="m22 2-11 11"/>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gray-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const BotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-cyan-400"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
);

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
);


export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = startChatSession();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCopy = (message: Message) => {
    const textToCopy = message.verificationResult
      ? JSON.stringify(message.verificationResult.data, null, 2)
      : message.text;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedMessageId(message.id);
      setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
    }).catch(err => {
      console.error("Failed to copy text: ", err);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const modelMessageId = (Date.now() + 1).toString();
    const modelMessage: Message = { id: modelMessageId, role: 'model', text: '' };
    setMessages(prev => [...prev, modelMessage]);

    let fullResponseJson = '';
    let sources: GroundingChunk[] = [];

    try {
      if (!chatRef.current) throw new Error("Chat session not initialized.");
      
      const stream = await chatRef.current.sendMessageStream({ message: input });

      for await (const chunk of stream) {
        fullResponseJson += chunk.text;
        if (chunk.candidates?.[0]?.groundingMetadata?.groundingChunks) {
            sources = chunk.candidates[0].groundingMetadata.groundingChunks;
        }

        setMessages(prev => prev.map(msg => msg.id === modelMessageId ? { ...msg, text: fullResponseJson } : msg));
      }
      
      // Attempt to parse the final JSON
      try {
        // Sanitize the string to make it valid JSON
        const sanitizedJson = fullResponseJson.replace(/```json\n|```/g, '').trim();
        const resultData: VerificationResultData = JSON.parse(sanitizedJson);
        setMessages(prev => prev.map(msg => 
          msg.id === modelMessageId ? {
            ...msg,
            text: resultData.summary,
            verificationResult: {
              type: 'verification',
              data: resultData,
              sources: sources
            }
          } : msg
        ));
      } catch (parseError) {
         console.error("JSON parsing error:", parseError);
         // If parsing fails, just keep the raw text.
         setMessages(prev => prev.map(msg => 
            msg.id === modelMessageId ? { ...msg, text: "Received a non-JSON response. Displaying raw output:\n" + fullResponseJson } : msg
         ));
      }

    } catch (error) {
      console.error('Gemini API error:', error);
      const errorMessage = { id: modelMessageId, role: 'model' as const, text: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => prev.map(msg => msg.id === modelMessageId ? errorMessage : msg));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="verifier" className="flex flex-col h-[70vh] max-h-[800px] bg-gray-900/50 backdrop-blur-md rounded-xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 overflow-hidden">
      <div className="flex-grow p-6 overflow-y-auto space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && <BotIcon />}
            <div className={`group relative max-w-xl p-4 rounded-lg shadow-md ${msg.role === 'user' ? 'bg-gray-700' : 'bg-gray-800 border border-cyan-500/20'}`}>
              {msg.role === 'model' && msg.text && (
                <div className="absolute top-2 right-2">
                    <button
                        onClick={() => handleCopy(msg)}
                        className="p-1.5 rounded-md bg-gray-900/50 text-gray-400 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-gray-700/70 hover:text-gray-200"
                        aria-label={copiedMessageId === msg.id ? 'Copied to clipboard' : 'Copy response to clipboard'}
                    >
                        {copiedMessageId === msg.id ? <CheckIcon /> : <CopyIcon />}
                    </button>
                </div>
              )}
              {msg.verificationResult ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-6">
                    <Gauge percentage={msg.verificationResult.data.authenticityPercentage} />
                    <div className="flex-1">
                      <h3 className="font-orbitron text-lg text-cyan-400">Verification Analysis</h3>
                      <p className="text-gray-300 text-sm">
                        <Typewriter text={msg.verificationResult.data.summary} />
                      </p>
                    </div>
                  </div>
                   <div>
                        <h4 className="font-orbitron text-md text-cyan-400 mt-4 mb-2">Key Points</h4>
                        <ul className="space-y-2 text-sm">
                            {msg.verificationResult.data.keyPoints.map((kp, i) => (
                                <li key={i} className="flex items-start gap-2 p-2 bg-gray-900/50 rounded">
                                    {kp.isVerified ? 
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> :
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                                    }
                                    <div>
                                        <p className="font-semibold text-gray-200">{kp.point}</p>
                                        <p className="text-gray-400">{kp.evidence}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                  {msg.verificationResult.sources && msg.verificationResult.sources.length > 0 && (
                     <div>
                        <h4 className="font-orbitron text-md text-cyan-400 mt-4 mb-2">Sources</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            {msg.verificationResult.sources.map((source, i) => (
                                <a key={i} href={source.web?.uri} target="_blank" rel="noopener noreferrer" className="block p-2 bg-gray-900/50 rounded hover:bg-gray-800/70 transition-colors truncate">
                                    <p className="font-semibold text-cyan-400 truncate">{source.web?.title}</p>
                                    <p className="text-gray-500 text-xs truncate">{source.web?.uri}</p>
                                </a>
                            ))}
                        </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-300 whitespace-pre-wrap">{msg.text}</p>
              )}
            </div>
            {msg.role === 'user' && <UserIcon />}
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'model' && (
           <div className="flex items-start gap-4 justify-start">
             <BotIcon />
             <div className="max-w-xl p-4 rounded-lg shadow-md bg-gray-800 border border-cyan-500/20">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-400">Analyzing...</span>
                </div>
                 <div className="mt-2 text-gray-400 text-sm whitespace-pre-wrap">{messages[messages.length - 1]?.text}</div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-cyan-500/30">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter news text or URL to verify..."
            className="w-full bg-gray-800 border border-gray-600 rounded-full py-3 pl-5 pr-14 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-cyan-400 bg-gray-700 hover:bg-cyan-500 hover:text-gray-900 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon />
          </button>
        </div>
      </form>
    </div>
  );
};
