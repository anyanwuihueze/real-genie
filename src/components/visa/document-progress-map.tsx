
'use client';

import type { SVGProps } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { DocumentProgress, DocumentStatusType } from '@/types/document-progress';
import { Clock, UploadCloud, CheckCircle2, XCircle, FileText, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusAttributes {
  icon: React.ReactElement<SVGProps<SVGSVGElement>>;
  badgeVariant: 'outline' | 'default' | 'destructive' | 'secondary';
  badgeClassName: string;
  textColorClassName: string;
}

const getStatusAttributes = (status: DocumentStatusType): StatusAttributes => {
  switch (status) {
    case 'pending':
      return { 
        icon: <Clock className="h-5 w-5 text-muted-foreground" />, 
        badgeVariant: 'outline',
        badgeClassName: 'border-dashed border-muted-foreground/50 text-muted-foreground',
        textColorClassName: 'text-muted-foreground',
      };
    case 'submitted':
      return { 
        icon: <UploadCloud className="h-5 w-5 text-primary" />, 
        badgeVariant: 'secondary', 
        badgeClassName: 'bg-primary/10 text-primary border-primary/30',
        textColorClassName: 'text-primary',
      };
    case 'approved':
      return { 
        icon: <CheckCircle2 className="h-5 w-5 text-accent" />, 
        badgeVariant: 'default',
        badgeClassName: 'bg-accent text-accent-foreground hover:bg-accent/90 border-transparent',
        textColorClassName: 'text-accent',
      };
    case 'rejected':
      return { 
        icon: <XCircle className="h-5 w-5 text-destructive" />, 
        badgeVariant: 'destructive',
        badgeClassName: 'bg-destructive/10 text-destructive border-destructive/30',
        textColorClassName: 'text-destructive',
      };
    default:
      return { 
        icon: <AlertTriangle className="h-5 w-5 text-muted-foreground" />, 
        badgeVariant: 'outline',
        badgeClassName: 'border-muted-foreground/50 text-muted-foreground',
        textColorClassName: 'text-muted-foreground',
      };
  }
};

interface DocumentProgressMapProps {
  documents: DocumentProgress[];
}

export function DocumentProgressMap({ documents }: DocumentProgressMapProps) {
  if (!documents || documents.length === 0) {
    return (
      <Card className="shadow-lg bg-card border border-border/50">
        <CardHeader>
          <CardTitle className="text-xl text-primary">Document Submission Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No documents to track.</p>
            <p className="text-sm text-muted-foreground">Your document list will appear here once available.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const approvedCount = documents.filter(doc => doc.status === 'approved').length;
  const totalCount = documents.length;
  const progressPercentage = totalCount > 0 ? (approvedCount / totalCount) * 100 : 0;

  return (
    <Card className="shadow-xl bg-card border border-border/50">
      {/* CardHeader removed to be included in parent page if needed for title flexibility */}
      <CardContent className="space-y-6 pt-6"> {/* Added pt-6 since CardHeader might be omitted */}
        <div>
          <div className="mb-2 flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">Overall Approval Progress</span>
            <span className="text-sm text-muted-foreground">{approvedCount} of {totalCount} approved</span>
          </div>
          <Progress value={progressPercentage} className="w-full h-3 rounded-full bg-muted" indicatorClassName="bg-accent" aria-label={`Overall document approval progress: ${Math.round(progressPercentage)}%`} />
          <p className="text-xs text-muted-foreground mt-1 text-right">{Math.round(progressPercentage)}% Approved</p>
        </div>
        
        <div className="space-y-3">
          {documents.map((doc) => {
            const { icon, badgeVariant, badgeClassName, textColorClassName } = getStatusAttributes(doc.status);
            return (
              <div key={doc.id} className="flex items-start p-3 border border-border/30 rounded-lg bg-background hover:shadow-md transition-shadow duration-200 space-x-3">
                <div className="shrink-0 pt-0.5">{icon}</div>
                <div className="flex-grow min-w-0">
                  <p className={`font-medium text-foreground truncate`} title={doc.name}>{doc.name}</p>
                  {doc.details && <p className={cn("text-xs truncate", textColorClassName)} title={doc.details}>{doc.details}</p>}
                </div>
                <Badge variant={badgeVariant} className={cn("capitalize ml-2 shrink-0 text-xs px-2 py-0.5", badgeClassName)}>{doc.status}</Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
