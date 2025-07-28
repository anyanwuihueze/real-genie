
'use client';

import { useState } from 'react';
import { ChatPanel } from '@/components/visa/chat-panel';
import { VisaDisplayPanel } from '@/components/visa/visa-display-panel';
import type { VisaRecommendationOutput } from '@/ai/flows/visa-recommendation';

export default function ChatPage() {
  const [recommendations, setRecommendations] = useState<VisaRecommendationOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [webAnalysisContext, setWebAnalysisContext] = useState<string | null>(null);

  const handleNewRecommendation = (newRecommendations: VisaRecommendationOutput | null) => {
    setRecommendations(newRecommendations);
    setIsLoading(false);
  };

  const handleSetVisaLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const handleSetVisaError = (error: string | null) => {
    setError(error);
    setIsLoading(false);
  };
  
  const handleSetWebAnalysisContext = (context: string | null) => {
    setWebAnalysisContext(context);
  };

  return (
    <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 md:p-6">
      <div className="h-[calc(100vh-120px)] lg:h-auto">
        <ChatPanel 
          onNewRecommendation={handleNewRecommendation} 
          setVisaLoading={handleSetVisaLoading}
          setVisaError={handleSetVisaError}
          setWebAnalysisContext={handleSetWebAnalysisContext}
        />
      </div>
      <div className="h-[calc(100vh-120px)] lg:h-auto">
        <VisaDisplayPanel 
          recommendations={recommendations} 
          isLoading={isLoading} 
          error={error} 
          webAnalysisContext={webAnalysisContext}
        />
      </div>
    </div>
  );
}
