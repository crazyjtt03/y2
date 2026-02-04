
export interface StoryData {
  letter: string;
  promises: string[];
  photos: { url: string; caption: string }[];
  nickname: string;
  showPhotos: boolean;
  showPromises: boolean;
  bgMusicUrl?: string;
  showMusic?: boolean;
}

export interface Memory {
  id: string;
  url: string;
  description: string;
  date: string;
}

export interface PromiseItem {
  id: string;
  text: string;
  category: 'habit' | 'emotion' | 'future';
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  isThinking?: boolean;
}

export enum AppTab {
  HOME = 'home',
  APOLOGY = 'apology',
  MEMORIES = 'memories',
  PROMISES = 'promises',
  COACH = 'coach'
}
