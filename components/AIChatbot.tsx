'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/components/I18nProvider';
import { sendTelegramMessageAction } from '@/actions/adminActions';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Sparkles, MessageSquare, Loader2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

interface BotResponse {
  keywords: string[];
  reply: {
    en: string;
    ru: string;
    uz: string;
  };
}

const responses: BotResponse[] = [
  {
    keywords: ['salom', 'hello', 'hi', 'privet', 'assalomu alaykum', 'salom alaykum', 'zdravstvuyte', 'ey', 'hey'],
    reply: {
      en: "Hello there! Welcome to BEXA Studio. How can we help you today?",
      ru: "Приветствуем вас! Добро пожаловать в BEXA Studio. Чем мы можем помочь вам сегодня?",
      uz: "Salom! BEXA Studio-ga xush kelibsiz. Bugun sizga qanday yordam bera olamiz?"
    }
  },
  {
    keywords: ['narx', 'price', 'pricing', 'cost', 'pul', 'budjet', 'budget', 'stoimost', 'tsena', 'skolko', 'necha', 'dollor', 'dollar'],
    reply: {
      en: "Our projects are bespoke and custom-tailored to each brand's requirements. High-end visual portfolios start from $5k, while custom SaaS platforms and 3D experiences start from $12k. I've sent your interest to our director on Telegram for a custom quote!",
      ru: "Наши проекты создаются индивидуально под требования каждого бренда. Высококлассные визуальные портфолио начинаются от $5000, а специализированные SaaS-платформы и 3D-интерфейсы — от $12000. Я уже отправил ваш запрос нашему директору в Telegram!",
      uz: "Bizning loyihalarimiz har bir brendning talablariga mos ravishda noldan ishlab chiqiladi. Yuqori darajadagi vizual portfoliolar 5000$ dan boshlanadi, murakkab SaaS platformalar va interaktiv 3D tajribalar 12000$ dan boshlanadi. Narx bo'yicha batafsil ma'lumot olish uchun so'rovingizni direktorimizga Telegram orqali yubordim!"
    }
  },
  {
    keywords: ['loyiha', 'project', 'work', 'ish', 'portfolio', 'rabot', 'kartinka', 'image', 'rasm'],
    reply: {
      en: "We've delivered over 8 industry-defining creative works! Check out our 'Portfolio' tab to see Aura, Apex, and Zenith Edge engines. You can browse them directly on the site.",
      ru: "Мы создали более 8 выдающихся проектов! Загляните во вкладку 'Портфолио', чтобы увидеть Aura, Apex и Zenith Edge. Вы можете просмотреть их прямо на сайте.",
      uz: "Biz 8 dan ortiq eng yetakchi loyihalarni yakunladik! Aura, Apex va Zenith kabi loyihalarni ko'rish uchun saytimizning 'Portfolio' bo'limiga o'ting."
    }
  },
  {
    keywords: ['aloqa', 'contact', 'map', 'telefon', 'phone', 'email', 'svyaz', 'telegram', 'pochta', 'yandex', 'xarita', 'nomer'],
    reply: {
      en: "You can reach us at studio@bexa.studio or call +998 (90) 123-4567. We are located at 7/1 Muminov Street, Tashkent. I've also pushed your message to our manager on Telegram to call you back!",
      ru: "Вы можете написать нам на studio@bexa.studio или позвонить по номеру +998 (90) 123-4567. Мы находимся по адресу: Ташкент, ул. Муминова, 7/1. Я отправил ваше сообщение нашему менеджеру в Telegram!",
      uz: "Biz bilan studio@bexa.studio elektron pochtasi yoki +998 (90) 123-4567 telefoni orqali bog'lanishingiz mumkin. Manzilimiz: Toshkent sh., Mo'minov ko'chasi, 7/1. Xabaringizni menejerimizga Telegram orqali yetkazdim!"
    }
  },
  {
    keywords: ['jamoa', 'team', 'komanda', 'director', 'alisher', 'rakhmatov', 'sofia', 'elena'],
    reply: {
      en: "BEXA Studio is led by Alisher Rakhmatov (Principal Creative Director), Sofia Kuznetsova (Head of Engineering), and Elena Romanova (Lead UI/UX Architect). Explore our 'Team' section to read their biographies!",
      ru: "BEXA Studio возглавляют Алишер Рахматов (креативный директор), София Кузнецова (руководитель разработки) и Елена Романова (ведущий UI/UX архитектор). Перейдите в раздел 'Команда', чтобы узнать больше!",
      uz: "BEXA Studio jamoasiga Alisher Rakhmatov (Bosh kreativ direktor), Sofia Kuznetsova (Muhandislik bo'limi rahbari) va Elena Romanova (UI/UX me'mori) rahbarlik qiladi. 'Jamoa' bo'limida ular haqida batafsil o'qishingiz mumkin."
    }
  }
];

export default function AIChatbot() {
  const { locale, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message dynamically on language mount/change
  useEffect(() => {
    let welcomeText = "Salom! BEXA Studio AI yordamchisiga xush kelibsiz. Bugun sizga qanday yordam bera olaman?";
    if (locale === 'en') {
      welcomeText = "Hello! Welcome to BEXA Studio AI Assistant. How can I help you today?";
    } else if (locale === 'ru') {
      welcomeText = "Привет! Добро пожаловать к ИИ-помощнику BEXA Studio. Чем я могу помочь вам сегодня?";
    }
    
    // Clear and set welcome message whenever locale shifts to ensure smooth i18n
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: welcomeText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [locale]);

  // Keep chat viewport scrolled to bottom whenever a new message lands
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue('');

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: userText,
      time: timeString
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Call Next.js Server Action to safely dispatch to Telegram Bot
    try {
      await sendTelegramMessageAction(userText);
    } catch (err) {
      console.error('Failed to forward request to Telegram:', err);
    }

    // AI localized smart simulator trigger delay
    setTimeout(() => {
      let matchedReply = '';
      const lowercaseInput = userText.toLowerCase();

      const found = responses.find((resp) =>
        resp.keywords.some((keyword) => lowercaseInput.includes(keyword))
      );

      if (found) {
        matchedReply = found.reply[locale as 'en' | 'ru' | 'uz'] || found.reply.en;
      } else {
        if (locale === 'en') {
          matchedReply = "Thank you for your message! I have securely forwarded your request to our team's Telegram. We will review it and get back to you shortly.";
        } else if (locale === 'ru') {
          matchedReply = "Спасибо за ваше сообщение! Я надежно переслал ваш запрос в Telegram нашей команды. Мы свяжемся с вами в ближайшее время.";
        } else {
          matchedReply = "Xabaringiz uchun tashakkur! So'rovingizni jamoamizning Telegram-botiga xavfsiz tarzda yubordim. Tez orada sizga javob beramiz.";
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: matchedReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex flex-col items-end">
      {/* Interactive Chat Pane Wrapper */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 250 }}
            className="w-[calc(100vw-32px)] sm:w-[400px] h-[520px] max-h-[calc(85vh-80px)] rounded-[32px] glassmorphism bg-white/95 dark:bg-[#070b13]/95 border border-neutral-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden mb-4 relative z-10 backdrop-blur-xl"
          >
            {/* Visual Aurora glow behind header */}
            <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-indigo-500/10 via-indigo-500/5 to-transparent pointer-events-none" />

            {/* Chat Pane Header */}
            <div className="p-5 border-b border-neutral-100 dark:border-white/5 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 flex items-center justify-center relative">
                  <Bot className="w-5 h-5" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#070b13]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1">
                    BEXA AI Assistant <Sparkles className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  </span>
                  <span className="text-[10px] text-neutral-400 font-medium">Online • i18n Engaged</span>
                </div>
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-neutral-100 dark:bg-white/5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-indigo-500/20 relative z-10 bg-transparent">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-1 max-w-[80%] ${
                    msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
                  }`}
                >
                  <div
                    className={`p-3.5 px-4 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-neutral-950 dark:bg-white text-white dark:text-black rounded-tr-none font-medium'
                        : 'bg-neutral-100 dark:bg-white/5 text-neutral-700 dark:text-neutral-300 rounded-tl-none border border-neutral-200/40 dark:border-white/5'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-neutral-400 px-1 font-mono font-medium">{msg.time}</span>
                </div>
              ))}

              {/* Bot Typing Simulation Overlay */}
              {isTyping && (
                <div className="self-start flex flex-col gap-1 max-w-[80%] items-start">
                  <div className="p-3.5 px-4 rounded-2xl bg-neutral-100 dark:bg-white/5 text-neutral-700 dark:text-neutral-300 rounded-tl-none border border-neutral-200/40 dark:border-white/5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Area */}
            <form
              onSubmit={handleSend}
              className="p-4 border-t border-neutral-100 dark:border-white/5 bg-white/70 dark:bg-[#070b13]/70 backdrop-blur-md relative z-10 flex gap-2"
            >
              <input
                type="text"
                placeholder={
                  locale === 'en'
                    ? "Ask about pricing, portfolio..."
                    : locale === 'ru'
                    ? "Спросите о цене, портфолио..."
                    : "Narxlar, portfolio haqida so'rang..."
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 h-11 px-4 rounded-2xl text-xs glassmorphism bg-white dark:bg-black/20 border border-neutral-200 dark:border-white/5 text-neutral-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="w-11 h-11 rounded-2xl bg-indigo-500 text-white flex items-center justify-center cursor-pointer hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-lg shadow-indigo-500/25"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Futuristic Glowing Trigger Button (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-[20px] bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 text-white dark:text-white flex items-center justify-center cursor-pointer shadow-[0_8px_30px_rgba(99,102,241,0.4)] relative border border-white/20 transition-all duration-300 hover:scale-105 active:scale-95 group focus:outline-none hover:rounded-[15px]"
        aria-label="Toggle AI Assistant"
      >
        {/* Holographic Glowing Aura HALO */}
        <span className="absolute -inset-1 rounded-[22px] group-hover:rounded-[17px] bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 opacity-35 blur-md transition-all duration-300 group-hover:opacity-75 group-hover:scale-110 pointer-events-none" />
        
        {/* Animated Inner Ring */}
        <span className="absolute inset-0 rounded-[20px] group-hover:rounded-[15px] border border-white/20 animate-pulse pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center relative"
            >
              <Bot className="w-6 h-6 relative z-10 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] group-hover:rotate-12 transition-transform duration-300" />
              <Sparkles className="w-3.5 h-3.5 absolute -top-1 -right-1 text-yellow-300 fill-yellow-300 animate-pulse z-20" />
              
              <div className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-pink-500 text-[9px] font-extrabold font-mono text-white flex items-center justify-center border border-white/20 z-20 shadow-md">
                1
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
