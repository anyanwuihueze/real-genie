
'use client';

import Link from 'next/link';
import { JapaGenieLogo } from '@/components/icons/JapaGenieLogo'; 

export function AppFooter() {
  return (
    <footer className="bg-card border-t border-border/50 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-6"> {/* Reduced padding significantly */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-3 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center group">
              <JapaGenieLogo className="w-6 h-6 text-genie-gold group-hover:scale-105 transition-transform" /> {/* Smaller logo */}
              <span className="text-sm font-semibold text-genie-gold group-hover:text-yellow-300 transition-colors ml-1.5"> {/* Smaller text */}
                Japa Genie
              </span>
            </Link>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
          
          <nav className="flex space-x-4">
            <Link href="/privacy-policy" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/contact-us" className="text-xs text-muted-foreground hover:text-primary transition-colors">Contact Us</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
