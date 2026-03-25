/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  User, 
  Bot, 
  Menu, 
  X, 
  BookOpen, 
  HelpCircle, 
  ChevronRight,
  GraduationCap,
  Info
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message, Chapter } from './types';
import { CHAPTERS, FAQS } from './constants';
import { sendMessage } from './services/geminiService';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: 'Chào bạn! Tôi là **ChatBox Trợ giảng Tư tưởng Hồ Chí Minh** tại HCMUTE. Rất vui được hỗ trợ bạn trong quá trình học tập môn học này.\n\nBạn đang gặp khó khăn ở chương nào hay có vấn đề cụ thể nào cần tôi giải đáp không?',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessage(messages, text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: 'Xin lỗi, tôi gặp sự cố khi kết nối. Vui lòng thử lại sau.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (text: string) => {
    handleSend(text);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-paper text-ink font-sans overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed lg:relative z-40 w-80 h-full bg-white border-r border-ink/10 flex flex-col shadow-xl lg:shadow-none`}
          >
            <div className="p-6 border-bottom border-ink/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h2 className="display text-lg font-bold leading-tight">HCMUTE</h2>
                  <p className="text-[10px] uppercase tracking-widest opacity-60">Virtual Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-paper rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-8">
              {/* Chapters */}
              <section>
                <div className="flex items-center gap-2 mb-4 px-2">
                  <BookOpen size={16} className="text-accent" />
                  <h3 className="text-xs uppercase font-bold tracking-wider opacity-50">Chương trình học</h3>
                </div>
                <div className="space-y-1">
                  {CHAPTERS.map((chapter) => (
                    <button
                      key={chapter.id}
                      onClick={() => handleQuickAction(`Hãy giải thích nội dung chính của ${chapter.title}: ${chapter.description}`)}
                      className="w-full text-left p-3 rounded-xl hover:bg-paper group transition-all duration-200 border border-transparent hover:border-accent/10"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold group-hover:text-accent transition-colors">{chapter.title}</p>
                          <p className="text-[11px] opacity-60 line-clamp-1">{chapter.description}</p>
                        </div>
                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-40 transition-opacity mt-1" />
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* FAQs */}
              <section>
                <div className="flex items-center gap-2 mb-4 px-2">
                  <HelpCircle size={16} className="text-accent" />
                  <h3 className="text-xs uppercase font-bold tracking-wider opacity-50">Câu hỏi thường gặp</h3>
                </div>
                <div className="space-y-2">
                  {FAQS.map((faq, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(faq)}
                      className="w-full text-left p-3 text-xs bg-paper/50 rounded-lg border border-ink/5 hover:border-accent/30 hover:bg-white transition-all"
                    >
                      {faq}
                    </button>
                  ))}
                </div>
              </section>

              {/* About */}
              <section>
                <div className="flex items-center gap-2 mb-4 px-2">
                  <Info size={16} className="text-accent" />
                  <h3 className="text-xs uppercase font-bold tracking-wider opacity-50">Về trợ giảng</h3>
                </div>
                <div className="p-4 bg-white border border-ink/5 rounded-2xl text-xs leading-relaxed space-y-2">
                  <p>Hệ thống hỗ trợ học tập thông minh dành riêng cho sinh viên HCMUTE.</p>
                  <p>Dữ liệu được cập nhật theo giáo trình mới nhất của Bộ GD&ĐT.</p>
                </div>
              </section>

              {/* Info */}
              <section className="bg-accent/5 p-4 rounded-2xl border border-accent/10">
                <div className="flex items-center gap-2 mb-2">
                  <Info size={14} className="text-accent" />
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-accent">Lưu ý</h4>
                </div>
                <p className="text-[11px] leading-relaxed opacity-70 italic">
                  Thông tin hành chính chỉ mang tính tham khảo. Vui lòng kiểm tra tại hcmute.edu.vn để có độ chính xác tuyệt đối.
                </p>
              </section>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-ink/5 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 hover:bg-paper rounded-full transition-colors"
            >
              <Menu size={20} />
            </button>
            <h1 className="serif text-xl md:text-2xl font-bold text-accent">Tư tưởng Hồ Chí Minh</h1>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Trợ giảng Online</span>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                    message.role === 'user' ? 'bg-accent text-white' : 'bg-white border border-ink/10 text-accent'
                  }`}>
                    {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-4 rounded-2xl shadow-sm ${
                    message.role === 'user' 
                      ? 'bg-accent text-white rounded-tr-none' 
                      : 'bg-white border border-ink/5 rounded-tl-none'
                  }`}>
                    <div className={`markdown-body text-sm ${message.role === 'user' ? 'text-white' : 'text-ink'}`}>
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                    <div className={`text-[9px] mt-2 opacity-40 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-ink/10 flex items-center justify-center text-accent">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white border border-ink/5 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                    <span className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-white/50 backdrop-blur-sm border-t border-ink/5">
          <div className="max-w-3xl mx-auto">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="relative flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập câu hỏi của bạn về môn học..."
                className="flex-1 bg-white border border-ink/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-accent text-white p-4 rounded-2xl hover:bg-accent-light disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
              >
                <Send size={20} />
              </button>
            </form>
            <p className="text-[10px] text-center mt-3 opacity-40 uppercase tracking-widest font-bold">
              Hỗ trợ sinh viên HCMUTE • 2026
            </p>
          </div>
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
