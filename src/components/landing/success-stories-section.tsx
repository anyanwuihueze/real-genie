
'use client';

import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { ArrowRight, Play, Star } from "lucide-react";

const successStories = [
  {
    name: "Sarah from Lagos",
    country: "Canada",
    role: "Software Developer",
    image: "/images/success1.jpg",
    video: "/videos/success1.mp4",
    quote: "Japa Genie helped me navigate the Express Entry process and I got my visa in just 8 weeks!"
  },
  {
    name: "John from Nairobi",
    country: "Germany",
    role: "Data Scientist",
    image: "/images/success2.jpg",
    video: "/videos/success2.mp4",
    quote: "The Start-Up Visa pathway was perfect for me. Japa Genie's AI matched me to Germany and now I'm thriving."
  },
  {
    name: "Amina from Accra",
    country: "UK",
    role: "Nurse",
    image: "/images/success3.jpg",
    video: "/videos/success3.mp4",
    quote: "The document preparation guides were spot on. I sailed through my visa interview!"
  }
];

export function SuccessStoriesSection() {
  return (
    <section className="py-16 bg-surface-alt relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/pattern-light.svg')] opacity-5"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            Real Results from Real Users
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Africans just like you who found success with Japa Genie
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {successStories.map((story, index) => (
            <div 
              key={index} 
              className="group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
            >
              <div className="aspect-video bg-gray-100 relative">
                <div className="absolute inset-0 bg-[url('/images/video-preview.jpg')] bg-cover bg-center">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button 
                        size="icon" 
                        className="rounded-full bg-white/20 hover:bg-white/40 text-white"
                      >
                        <Play className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">{story.name}</h3>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-genie-gold fill-genie-gold" />
                    <Star className="h-5 w-5 text-genie-gold fill-genie-gold" />
                    <Star className="h-5 w-5 text-genie-gold fill-genie-gold" />
                    <Star className="h-5 w-5 text-genie-gold fill-genie-gold" />
                    <Star className="h-5 w-5 text-genie-gold fill-genie-gold" />
                  </div>
                </div>
                <p className="text-gray-600 mb-2">{story.role}</p>
                <p className="text-gray-500 mb-4">{story.country}</p>
                <p className="text-gray-600 line-clamp-3">{story.quote}</p>
                <div className="mt-4">
                  <Button 
                    variant="link" 
                    className="text-genie-gold hover:text-red-500 p-0"
                    asChild
                  >
                    <Link href="/success-stories">Read Full Story →</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="group relative overflow-hidden bg-gradient-to-r from-genie-gold to-red-500 hover:from-red-500 hover:to-genie-gold transition-all duration-300 shadow-lg hover:shadow-xl"
            asChild
          >
            <Link href="/success-stories" className="flex items-center gap-2">
              <span>View All Success Stories</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
