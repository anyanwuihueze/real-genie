'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { JapaGenieLogo } from "@/components/icons/JapaGenieLogo";
import { Menu, X } from "lucide-react";
import { cn } from '@/lib/utils';

export function AppHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: "/features", label: "Features" },
    { href: "/how-it-works", label: "How it Works" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/pricing", label: "Pricing" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <header className="glass-header sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <JapaGenieLogo className="w-10 h-10 mr-2 text-genie-gold group-hover:scale-105 transition-transform" />
          <span className="text-2xl font-semibold text-genie-gold group-hover:text-yellow-300 transition-colors">
            Japa Genie
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div
          className="hidden md:flex items-center space-x-6"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-dark hover:text-primary transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
          <Button
            size="sm"
            className="glossy-button px-5 py-2 text-sm font-medium" 
            asChild
          >
             <Link href="/chat">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-dark focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu (Dropdown) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white py-4 shadow-lg glass-effect mx-4 mb-4 rounded-xl">
          <div className="flex flex-col items-center space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-dark hover:text-primary transition-colors duration-200 w-full text-center py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button size="sm" className="glossy-button px-5 py-2 text-sm font-medium w-fit" asChild>
              <Link href="/chat" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
