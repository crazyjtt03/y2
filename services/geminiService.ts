
import { GoogleGenAI, Type } from "@google/genai";

// Use process.env.API_KEY directly and create instances before each call for reliability.

export const generateApology = async (context: {
  reason: string;
  nickname: string;
  favoriteThings: string;
  duration: string;
}) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    我正试图挽回我生气的女朋友。
    她的昵称是: ${context.nickname}
    吵架的原因: ${context.reason}
    
    请运用你强大的思维能力，为我撰写一封极其深情、私密且真挚的长信。
    不要使用任何商业化的语气，不要分点列出。
    它应该像是一封在深夜台灯下，手写在精美信纸上的情书。
    
    信件应包含：
    1. 诚恳地承认错误，表达我此刻内心的焦虑和想念。
    2. 回忆一个我们曾经非常甜蜜的小瞬间（你可以根据吵架原因虚构一个反差极大的温馨场景）。
    3. 表达我愿意为她做出的具体改变。
    4. 结尾要温柔而充满希望。
    
    字数控制在300-500字左右。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }, // Max budget for pro model for deeper reasoning
        temperature: 1
      },
    });
    return response.text || "亲爱的，我有很多话想对你说，但此刻却不知从何说起... 我真的很爱你。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "亲爱的，我的心里全是你。无论发生了什么，请相信我对你的爱从未改变。";
  }
};

export const getRelationshipAdvice = async (history: { role: string; content: string }[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts: [{ text: history[history.length - 1].content }] },
      config: {
        systemInstruction: "你是一个极其温柔的恋爱顾问，像一个老朋友一样提供挽回建议。说话要带感情，不要生硬。",
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    return response.text || "我一直都在这里支持你。";
  } catch (error) {
    console.error("Gemini Coach Error:", error);
    return "无论遇到什么困难，只要心在一起，就一定能解决。";
  }
};
