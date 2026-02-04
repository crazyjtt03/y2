
import React, { useState, useRef, useEffect } from 'react';
import { getRelationshipAdvice } from '../services/geminiService';
import { Message } from '../types';
import { Send, User, Bot, Loader2 } from 'lucide-react';

const RelationshipCoach: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '你好，我是你的专属恋爱顾问。我知道你现在可能很难过。告诉我你们之间发生了什么，我会分析她的心理并帮你制定挽回方案。' }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    const advice = await getRelationshipAdvice([...messages, userMessage]);
    setMessages(prev => [...prev, { role: 'assistant', content: advice }]);
    setIsThinking(false);
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-140px)]">
      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm flex gap-2 ${
              m.role === 'user' 
                ? 'bg-rose-500 text-white rounded-tr-none shadow-sm' 
                : 'bg-white text-gray-800 shadow-sm rounded-tl-none border border-gray-100'
            }`}>
              {m.role === 'assistant' && <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center shrink-0"><Bot size={14} className="text-rose-500" /></div>}
              <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
              {m.role === 'user' && <div className="w-6 h-6 bg-rose-400 rounded-full flex items-center justify-center shrink-0"><User size={14} className="text-white" /></div>}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-400 p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2 text-[10px]">
              <Loader2 className="animate-spin text-rose-400" size={14} />
              <span className="animate-pulse italic">专家正在深度分析情感局势...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-50 flex gap-2 items-center">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="描述你的现状..."
          className="flex-1 px-5 py-2.5 rounded-full bg-gray-100 border-none outline-none focus:ring-1 focus:ring-rose-200 text-sm"
        />
        <button 
          onClick={handleSend}
          disabled={isThinking}
          className="w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center active:scale-90 transition-transform disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default RelationshipCoach;
