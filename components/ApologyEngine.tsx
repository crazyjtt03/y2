
import React, { useState } from 'react';
import { generateApology } from '../services/geminiService';
import { Sparkles, Send, Copy, RefreshCw, Heart } from 'lucide-react';

const ApologyEngine: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [duration, setDuration] = useState('');
  const [reason, setReason] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!nickname || !reason) {
      alert("请至少填写昵称和吵架原因哦");
      return;
    }
    setLoading(true);
    const text = await generateApology({ nickname, duration, reason, favoriteThings: hobbies });
    setResult(text);
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    alert("已复制到剪贴板，快去发给她吧！");
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Sparkles className="text-pink-500" size={20} /> 道歉信实验室
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 mb-1 ml-1">她的昵称</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-pink-200 outline-none transition-all text-sm"
              placeholder="例如：小猪、宝贝..."
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-gray-400 mb-1 ml-1">吵架原因</label>
            <textarea 
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-pink-200 outline-none transition-all text-sm h-24 resize-none"
              placeholder="尽量描述详细，AI才能感同身受..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-bold shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <Heart size={18} />}
            {loading ? "深度思考中..." : "立即生成真心话"}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm relative">
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 font-handwriting min-h-[150px]">
            {result}
          </div>
          <button 
            onClick={copyToClipboard}
            className="absolute top-4 right-4 p-2 bg-pink-50 rounded-full text-pink-500 active:scale-90 transition-transform"
          >
            <Copy size={16} />
          </button>
        </div>
      )}

      <div className="text-center px-4">
        <p className="text-[10px] text-gray-300">生成的信件仅供参考，真心实意才最重要哦</p>
      </div>
    </div>
  );
};

export default ApologyEngine;
