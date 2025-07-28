
import type { VisaRecommendationOutput } from "@/ai/flows/visa-recommendation";
import { VisaCard } from "./visa-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Info, MessageSquareText, Globe, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Mock data for progress display - in a real app this would come from state management
const documentStatus = {
  total: 7,
  approved: 1,
};

interface VisaDisplayPanelProps {
  recommendations: VisaRecommendationOutput | null;
  isLoading: boolean;
  error: string | null;
  webAnalysisContext?: string | null;
}

export function VisaDisplayPanel({ recommendations, isLoading, error, webAnalysisContext }: VisaDisplayPanelProps) {
  const progressPercentage = Math.round((documentStatus.approved / documentStatus.total) * 100);

  let content;

  if (isLoading) {
    content = (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Japa Genie is working...</p>
        <p>Fetching visa information or insights.</p>
      </div>
    );
  } else if (error) {
    content = (
      <div className="flex flex-col items-center justify-center h-full text-destructive p-4 text-center">
        <Info className="h-12 w-12 mb-4" />
        <p className="text-lg font-semibold">Oops! Something went wrong.</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  } else if (recommendations && recommendations.length > 0) {
    content = (
      <div className="space-y-6">
        {webAnalysisContext && (
          <Card className="bg-muted/30 border-primary/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-md text-primary flex items-center">
                <Globe className="h-5 w-5 mr-2" /> Web Analysis Context
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground whitespace-pre-wrap">{webAnalysisContext}</p>
            </CardContent>
          </Card>
        )}
        {recommendations.map((visa, index) => (
          <VisaCard key={index} visa={visa} />
        ))}
      </div>
    );
  } else if (webAnalysisContext) { // Only web context, no visa recommendations
     content = (
      <Card className="bg-muted/30 border-primary/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-md text-primary flex items-center">
            <Globe className="h-5 w-5 mr-2" /> Web Analysis Context
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{webAnalysisContext}</p>
        </CardContent>
      </Card>
    );
  }
  else { // No recommendations, not loading, no error, no web context
    content = (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 text-center">
        <MessageSquareText className="h-16 w-16 mb-6 text-primary/70" />
        <p className="text-lg font-medium">Visa Insights & Recommendations</p>
        <p className="text-sm">
          Key details from your chat with Japa Genie, including any visa recommendations or web analysis, will appear here.
        </p>
        <p className="text-sm mt-2">
          Try asking: "Can you help me find visa options?" or "What are current success rates for Canadian study permits?"
        </p>
      </div>
    );
  }

  return (
    <Card className="h-full flex flex-col shadow-xl bg-card border border-border/50">
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle className="text-2xl text-primary">Japa Genie Insights</CardTitle>
          <CardDescription className="text-muted-foreground">
            Key points, web-researched info, and visa recommendations from your conversation.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 ml-4 shrink-0">
          <Badge variant="outline" className="text-sm font-semibold border-amber-500 text-amber-600">
            {progressPercentage}%
          </Badge>
          <Button asChild size="sm" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
            <Link href="/documents">
              <FileText className="h-4 w-4 mr-2" />
              Doc Tracker
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
          {content}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
