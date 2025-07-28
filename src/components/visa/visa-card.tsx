
import type { VisaRecommendationOutput } from "@/ai/flows/visa-recommendation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, School, Briefcase, Clock, Lightbulb } from "lucide-react";
import { SuccessRateVisual } from "./success-rate-visual";
import { Separator } from "@/components/ui/separator";

type VisaCardProps = {
  visa: VisaRecommendationOutput[0]; // This refers to one item from the array
};

export function VisaCard({ visa }: VisaCardProps) {
  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-primary">{visa.name}</CardTitle>
        <div className="text-sm text-muted-foreground">
          Processing Time: <Badge variant="secondary" className="ml-1"><Clock className="inline-block h-4 w-4 mr-1" />{visa.processingTime}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row items-center gap-6">
        <div className="md:w-2/3 space-y-3">
          <div className="flex items-center text-sm">
            <DollarSign className="h-5 w-5 mr-2 text-accent flex-shrink-0" />
            <span>Cost: <span className="font-medium">${visa.cost.usd.toLocaleString()} USD</span></span>
          </div>
          <div>
            <h4 className="font-medium mb-1.5 text-md">Key Requirements:</h4>
            <ul className="list-none space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-start">
                <School className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
                <span><span className="font-medium text-foreground/80">Education:</span> {visa.requirements.minimumEducation}</span>
              </li>
              <li className="flex items-start">
                <Briefcase className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
                <span><span className="font-medium text-foreground/80">Experience:</span> {visa.requirements.minimumWorkExperience}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="md:w-1/3 flex items-center justify-center md:border-l md:pl-6 border-border/70">
          <SuccessRateVisual rate={visa.successRate} />
        </div>
      </CardContent>
      <Separator className="my-0" />
      <CardFooter className="bg-muted/30 p-4">
        <div className="flex items-start text-sm">
          <Lightbulb className="h-5 w-5 mr-3 mt-0.5 text-accent flex-shrink-0" />
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">AI Coach's Note:</span>{' '}
            {visa.reason ? visa.reason : "Japa Genie is still analyzing this option. More details might be available if you ask further."}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
