
import React, { useState, useRef, useEffect } from 'react';
import NavBar from '../components/layout/NavBar';
import Sidebar from '../components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User as UserIcon, ArrowDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

const initialMessages: Message[] = [
  {
    id: '1',
    content: "Hi there! I'm Dom, your AI career assistant. I can help you with job applications, resume writing, interview prep, and career advice. How can I assist you today?",
    role: 'assistant',
    timestamp: new Date(),
  }
];

const AIAssistant: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      // This would be replaced with actual API call to OpenAI or similar
      const responses = [
        "I can definitely help with that! Let me provide some tailored advice for your situation.",
        "Great question! Here's what I recommend based on current industry trends.",
        "Let me analyze that for you. Based on your profile and the current job market, here's what you should consider.",
        "I've processed your question and can offer these insights that might help with your career goals.",
        "Thanks for sharing that. Here are some strategies that could work well in your situation."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen w-full bg-gradient-light">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          <NavBar />
          
          <Card className="glass-panel animate-fade-in h-[calc(100vh-12rem)]">
            <CardHeader className="border-b">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-domino-pink to-domino-green flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle>Dom</CardTitle>
                  <CardDescription>
                    Your AI career assistant
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 flex flex-col h-[calc(100%-13rem)]">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`flex gap-3 max-w-[80%] ${
                          message.role === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        } p-3 rounded-lg`}
                      >
                        {message.role === 'assistant' && (
                          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-domino-pink to-domino-green flex-shrink-0 flex items-center justify-center">
                            <Bot className="h-3 w-3 text-white" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {message.role === 'user' && (
                          <div className="h-6 w-6 rounded-full bg-primary-foreground text-primary flex-shrink-0 flex items-center justify-center ml-1">
                            <UserIcon className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted p-3 rounded-lg flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-domino-pink to-domino-green flex-shrink-0 flex items-center justify-center">
                          <Bot className="h-3 w-3 text-white" />
                        </div>
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 bg-foreground/60 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                          <div className="h-2 w-2 bg-foreground/60 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                          <div className="h-2 w-2 bg-foreground/60 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
            
            <CardFooter className="border-t p-4">
              <form 
                className="flex w-full gap-2" 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
              >
                <Textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about job applications, resume tips, interviews..."
                  className="min-h-[60px] flex-1 resize-none"
                />
                <Button 
                  type="submit" 
                  className="self-end bg-gradient-to-r from-domino-pink to-domino-green"
                  disabled={isLoading || !input.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
