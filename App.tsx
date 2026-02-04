
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ScrollText, Sparkles, Image as ImageIcon, Plus, Trash2, Save, Edit3, X, Heart, Eye, EyeOff, Upload, Lock, User as UserIcon, LogIn, Music, Music2 } from 'lucide-react';
import { StoryData } from './types';

const STORAGE_KEY = 'soulbind_story_data';
const ADMIN_USER = '杨二浪浪';
const ADMIN_PASS = '962464';

interface TapHeart {
  id: number;
  x: number;
  y: number;
}

// Component for a sophisticated 3D Dazzling Element (Butterfly/Crystal)
const Dazzling3DElement = ({ size = 200, onClick }: { size?: number; onClick?: (e: React.MouseEvent<HTMLDivElement>) => void }) => (
  <div 
    className="relative cursor-pointer group flex items-center justify-center perspective-container hover:scale-110 transition-transform duration-500"
    onClick={onClick}
    style={{ width: size, height: size * 0.8 }}
  >
    <div className="absolute w-4 h-12 bg-white rounded-full blur-sm shadow-[0_0_20px_#fff] z-20"></div>
    <div 
      className="absolute right-1/2 w-[45%] h-full iridescent-surface origin-right z-10"
      style={{ 
        clipPath: 'path("M100,50 C100,50 80,0 30,10 C0,20 0,60 40,80 C60,90 80,100 100,90 Z")',
        animation: 'wing-flap-left 1.5s ease-in-out infinite',
        opacity: 0.9
      }}
    >
      <div className="absolute inset-0 bg-white/20 blur-[1px]"></div>
    </div>
    <div 
      className="absolute left-1/2 w-[45%] h-full iridescent-surface origin-left z-10"
      style={{ 
        clipPath: 'path("M0,50 C0,50 20,0 70,10 C100,20 100,60 60,80 C40,90 20,100 0,90 Z")',
        animation: 'wing-flap-right 1.5s ease-in-out infinite',
        opacity: 0.9
      }}
    >
      <div className="absolute inset-0 bg-white/20 blur-[1px]"></div>
    </div>
    <div className="absolute inset-0 bg-rose-400/20 rounded-full blur-[60px] animate-pulse"></div>
    <Sparkles className="absolute -top-10 -right-4 text-pink-300 animate-bounce" size={24} />
    <Sparkles className="absolute -bottom-6 -left-8 text-indigo-300 animate-pulse delay-500" size={20} />
  </div>
);

const DEFAULT_STORY: StoryData = {
  nickname: '宝贝',
  letter: `此时此刻，我的心里乱极了。\n\n看着你难过，我比谁都责备自己。我知道这次是我不好，是我没有照顾到你的感受，是我在不经意间伤害了最爱我的你。\n\n还记得我们一起看过的夕阳，一起吃过的火锅吗？那些瞬间是我生命里最亮的星。我不希望因为我的愚钝，让这些星光暗淡下去。\n\n我想抱抱你，听你诉说委屈，而不是让你一个人面对冷冰冰的空气。给我一个机会，让我用接下来的每一天，来弥补这次的过错，好吗？`,
  promises: [
    '再生气也不冷战，第一时间抱紧你。',
    '学会换位思考，把你的心情放在第一位。',
    '每天都要给你一个早安吻，不管有多忙。'
  ],
  photos: [
    { url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=400', caption: '在花海里的那个午后' },
    { url: 'https://images.unsplash.com/photo-1516589174184-c685266d430c?auto=format&fit=crop&q=80&w=400', caption: '属于我们的第一次心跳' },
    { url: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&q=80&w=400', caption: '海边的脚印，我们的约定' },
    { url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=400', caption: '最温柔的时刻' }
  ],
  showPhotos: true,
  showPromises: true,
  bgMusicUrl: 'https://music.163.com/song/media/outer/url?id=139734.mp3', // Classic Piano
  showMusic: true
};

const App: React.FC = () => {
  const [mode, setMode] = useState<'setup' | 'intro' | 'scatter' | 'main' | 'login'>('intro');
  const [story, setStory] = useState<StoryData>(DEFAULT_STORY);
  const [petals, setPetals] = useState<number[]>([]);
  const [stars, setStars] = useState<number[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [tapHearts, setTapHearts] = useState<TapHeart[]>([]);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setStory(JSON.parse(saved));
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('edit') === '1') {
      setMode('login');
    }

    setPetals(Array.from({ length: 25 }).map((_, i) => i));
    setStars(Array.from({ length: 35 }).map((_, i) => i));
  }, []);

  const handleScreenClick = (e: React.MouseEvent) => {
    const newHeart: TapHeart = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY
    };
    setTapHearts(prev => [...prev, newHeart]);
    
    setTimeout(() => {
      setTapHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1500);
  };

  const toggleMusic = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.log('Music play blocked:', err));
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(story));
    setMode('intro');
  };

  const handleBloomClick = () => {
    setMode('scatter');
    // Start music on first interaction
    if (story.showMusic && audioRef.current && !isMusicPlaying) {
      audioRef.current.play().then(() => setIsMusicPlaying(true)).catch(err => console.log('Music play failed:', err));
    }
    setTimeout(() => {
      setMode('main');
    }, 1200);
  };

  const triggerSecretSetup = useCallback(() => {
    setClickCount(prev => {
      const nextCount = prev + 1;
      if (nextCount >= 5) {
        setMode('login');
        return 0;
      }
      return nextCount;
    });
    const timeout = setTimeout(() => setClickCount(0), 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div 
      className="min-h-screen relative overflow-x-hidden cursor-default select-none"
      onClick={handleScreenClick}
    >
      {/* Background Music Audio Element */}
      {story.bgMusicUrl && (
        <audio 
          ref={audioRef} 
          src={story.bgMusicUrl} 
          loop 
          preload="auto"
        />
      )}

      {/* Floating Music Toggle */}
      {story.showMusic && mode !== 'setup' && mode !== 'login' && (
        <button 
          onClick={toggleMusic}
          className={`fixed top-6 right-6 z-[60] w-12 h-12 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-md border border-white/40 shadow-lg transition-all hover:scale-110 active:scale-90 ${isMusicPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}
        >
          {isMusicPlaying ? <Music className="text-rose-500" size={24} /> : <Music2 className="text-gray-400" size={24} />}
        </button>
      )}

      {/* Interactive Tap Hearts */}
      {tapHearts.map(heart => (
        <div 
          key={heart.id} 
          className="tap-heart"
          style={{ left: heart.x, top: heart.y }}
        >
          <Heart size={24} fill="currentColor" />
        </div>
      ))}

      {/* Dynamic Petals & Stars */}
      {petals.map(i => (
        <div 
          key={`p-${i}`} 
          className="petal" 
          style={{
            left: `${Math.random() * 100}vw`,
            width: `${Math.random() * 12 + 8}px`,
            height: `${Math.random() * 12 + 8}px`,
            animationDuration: `${Math.random() * 10 + 8}s`,
            animationDelay: `${Math.random() * 8}s`,
            opacity: 0.3,
            background: i % 2 === 0 ? '#ffb7c5' : '#fda4af'
          }}
        />
      ))}
      {stars.map(i => (
        <div 
          key={`s-${i}`} 
          className="star" 
          style={{
            left: `${Math.random() * 100}vw`,
            top: `${Math.random() * 100}vh`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            '--duration': `${Math.random() * 4 + 2}s`
          } as any}
        />
      ))}

      {mode === 'login' && (
        <LoginView onLoginSuccess={() => setMode('setup')} onCancel={() => setMode('intro')} />
      )}

      {mode === 'setup' && (
        <SetupView story={story} setStory={setStory} onSave={handleSave} onCancel={() => setMode('intro')} />
      )}

      {(mode === 'intro' || mode === 'scatter') && (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-[1200ms] ${mode === 'scatter' ? 'scale-[1.8] opacity-0 blur-3xl' : 'opacity-100'}`}>
          <div 
            className="cursor-pointer transition-transform hover:scale-105 active:scale-95 relative flex flex-col items-center"
            onClick={(e) => { e.stopPropagation(); handleBloomClick(); }}
          >
            <div className="w-[85vw] h-[85vw] max-w-[520px] max-h-[520px] rounded-full overflow-hidden shadow-[0_50px_120px_rgba(251,113,133,0.2)] relative group">
              <img 
                src="https://images.unsplash.com/photo-1533616688419-b7a585564566?q=80&w=1200&auto=format&fit=crop" 
                alt="Rose Bouquet" 
                className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-rose-100/10"></div>
            </div>
            <Sparkles className="absolute -top-12 -right-6 text-rose-300 animate-pulse" size={56} />
            <Sparkles className="absolute -bottom-12 -left-6 text-rose-300 animate-pulse delay-700" size={40} />
          </div>
          <div className="text-center mt-16 space-y-4">
            <p className="text-rose-500 font-handwriting text-3xl md:text-5xl animate-pulse tracking-[0.2em] select-none cursor-default px-6 drop-shadow-sm" onClick={(e) => { e.stopPropagation(); triggerSecretSetup(); }}>
              这是我藏在玫瑰里的真心
            </p>
            <p className="text-rose-300 text-xs md:text-base font-light opacity-60 tracking-[1em] animate-fade-in uppercase">
              轻 触 启 封
            </p>
          </div>
        </div>
      )}

      {mode === 'main' && (
        <LetterScreen story={story} onIconClick={triggerSecretSetup} />
      )}
    </div>
  );
};

const LoginView: React.FC<{ onLoginSuccess: () => void; onCancel: () => void }> = ({ onLoginSuccess, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      onLoginSuccess();
    } else {
      setError('账号或密码不正确，请重新输入');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#fffafb]/80 backdrop-blur-xl" onClick={(e) => e.stopPropagation()}>
      <div className="w-full max-w-md bg-white rounded-[50px] shadow-2xl p-10 border border-rose-100 animate-fade-in">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Lock className="text-rose-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">管理后台登录</h2>
          <p className="text-gray-400 text-sm mt-2">请输入您的凭证以继续</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
            <input 
              type="text"
              placeholder="账号"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-14 pr-6 py-5 rounded-3xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-rose-200 transition-all text-gray-700"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
            <input 
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-14 pr-6 py-5 rounded-3xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-rose-200 transition-all text-gray-700"
            />
          </div>
          {error && <p className="text-rose-500 text-sm text-center animate-pulse">{error}</p>}
          <div className="flex flex-col gap-4 pt-4">
            <button 
              type="submit"
              className="w-full py-5 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-full font-bold shadow-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95"
            >
              <LogIn size={20} />
              进入后台
            </button>
            <button 
              type="button"
              onClick={onCancel}
              className="w-full py-4 text-gray-400 font-medium hover:text-gray-600 transition-colors"
            >
              取消并返回
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LetterScreen: React.FC<{ story: StoryData; onIconClick: () => void }> = ({ story, onIconClick }) => {
  return (
    <div className="max-w-[500px] mx-auto min-h-screen px-6 py-20 flex flex-col gap-28 pb-56 relative z-10">
      <section className="flex flex-col items-center gap-16 text-center reveal-item delay-1">
        <Dazzling3DElement onClick={(e) => { e.stopPropagation(); onIconClick(); }} size={220} />
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-handwriting text-gray-800 leading-tight tracking-wide">
            致我最亲爱的{story.nickname}
          </h1>
          <div className="flex justify-center items-center gap-4 opacity-40">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-rose-300"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-rose-300"></div>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-rose-300"></div>
          </div>
        </div>
      </section>
      <section className="relative reveal-item delay-2">
        <div className="absolute -inset-8 bg-gradient-to-br from-rose-100/40 to-pink-100/40 rounded-[70px] blur-3xl opacity-40"></div>
        <div className="paper-effect rounded-[50px] p-10 md:p-14 relative overflow-hidden transition-shadow duration-1000">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-300 via-rose-400 to-rose-300 opacity-60"></div>
          <div className="whitespace-pre-wrap font-handwriting text-2xl md:text-3xl leading-[2.4] text-gray-700/90 tracking-wider">
            {story.letter}
            <div className="mt-20 text-right border-t border-rose-50 pt-10">
              <p className="text-rose-400 italic mb-3 text-xl opacity-80 font-light">—— 永远守护你的我</p>
              <p className="font-romantic text-3xl text-rose-400 opacity-40">With Eternal Love</p>
            </div>
          </div>
        </div>
      </section>
      {story.showPromises && (
        <section className="space-y-14 reveal-item delay-3">
          <div className="flex items-center gap-6">
            <div className="h-px bg-gradient-to-r from-transparent to-rose-200 flex-1"></div>
            <h2 className="text-2xl font-handwriting text-rose-500 flex items-center gap-3">
              <ScrollText size={22} className="opacity-70" /> 郑重承诺
            </h2>
            <div className="h-px bg-gradient-to-l from-transparent to-rose-200 flex-1"></div>
          </div>
          <div className="grid gap-10">
            {story.promises.map((p, i) => p && (
              <VowCard key={`v-${i}`} index={i + 1} text={p} />
            ))}
          </div>
        </section>
      )}
      {story.showPhotos && (
        <section className="space-y-14 reveal-item delay-4">
          <div className="flex items-center gap-6">
            <div className="h-px bg-gradient-to-r from-transparent to-rose-200 flex-1"></div>
            <h2 className="text-2xl font-handwriting text-rose-500">定格的时光</h2>
            <div className="h-px bg-gradient-to-l from-transparent to-rose-200 flex-1"></div>
          </div>
          <div className="grid grid-cols-2 gap-10 md:gap-14">
            {story.photos.map((ph, i) => ph.url && (
              <PhotoFrame key={`p-${i}`} src={ph.url} caption={ph.caption} />
            ))}
          </div>
        </section>
      )}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-[440px] px-10 text-center animate-bounce-subtle pointer-events-none reveal-item delay-5">
        <button 
          onClick={(e) => { e.stopPropagation(); alert("我也爱你，宝贝 ❤️"); }}
          className="pointer-events-auto w-full py-5 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-full font-bold shadow-[0_20px_40px_rgba(244,63,94,0.3)] flex items-center justify-center gap-3 transition-all hover:scale-105 hover:brightness-105 active:scale-95 text-lg"
        >
          <Heart fill="currentColor" size={20} className="animate-pulse" />
          原谅我，好吗？
        </button>
      </div>
    </div>
  );
};

const VowCard: React.FC<{ index: number; text: string }> = ({ index, text }) => (
  <div className="bg-white/80 backdrop-blur-md p-10 rounded-[40px] shadow-lg border border-rose-50/50 transition-all hover:-translate-y-1 group">
    <div className="flex gap-8 items-start">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-400 flex items-center justify-center font-romantic text-3xl font-bold shrink-0 shadow-inner group-hover:bg-rose-400 group-hover:text-white transition-all duration-700">
        {index}
      </div>
      <p className="text-gray-700 font-handwriting text-2xl leading-[2] group-hover:text-gray-900 transition-colors">“{text}”</p>
    </div>
  </div>
);

const PhotoFrame: React.FC<{ src: string; caption: string }> = ({ src, caption }) => (
  <div className="bg-white p-4 pb-12 shadow-2xl rounded-sm transition-all duration-1000 hover:rotate-0 hover:scale-110 group cursor-default relative" style={{transform: `rotate(${Math.random() * 12 - 6}deg)`}}>
    <div className="aspect-[3/4] bg-rose-50 overflow-hidden mb-5 rounded-[3px]">
      <img src={src} className="w-full h-full object-cover transition-all duration-[3s] group-hover:scale-110" alt={caption} />
    </div>
    <p className="text-center font-handwriting text-rose-400 text-base px-3 italic tracking-wider leading-relaxed">{caption}</p>
    <div className="absolute top-2 right-2 w-8 h-8 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
      <Heart size={14} className="text-rose-300" />
    </div>
  </div>
);

const SetupView: React.FC<{ 
  story: StoryData, 
  setStory: React.Dispatch<React.SetStateAction<StoryData>>, 
  onSave: () => void,
  onCancel: () => void 
}> = ({ story, setStory, onSave, onCancel }) => {
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const musicFileInputRef = useRef<HTMLInputElement | null>(null);

  const updatePromise = (idx: number, val: string) => {
    const next = [...story.promises];
    next[idx] = val;
    setStory({ ...story, promises: next });
  };

  const addPromise = () => setStory({ ...story, promises: [...story.promises, ''] });
  const removePromise = (idx: number) => setStory({ ...story, promises: story.promises.filter((_, i) => i !== idx) });

  const updatePhoto = (idx: number, key: 'url' | 'caption', val: string) => {
    const next = [...story.photos];
    next[idx] = { ...next[idx], [key]: val };
    setStory({ ...story, photos: next });
  };

  const handleFileUpload = (idx: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePhoto(idx, 'url', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMusicUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert("音频文件太大啦，请选择8MB以内的文件哦（为了浏览流畅）");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setStory({ ...story, bgMusicUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePhotos = () => setStory({ ...story, showPhotos: !story.showPhotos });
  const togglePromises = () => setStory({ ...story, showPromises: !story.showPromises });
  const toggleMusic = () => setStory({ ...story, showMusic: !story.showMusic });

  return (
    <div className="fixed inset-0 z-[100] bg-[#fffafb] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
      <div className="max-w-[640px] mx-auto p-10 py-16 space-y-14 animate-fade-in pb-40">
        <header className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">定制浪漫告白页</h1>
            <p className="text-gray-500 text-sm">将每一份诚意都写进这个专属空间</p>
          </div>
          <button onClick={onCancel} className="p-3 text-gray-300 hover:text-rose-500 transition-colors">
            <X size={30} />
          </button>
        </header>

        <div className="space-y-12">
          {/* Background Music Section */}
          <div className="bg-white p-10 rounded-[45px] shadow-sm border border-rose-50 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3 text-rose-500 font-bold">
                <Music size={20} /> 背景音乐
              </div>
              <button 
                onClick={toggleMusic}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  story.showMusic 
                    ? 'bg-rose-100 text-rose-600' 
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {story.showMusic ? <Eye size={14} /> : <EyeOff size={14} />}
                {story.showMusic ? '已启用' : '已隐藏'}
              </button>
            </div>
            {story.showMusic && (
              <div className="space-y-4">
                <div className="relative">
                  <input 
                    value={story.bgMusicUrl}
                    onChange={(e) => setStory({ ...story, bgMusicUrl: e.target.value })}
                    placeholder="音乐直链 (MP3, WAV等) 或 上传本地文件"
                    className="w-full px-6 py-5 pr-14 rounded-3xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-rose-200 text-base"
                  />
                  <button 
                    onClick={() => musicFileInputRef.current?.click()}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 text-rose-400 hover:text-rose-600 transition-colors"
                    title="上传本地音频"
                  >
                    <Upload size={20} />
                  </button>
                  <input 
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    ref={musicFileInputRef}
                    onChange={handleMusicUpload}
                  />
                </div>
                {story.bgMusicUrl && story.bgMusicUrl.startsWith('data:') && (
                  <p className="text-[10px] text-rose-400 pl-4">已成功加载本地音频片段</p>
                )}
              </div>
            )}
          </div>

          <div className="bg-white p-10 rounded-[45px] shadow-sm border border-rose-50 space-y-6">
            <div className="flex items-center gap-3 text-rose-500 font-bold mb-2">
              <Edit3 size={20} /> 长信内容
            </div>
            <input 
              value={story.nickname}
              onChange={(e) => setStory({ ...story, nickname: e.target.value })}
              placeholder="对她的称呼"
              className="w-full px-6 py-5 rounded-3xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-rose-200 text-xl"
            />
            <textarea 
              value={story.letter}
              onChange={(e) => setStory({ ...story, letter: e.target.value })}
              placeholder="在此输入你的真心话..."
              className="w-full h-80 px-6 py-5 rounded-3xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-rose-200 resize-none text-lg leading-relaxed"
            />
          </div>

          <div className="bg-white p-10 rounded-[45px] shadow-sm border border-rose-50 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3 text-rose-500 font-bold">
                <ScrollText size={20} /> 爱的承诺
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={togglePromises}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    story.showPromises 
                      ? 'bg-rose-100 text-rose-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {story.showPromises ? <Eye size={14} /> : <EyeOff size={14} />}
                  {story.showPromises ? '已启用' : '已隐藏'}
                </button>
                <button onClick={addPromise} className="p-2.5 bg-rose-50 text-rose-500 rounded-full hover:bg-rose-100 transition-colors">
                  <Plus size={24} />
                </button>
              </div>
            </div>
            {story.showPromises && (
              <div className="space-y-5 animate-fade-in">
                {story.promises.map((p, i) => (
                  <div key={i} className="flex gap-4">
                    <input 
                      value={p}
                      onChange={(e) => updatePromise(i, e.target.value)}
                      placeholder={`承诺条目 ${i + 1}`}
                      className="flex-1 px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-rose-200 text-base"
                    />
                    <button onClick={() => removePromise(i)} className="text-gray-300 hover:text-rose-400">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-10 rounded-[45px] shadow-sm border border-rose-50 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3 text-rose-500 font-bold">
                <ImageIcon size={20} /> 甜蜜定格 (照片)
              </div>
              <button 
                onClick={togglePhotos}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  story.showPhotos 
                    ? 'bg-rose-100 text-rose-600' 
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {story.showPhotos ? <Eye size={14} /> : <EyeOff size={14} />}
                {story.showPhotos ? '已启用' : '已隐藏'}
              </button>
            </div>
            {story.showPhotos && (
              <div className="grid grid-cols-1 gap-6 animate-fade-in">
                {story.photos.map((ph, i) => (
                  <div key={i} className="flex flex-col gap-4 p-5 bg-gray-50 rounded-[35px] relative">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input 
                          value={ph.url}
                          onChange={(e) => updatePhoto(i, 'url', e.target.value)}
                          placeholder="照片直链 (Unsplash等)"
                          className="w-full px-6 py-4 pr-14 rounded-2xl bg-white border-none text-sm outline-none"
                        />
                        <button 
                          onClick={() => fileInputRefs.current[i]?.click()}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-rose-400 hover:text-rose-600 transition-colors"
                          title="上传本地图片"
                        >
                          <Upload size={18} />
                        </button>
                        <input 
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={el => fileInputRefs.current[i] = el}
                          onChange={(e) => handleFileUpload(i, e)}
                        />
                      </div>
                    </div>
                    {ph.url && ph.url.startsWith('data:') && (
                      <div className="px-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-rose-100 shadow-sm">
                          <img src={ph.url} className="w-full h-full object-cover" alt="Preview" />
                        </div>
                        <p className="text-[10px] text-rose-400 mt-1">本地图片已就绪</p>
                      </div>
                    )}
                    <input 
                      value={ph.caption}
                      onChange={(e) => updatePhoto(i, 'caption', e.target.value)}
                      placeholder="照片描述"
                      className="w-full px-6 py-4 rounded-2xl bg-white border-none text-sm outline-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex gap-4 w-full px-10 max-w-[640px]">
          <button 
            onClick={onSave}
            className="flex-1 py-6 bg-rose-500 text-white rounded-full font-bold shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all text-xl"
          >
            <Save size={22} /> 重新生成浪漫告白页
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
