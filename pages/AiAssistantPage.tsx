import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Chat } from '@google/genai';
import { extractEventsFromSyllabus, createChat } from '../services/geminiService';
import { useAppData } from '../contexts/AppContext';
import { AppEvent, ExtractedEvent } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { useAuth } from '../contexts/AuthContext';

// Define SpeechRecognition interface for TypeScript
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

const AiAssistantPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scanner' | 'chat'>('scanner');

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">AI Assistant</h1>
      <p className="text-foreground/70 mb-6">Your smart partner for academic success. Analyze documents or chat for advice.</p>
      
      <div className="mb-6">
        <div className="flex border-b border-foreground/10">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-4 py-2 text-lg font-semibold transition-colors ${activeTab === 'scanner' ? 'text-primary border-b-2 border-primary' : 'text-foreground/60'}`}
          >
            Syllabus Scanner
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 text-lg font-semibold transition-colors ${activeTab === 'chat' ? 'text-primary border-b-2 border-primary' : 'text-foreground/60'}`}
          >
            Chat Assistant
          </button>
        </div>
      </div>

      {activeTab === 'scanner' ? <SyllabusScanner /> : <ChatAssistant />}
    </div>
  );
};

const SyllabusScanner: React.FC = () => {
  const [pastedText, setPastedText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedEvents, setExtractedEvents] = useState<ExtractedEvent[] | null>(null);
  const { addEvents } = useAppData();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File | null) => {
    if (file && !['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/markdown'].includes(file.type)) {
      setError(`File type "${file.type}" is not supported. Please use .txt, .pdf, or .docx files.`);
      return;
    }
    setSelectedFile(file);
    if (file) setPastedText(''); // Clear other input source
    setError(null);
    setExtractedEvents(null); // Clear previous results
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPastedText(e.target.value);
    if (e.target.value) setSelectedFile(null); // Clear other input source
  };
  
  const handleDragEvent = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOver = (e: React.DragEvent) => {
    handleDragEvent(e);
    if (!isLoading) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    handleDragEvent(e);
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    handleDragEvent(e);
    setIsDragging(false);
    if (isLoading) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) handleFileSelect(files[0]);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) handleFileSelect(files[0]);
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleAnalyze = async () => {
    const content = selectedFile || pastedText;
    if (!content) {
      setError('Please provide syllabus content first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setExtractedEvents(null);
    try {
      const events = await extractEventsFromSyllabus(content);
       if (events.length === 0) {
        setError("The AI couldn't find any events in the document. Try pasting the text manually or checking the file content.");
      } else {
        setExtractedEvents(events);
      }
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCalendar = () => {
    if (!extractedEvents) return;

    const newAppEvents: AppEvent[] = extractedEvents.map(e => {
        const [hour, minute] = e.time.split(':').map(Number);
        const startTime = new Date(e.date);
        startTime.setHours(hour || 0, minute || 0);
        
        const endTime = new Date(startTime);
        if (e.eventType === 'class' || e.eventType === 'office-hours') {
            endTime.setHours(startTime.getHours() + 1);
        }

        return {
            id: `${e.eventName}-${e.date}-${e.time}-${Math.random()}`,
            title: e.eventName,
            type: e.eventType,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString()
        }
    });

    addEvents(newAppEvents);
    setExtractedEvents(null);
    handleFileSelect(null);
    setPastedText('');
    alert(`${newAppEvents.length} events added to your calendar!`);
  };

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-2">Upload Syllabus File</h2>
           <div 
              onDragEnter={handleDragOver}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={!selectedFile ? triggerFileInput : undefined}
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 cursor-pointer ${isDragging ? 'border-primary bg-primary/10 scale-105' : 'border-foreground/20'}`}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileInputChange} className="hidden" accept=".txt,.pdf,.docx,.md" />
              
              {selectedFile ? (
                  <div className="flex flex-col items-center justify-center">
                    <Icon name="check-circle" className="w-12 h-12 mx-auto text-green-500 mb-2"/>
                    <p className="font-semibold text-foreground break-all">{selectedFile.name}</p>
                    <p className="text-sm text-foreground/60">Ready to be analyzed.</p>
                     <Button onClick={(e) => { e.stopPropagation(); handleFileSelect(null); }} variant="ghost" className="mt-2 text-accent">Clear</Button>
                  </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                    <Icon name="upload" className="w-12 h-12 mx-auto text-foreground/50 mb-2"/>
                    <p className="font-semibold text-foreground">Drag & drop your syllabus file here</p>
                    <p className="text-sm text-foreground/60 mb-2">or click to select</p>
                    <p className="text-xs text-foreground/50 mt-2">Supported: .txt, .pdf, .docx, .md</p>
                </div>
              )}
            </div>
        </div>
        
        <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-foreground/20" /></div>
            <div className="relative flex justify-center"><span className="bg-card px-2 text-sm text-foreground/60 uppercase">Or</span></div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Paste Content Manually</h2>
          <textarea
            value={pastedText}
            onChange={handleTextChange}
            placeholder="Paste syllabus text here..."
            className="w-full h-32 p-3 bg-background border border-foreground/10 rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            disabled={isLoading}
          />
        </div>
      </div>
      
      <Button onClick={handleAnalyze} disabled={isLoading || (!selectedFile && !pastedText.trim())} className="mt-6 w-full text-lg py-3">
        {isLoading ? 'Analyzing...' : <><Icon name="sparkles" className="w-5 h-5"/> Analyze Content</>}
      </Button>

      {error && <p className="mt-4 text-center text-red-500 bg-red-500/10 p-3 rounded-lg">{error}</p>}

      {extractedEvents && (
        <div className="mt-6">
          <h3 className="text-xl font-bold">Extracted Events</h3>
          <p className="text-foreground/70 mb-4">Review the events found by the AI. Add them to your calendar with one click.</p>
          <ul className="space-y-2 max-h-60 overflow-y-auto p-3 bg-background rounded-lg border border-foreground/10">
            {extractedEvents.map((event, index) => (
              <li key={index} className="p-3 bg-card rounded-md shadow-sm">
                <p className="font-semibold">{event.eventName}</p>
                 <p className="text-sm text-foreground/80"><strong className="capitalize">{event.eventType}</strong> on {event.date} at {event.time}</p>
              </li>
            ))}
          </ul>
           <Button onClick={handleAddToCalendar} className="mt-4" variant="secondary">
            <Icon name="calendar" className="w-5 h-5"/> Add All to Calendar
          </Button>
        </div>
      )}
    </Card>
  );
};

const ChatAssistant: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const [isListening, setIsListening] = useState(false);
    const speechRecognitionRef = useRef<any | null>(null);

    useEffect(() => {
        try {
          const newChat = createChat();
          setChat(newChat);
          setMessages([{ role: 'model', text: `Hi ${user?.name}! I'm here to help. You can ask me to suggest study times, help build a weekly routine, or offer time management tips. How can I help?` }]);
        } catch (error) {
          console.error(error);
          setMessages([{ role: 'model', text: 'Sorry, the AI chat is currently unavailable.' }]);
        }

        if (!('webkitSpeechRecognition' in window)) {
            console.warn("Speech recognition not supported in this browser.");
            return;
        }
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setUserInput(prev => prev ? `${prev} ${transcript}` : transcript);
        };
        speechRecognitionRef.current = recognition;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || !chat || isLoading) return;

        const text = userInput;
        setUserInput('');
        setMessages(prev => [...prev, { role: 'user', text }]);
        setIsLoading(true);

        try {
            const response = await chat.sendMessageStream({ message: text });
            let modelResponse = '';
            setMessages(prev => [...prev, {role: 'model', text: ''}]);

            for await (const chunk of response) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = modelResponse;
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleMicClick = () => {
        if (!speechRecognitionRef.current) return;
        if (isListening) {
            speechRecognitionRef.current.stop();
        } else {
            speechRecognitionRef.current.start();
        }
    };
    
    return (
        <Card className="flex flex-col h-[60vh]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center flex-shrink-0"><Icon name="sparkles" className="w-5 h-5"/></div>}
                        <div className={`max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-foreground/5 text-foreground rounded-bl-none'}`}>
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && messages[messages.length-1].role === 'user' && (
                     <div className="flex items-end gap-2">
                        <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center flex-shrink-0"><Icon name="sparkles" className="w-5 h-5"/></div>
                        <div className="max-w-md p-3 rounded-2xl bg-foreground/5 text-foreground rounded-bl-none">
                            <div className="flex gap-1.5">
                                <span className="h-2 w-2 bg-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="h-2 w-2 bg-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="h-2 w-2 bg-secondary rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-foreground/10 flex items-center gap-2">
                <input
                    type="text"
                    value={userInput}
                    onChange={e => setUserInput(e.target.value)}
                    placeholder="Ask for time management advice..."
                    className="flex-1 p-3 bg-background border border-foreground/10 rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    disabled={isLoading || !chat}
                />
                {speechRecognitionRef.current && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleMicClick}
                        className={`p-3 ${isListening ? 'text-accent animate-pulse' : ''}`}
                        aria-label={isListening ? 'Stop listening' : 'Start listening'}
                        disabled={isLoading}
                    >
                        <Icon name="microphone" className="w-5 h-5"/>
                    </Button>
                )}
                <Button type="submit" disabled={isLoading || !chat || !userInput.trim()}>
                    <Icon name="send" className="w-5 h-5"/>
                </Button>
            </form>
        </Card>
    );
}

export default AiAssistantPage;