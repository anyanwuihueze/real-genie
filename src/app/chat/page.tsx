
'use client';

import { useState } from 'react';
import type { VisaRecommendationOutput } from '@/ai/flows/visa-recommendation';
import { ChatPanel } from '@/components/visa/chat-panel';
import { VisaDisplayPanel } from '@/components/visa/visa-display-panel';

export default function ChatPage() {
  const [recommendations, setRecommendations] = useState<VisaRecommendationOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [webAnalysisContext, setWebAnalysisContext] = useState<string | null>(null);

  const handleNewRecommendation = (newRecommendations: VisaRecommendationOutput | null) => {
    setRecommendations(newRecommendations);
    setIsLoading(false); 
  };
  
  return (
    <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 md:p-6 h-[calc(100vh-80px)]">
      <div className="h-full">
        <ChatPanel 
          onNewRecommendation={handleNewRecommendation}
          setVisaLoading={setIsLoading}
          setVisaError={setError}
          setWebAnalysisContext={setWebAnalysisContext}
        />
      </div>
      <div className="h-full">
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
