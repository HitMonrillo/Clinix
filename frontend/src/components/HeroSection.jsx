import React from 'react';
import { ShieldCheck, ArrowRight, Calendar, Video, ArrowDown, Star, User } from 'lucide-react';
import { Button } from './ui/Button';

const HeroSection = () => {

  return (
    <section className="relative min-h-[100vh] flex items-center pt-28 pb-12 lg:pt-0 lg:pb-0" aria-label="Hero">
      <div className="max-w-screen-2xl mx-auto w-full px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center h-full relative z-10">
        
        {/* Left Column: Content */}
        <div className="lg:col-span-6 flex flex-col items-start gap-6 lg:gap-8 animate-fade-up">
          
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-blue-50/80 dark:bg-blue-900/30 backdrop-blur-sm text-clinix-blue dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide border border-blue-100 dark:border-blue-800">
            <span className="w-2 h-2 rounded-full bg-clinix-teal animate-pulse"></span>
            Now accepting new patients
          </div>

          {/* Headline */}
          <div className="relative">
             <h1 className="text-4xl md:text-5xl lg:text-6xl/tight font-bold text-clinix-dark dark:text-white tracking-tight font-poppins">
              Modern primary care <br/> that fits your <span className="text-clinix-blue dark:text-blue-400 relative inline-block">
                life
                {/* Underline decoration */}
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-clinix-teal/40 dark:text-teal-500/40" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>
            </h1>
          </div>

          {/* Subheadline */}
          <p className="text-lg md:text-lg text-clinix-muted dark:text-gray-300 leading-relaxed max-w-xl font-medium">
            In-clinic and virtual visits, quick scheduling, and continuous care — all on one platform. Trusted doctors. Transparent pricing.
          </p>

          {/* CTA Group */}
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4 mt-2">
            <Button size="lg" className="!py-3 text-clinix-blue dark:text-white cursor-pointer dark:shadow-blue-900/30" icon={<ArrowRight size={18} />}>
              Book an appointment
            </Button>
            <Button variant="ghost" size="lg" className="border cursor-pointer border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 !py-3 backdrop-blur-sm">
              See insurance & pricing
            </Button>
          </div>

          {/* Microcopy & Trust */}
          <div className="flex flex-col gap-4 mt-2">
            <p className="text-sm text-clinix-muted dark:text-gray-400 font-medium">
              Appointments available today • Telehealth visits start at $35
            </p>
            
            <div className="flex flex-wrap items-center gap-6 pt-5 border-t border-gray-200/60 dark:border-gray-700/60 w-full">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-clinix-teal dark:text-teal-400" size={20} />
                <span className="text-sm font-medium text-clinix-dark dark:text-gray-200">Board-certified physicians</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-clinix-teal dark:text-teal-400" size={20} />
                <span className="text-sm font-medium text-clinix-dark dark:text-gray-200">HIPAA-secure</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/40 dark:bg-black/20 px-2 py-1 rounded-lg backdrop-blur-sm">
                 <div className="flex text-yellow-400">
                   <Star size={16} fill="currentColor" />
                 </div>
                 <span className="text-sm font-bold text-clinix-dark dark:text-white ml-1">4.8</span>
                 <span className="text-sm text-clinix-muted dark:text-gray-400">(3.2k+)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual */}
        <div className="lg:col-span-6 relative h-full min-h-[400px] lg:min-h-[85vh] flex items-center justify-end">
           {/* Main Image Container (Solid Color + Mockup User Icon) */}
           <div className="relative w-full h-[500px] lg:h-[80%] rounded-[2rem] overflow-hidden shadow-2xl dark:shadow-blue-900/20 clip-hero-image transition-all bg-gradient-to-br from-clinix-blue to-blue-600 dark:from-blue-900 dark:to-blue-950 flex items-center justify-center">
             
             {/* Simple subtle pattern overlay for texture */}
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
             
             {/* Mockup User Icon (Stylized Background Element) */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 dark:opacity-10 scale-125 translate-y-12">
                <User size={400} className="text-white" strokeWidth={1} />
             </div>
             
             {/* Floating Booking Mockup (Untouched) */}
             <div className="absolute bottom-6 left-6 right-6 lg:left-auto lg:-translate-x-12 lg:bottom-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-5 rounded-3xl shadow-lift border border-white/50 dark:border-gray-700 animate-fade-up max-w-sm max-h-fit z-20" style={{animationDelay: '0.2s'}}>
               <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-800 pb-3">
                 <div>
                   <h3 className="text-sm font-bold text-clinix-dark dark:text-white font-poppins">Dr. Sarah Lee</h3>
                   <p className="text-xs text-clinix-muted dark:text-gray-400">Primary Care • 4.9 <Star size={10} className="inline text-yellow-400 fill-current"/></p>
                 </div>
                 {/* Initials Placeholder Avatar */}
                 <div className="w-10 h-10 rounded-full bg-clinix-blue text-white flex items-center justify-center font-bold text-sm ring-2 ring-white dark:ring-gray-700 shadow-sm">
                   SL
                 </div>
               </div>
               
               <div className="space-y-3">
                 <div className="flex gap-2">
                    <div className="flex-1 p-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 rounded-xl text-center cursor-pointer">
                      <Calendar size={16} className="mx-auto text-clinix-blue dark:text-blue-400 mb-1" />
                      <span className="block text-[10px] uppercase tracking-wide font-bold text-clinix-blue dark:text-blue-300">In-Clinic</span>
                    </div>
                    <div className="flex-1 p-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Video size={16} className="mx-auto text-gray-400 mb-1" />
                      <span className="block text-[10px] uppercase tracking-wide font-bold text-gray-500 dark:text-gray-400">Virtual</span>
                    </div>
                 </div>
                 
                 <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700/50">
                   <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Today's Availability</p>
                   <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                     <span className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">2:30 PM</span>
                     <span className="px-3 py-1.5 bg-clinix-blue text-white rounded-lg text-xs font-semibold whitespace-nowrap shadow-md shadow-blue-500/20">3:15 PM</span>
                     <span className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">4:00 PM</span>
                   </div>
                 </div>

                 <Button size="sm" fullWidth className="!py-2.5 text-sm !rounded-xl mt-1 bg-blue-500 text-white hover:bg-blue-800">Confirm Booking</Button>
               </div>
             </div>
           </div>
        </div>

      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block animate-bounce-slow text-clinix-muted/50 dark:text-white/30">
        <ArrowDown size={24} />
      </div>
    </section>
  );
};

export default HeroSection;
