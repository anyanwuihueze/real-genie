
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, User } from 'lucide-react';
import { JapaGenieLogo } from '@/components/icons/JapaGenieLogo';
import type { VisaRecommendationOutput } from '@/ai/flows/visa-recommendation';
import type { GeneralChatOutput, GeneralChatInput } from '@/ai/flows/general-chat-flow';

interface ClientMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  senderIcon: React.ReactNode;
  isError?: boolean;
}

interface ChatPanelProps {
  onNewRecommendation: (recommendations: VisaRecommendationOutput | null) => void;
  setVisaLoading: (loading: boolean) => void;
  setVisaError: (error: string | null) => void;
  setWebAnalysisContext: (context: string | null) => void;
}

export function ChatPanel({ onNewRecommendation, setVisaLoading, setVisaError, setWebAnalysisContext }: ChatPanelProps) {
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ClientMessage[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [chatMessages]);

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!currentMessage.trim()) return;

    const userMessage: ClientMessage = {
      id: Date.now().toString() + 'user',
      role: 'user',
      content: currentMessage,
      senderIcon: <User className="h-5 w-5" />,
    };
    setChatMessages(prev => [...prev, userMessage]);
    const messageToSend = currentMessage;
    setCurrentMessage('');
    setIsSending(true);
    setVisaError(null);
    setWebAnalysisContext(null);

    const historyForAI: GeneralChatInput['chatHistory'] = chatMessages
      .filter(msg => !msg.isError)
      .map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }],
    }));
    
    try {
      const { generalChatAction } = await import('@/app/actions');
      const result = await generalChatAction({
        chatHistory: historyForAI,
        currentMessage: messageToSend,
      });

      if (result.success && result.data) {
        const aiResponse: ClientMessage = {
          id: Date.now().toString() + 'ai',
          role: 'model',
          content: result.data.conversationalReply,
          senderIcon: <JapaGenieLogo className="h-5 w-5" />, 
        };
        setChatMessages(prev => [...prev, aiResponse]);

        if (result.data.visaRecommendations && result.data.visaRecommendations.length > 0) {
          onNewRecommendation(result.data.visaRecommendations as VisaRecommendationOutput);
        } else {
           onNewRecommendation(null);
        }

        if (result.data.webAnalysisContext) {
          setWebAnalysisContext(result.data.webAnalysisContext);
        } else {
          setWebAnalysisContext(null);
        }
        
        setVisaLoading(false); 
      } else {
        const errorResponse: ClientMessage = {
          id: Date.now().toString() + 'error',
          role: 'model',
          content: `Error: ${result.error || "Failed to get a response."}`,
          senderIcon: <JapaGenieLogo className="h-5 w-5" />, 
          isError: true,
        };
        setChatMessages(prev => [...prev, errorResponse]);
        setVisaError(result.error || "Failed to get a response.");
        setVisaLoading(false);
      }
    } catch (error) {
       const criticalErrorResponse: ClientMessage = {
          id: Date.now().toString() + 'critError',
          role: 'model',
          content: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`,
          senderIcon: <JapaGenieLogo className="h-5 w-5" />, 
          isError: true,
        };
        setChatMessages(prev => [...prev, criticalErrorResponse]);
        setVisaError(error instanceof Error ? error.message : "An unexpected error occurred.");
        setVisaLoading(false);
    }
    setIsSending(false);
  };

  return (
    <Card className="h-full flex flex-col shadow-xl bg-card border border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center">
          <JapaGenieLogo className="h-7 w-7 mr-2" /> Japa Genie Chat
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Chat with your seasoned visa coach. Ask questions, for visa guidance, or for web-researched insights.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="h-[300px] sm:h-auto sm:flex-grow w-full rounded-md border border-border/70 p-4 bg-background" ref={scrollAreaRef}>
          {chatMessages.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Ask Japa Genie anything about your relocation journey!
              <br />For example: "What are the current student visa success rates for Germany?"
            </p>
          )}
          <div className="space-y-4">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'model' && (
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className={`flex items-center justify-center text-sm ${msg.isError ? 'bg-destructive/20' : 'bg-primary/10'}`}>
                      {msg.senderIcon}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={`p-3 rounded-lg max-w-[85%] shadow-sm break-words ${
                  msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 
                  msg.isError ? 'bg-destructive/80 text-destructive-foreground rounded-bl-none' : 
                  'bg-muted text-muted-foreground border border-border/50 rounded-bl-none'
                }`}>
                  <p className="text-xs font-semibold mb-0.5 opacity-80">{msg.role === 'user' ? 'You' : 'Japa Genie'}</p>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-secondary text-secondary-foreground flex items-center justify-center text-sm">
                      {msg.senderIcon}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="border-t border-border/50 pt-4">
        <form onSubmit={handleSubmit} className="flex w-full items-start gap-2">
          <Textarea
            placeholder="Type your message to Japa Genie..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            rows={1}
            className="flex-grow resize-none bg-background border-border focus:border-primary min-h-[40px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={isSending}
          />
          <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground h-[40px]" disabled={isSending || !currentMessage.trim()}>
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <User className="h-4 w-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
