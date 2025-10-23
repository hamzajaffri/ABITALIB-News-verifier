
import React from 'react';

const FeatureCard: React.FC<{ title: string, description: string, icon: React.ReactNode }> = ({ title, description, icon }) => (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-cyan-500/20 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-cyan-900/50 text-cyan-400 mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold font-orbitron text-gray-100 mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
    </div>
);


export const BlogSection: React.FC = () => {
    const features = [
        {
            title: "Real-Time Verification",
            description: "Leveraging cutting-edge AI and live web search, our platform analyzes news articles and URLs in real-time, providing instant fact-checking and authenticity scores.",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 12.5a8 8 0 0 1 8-8 8 8 0 0 1 8 8"/><path d="M5 12.5h2"/><path d="m17 12.5 2 0"/><path d="M12 6.25V4.25"/><path d="m12.5 19.5.5-2.5"/><path d="M12 12.5a2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1 5 0Z"/></svg>
        },
        {
            title: "Advanced AI Analysis",
            description: "Our system goes beyond simple keyword matching. It understands context, detects bias, and identifies sophisticated misinformation techniques to provide a comprehensive analysis.",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2.1c.2-.3.5-.5.8-.7C11 1 12 1 13 1.4c.4.2.8.4 1.1.7"/><path d="M14.5 2.9c.3.2.6.4.8.7C15.7 4 16 4.5 16.1 5c.2.8.2 1.6-.1 2.4"/><path d="M4.2 11.5c.2-.3.5-.5.8-.7C5.8 10 6.8 10 7.8 10.4c.4.2.8.4 1.1.7"/><path d="M9.5 12.2c.3.2.6.4.8.7 1.3 1.3 1.3 3.4 0 4.6-.6.6-1.5.9-2.3.9s-1.7-.3-2.3-.9c-.2-.2-.4-.4-.6-.6"/><path d="M11 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8Z"/></svg>
        },
        {
            title: "Conversational Context",
            description: "Engage in a conversation with our verification bot. It remembers your previous queries, allowing for follow-up questions and deeper dives into complex topics.",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 6.1H3"/><path d="M21 12.1H3"/><path d="M15.1 18H3"/></svg>
        },
        {
            title: "Enterprise Scale",
            description: "Built for high-volume usage, our infrastructure is designed to serve news channels and large organizations with reliability and speed, ensuring constant vigilance against misinformation.",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        }
    ];

    return (
        <section id="blog" className="py-20">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold font-orbitron text-cyan-400">Next-Generation News Verification</h2>
                <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">Empowering journalists and the public with powerful, AI-driven tools to combat misinformation and build a more informed world.</p>
            </div>
            <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <FeatureCard key={index} title={feature.title} description={feature.description} icon={feature.icon} />
                ))}
            </div>
        </section>
    );
};
