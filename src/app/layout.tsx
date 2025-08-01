
import type {Metadata} from 'next';
import './globals.css'; // Styles from globals.css will apply
import { Toaster } from "@/components/ui/toaster";
import { AppHeader } from '@/components/layout/app-header';
import { AppFooter } from '@/components/layout/app-footer'; // Import the footer

export const metadata: Metadata = {
  title: 'Japa Genie: Your AI-Powered Visa Guide',
  description: 'Stop getting scammed by visa agents. Start getting real results today with Japa Genie. AI-powered visa guidance, eligibility checks, and personalized roadmaps.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="font-sans text-dark bg-light h-full flex flex-col">
        <AppHeader />
        <main className="flex-grow overflow-y-auto">{children}</main>
        <AppFooter /> {/* Add the footer here */}
        <Toaster />
      </body>
    </html>
  );
}
