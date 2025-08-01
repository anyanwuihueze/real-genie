'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Plane, Sparkles, ArrowRight } from "lucide-react";
import Link from 'next/link';
import { cn } from '@/lib/utils';

const placeholderQuestionsList = [
  "Ask about visas for Canada...",
  "What are EU Blue Card requirements?",
  "How much is a UK student visa?",
  "Tell me about Australian skilled migration.",
  "What's the processing time for US H-1B?",
  "Compare Germany vs. Netherlands for tech."
];

export function HeroSection() {
  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const planeRef = useRef<HTMLDivElement>(null);
  const [planeTransformY, setPlaneTransformY] = useState(0);

  const typingSpeed = 120;
  const deletingSpeed = 70;
  const pauseBeforeDelete = 2500;
  const pauseBeforeNewQuestion = 500;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isDeleting) {
      if (charIndex > 0) {
        timeoutId = setTimeout(() => {
          setCurrentPlaceholder(prev => prev.substring(0, prev.length - 1));
          setCharIndex(charIndex - 1);
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setQuestionIndex((prevIndex) => (prevIndex + 1) % placeholderQuestionsList.length);
        timeoutId = setTimeout(() => {
          // Pause before starting new question
        }, pauseBeforeNewQuestion);
      }
    } else { // Typing
      if (charIndex < placeholderQuestionsList[questionIndex].length) {
        timeoutId = setTimeout(() => {
          setCurrentPlaceholder(placeholderQuestionsList[questionIndex].substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, typingSpeed);
      } else {
        timeoutId = setTimeout(() => {
          setIsDeleting(true);
        }, pauseBeforeDelete);
      }
    }
    return () => clearTimeout(timeoutId);
  }, [charIndex, isDeleting, questionIndex]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      if (planeRef.current) {
        const scrollY = window.scrollY;
        const parallaxFactor = -0.15; 
        setPlaneTransformY(scrollY * parallaxFactor);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <section className="min-h-screen flex items-center pt-20 md:pt-24 bg-gradient-to-br from-[#0f172a]/95 via-[#4338ca]/80 to-[#f59e0b]/60 relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover mix-blend-overlay"
          src="https://assets.mixkit.co/videos/preview/mixkit-womans-hands-typing-on-a-laptop-4299-large.mp4"
        />
      </div>

      {/* Animated Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent z-[1] animate-shine"></div>
      
      {/* Enhanced Plane Animation */}
      <div
        ref={planeRef}
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ transform: `translateY(${planeTransformY}px)` }}
      >
        <Plane
          className="absolute h-48 w-48 md:h-64 md:w-64 text-genie-gold/40 animate-fly-across drop-shadow-[0_0_15px_rgba(255,107,107,0.5)]"
          style={{ animationDuration: '18s' }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-[3]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="lg:pr-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-white via-genie-gold to-red-400 bg-clip-text text-transparent">
              STOP Getting Scammed by <span className="text-red-400">Fake Visa Agents.</span> START Getting Real Results Today <span className="text-genie-gold">with Japa Genie.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-xl mb-8 leading-relaxed">
              Our AI matches you to countries where Africans like you have <span className="text-genie-gold font-bold">89% approval rates</span>. Start a conversation with Japa Genie and find your destination...
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Button
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-genie-gold to-red-500 hover:from-red-500 hover:to-genie-gold transition-all duration-300 shadow-lg hover:shadow-xl"
                asChild
              >
                <Link href="/chat" className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                  <span className="relative z-10">Start Your Journey</span>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </Button>
              <Button
                variant="link"
                className="text-white hover:text-genie-gold text-lg group flex items-center gap-1"
                asChild
              >
                <Link href="/how-it-works">
                  Learn How It Works 
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>

          <Link href="/chat" className="group block relative mt-10 lg:mt-0">
            <div className="transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-3xl transform -rotate-3 lg:-rotate-6 hero-product-visual-container shadow-2xl"></div>
              <div className={cn(
                "relative rounded-2xl shadow-xl hero-chat-visual overflow-hidden p-1 backdrop-blur-sm"
              )}>
                <div className="bg-card/80 rounded-[calc(1rem-4px)] h-full w-full border border-white/10">
                  <div className="h-96 md:h-[28rem] flex flex-col items-center justify-center p-4 md:p-6 text-dark relative">
                    <div className="absolute inset-0 bg-[url('/videos/chat-preview.mp4')] bg-cover bg-center opacity-10"></div>
                    <div className="relative z-10 w-full max-w-md text-center">
                      <MessageCircle className="text-primary fill-primary/10 h-16 w-16 md:h-20 md:w-20 mb-3 md:mb-4 inline-block animate-pulse" />
                      <div className="text-2xl md:text-3xl font-bold mb-1 md:mb-2 text-foreground bg-gradient-to-b from-foreground to-gray-600 bg-clip-text text-transparent">
                        Chat with Japa Genie
                      </div>
                      <div className="text-sm md:text-base text-secondary mb-4 md:mb-6">
                        Your journey starts with a simple question.
                      </div>
                      
                      <div className="w-full max-w-sm mx-auto animate-wiggle">
                        <div className="flex items-center border border-input/30 rounded-full px-3 py-2 md:px-4 md:py-3 bg-card/50 shadow-sm backdrop-blur-sm hover:border-primary/50 transition-colors">
                          <Input
                            type="text"
                            placeholder={currentPlaceholder + (showCursor && (charIndex === placeholderQuestionsList[questionIndex].length || charIndex === 0) ? '|' : '')}
                            className="flex-grow focus:outline-none text-xs md:text-sm text-dark bg-transparent placeholder-secondary border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            readOnly
                          />
                          <div className="ml-2 md:ml-3 text-primary h-auto w-auto p-0 group-hover:text-genie-gold transition-colors">
                            <Send className="h-4 w-4 md:h-5 md:w-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
