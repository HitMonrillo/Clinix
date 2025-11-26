import React from 'react';
import { Clock, Video, CreditCard, UserCheck, CalendarCheck, Activity, Star } from 'lucide-react';
import { Button } from './ui/Button';

const Features = () => {
  return (
    <>
      {/* 3-Column Features - Glass Cards */}
      <section className="py-16 relative z-10" aria-label="Core Benefits">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          {[
            { 
              icon: Clock, 
              title: "Same-day visits", 
              desc: "Book online in minutes. We hold spots open every day for sick visits and urgent needs." 
            },
            { 
              icon: Video, 
              title: "Telehealth anywhere", 
              desc: "Connect with your doctor from home or work. Perfect for follow-ups, prescriptions, and advice." 
            },
            { 
              icon: CreditCard, 
              title: "Transparent pricing", 
              desc: "Know what you’ll pay before you walk in. Most insurance accepted, plus affordable cash rates." 
            }
          ].map((feature, idx) => (
            <div key={idx} className="flex flex-col items-start gap-4 p-6 rounded-3xl bg-white/70 dark:bg-gray-900/60 backdrop-blur-md border border-white/60 dark:border-gray-700/50 hover:bg-white/90 dark:hover:bg-gray-800/80 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1">
              <div className="w-14 h-14 bg-clinix-lightBlue/50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-clinix-blue dark:text-blue-400 mb-2 ring-1 ring-blue-100 dark:ring-blue-800/50">
                <feature.icon size={26} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-clinix-dark dark:text-white font-poppins">{feature.title}</h3>
              <p className="text-clinix-muted dark:text-gray-300 leading-relaxed font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works + Testimonials Split */}
      <section className="py-20 relative z-10" aria-label="How it works and Reviews">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16">
          
          {/* Left: How It Works */}
          <div>
            <span className="text-clinix-teal dark:text-teal-400 font-bold tracking-wider text-sm uppercase bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-full border border-teal-100 dark:border-teal-800/50">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-clinix-dark dark:text-white mt-6 mb-10 font-poppins">Care made simple</h2>
            
            <div className="space-y-6 relative">
              {/* Connecting line */}
              <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-gray-200 dark:bg-gray-800"></div>
              
              {[
                { 
                  icon: UserCheck, 
                  title: "Choose your visit type", 
                  desc: "Select in-person or virtual. Filter by symptom or provider preference." 
                },
                { 
                  icon: CalendarCheck, 
                  title: "Pick a time that works", 
                  desc: "See real-time availability. No phone tag, no holding." 
                },
                { 
                  icon: Activity, 
                  title: "Get care & follow-up", 
                  desc: "Receive top-tier care. Test results and prescriptions appear in your app instantly." 
                }
              ].map((step, idx) => (
                <div key={idx} className="relative flex gap-6 items-start bg-white/60 dark:bg-gray-900/60 backdrop-blur-md p-6 rounded-3xl border border-white/60 dark:border-gray-800 shadow-sm z-10 hover:bg-white dark:hover:bg-gray-800 transition-colors">
                  <div className="w-14 h-14 bg-clinix-blue text-white rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20 ring-4 ring-white dark:ring-gray-900">
                    <step.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-clinix-dark dark:text-white mb-1 font-poppins">{step.title}</h3>
                    <p className="text-clinix-muted dark:text-gray-400">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Testimonials Carousel */}
          <div className="flex flex-col justify-center">
             <div className="bg-clinix-dark dark:bg-gray-900 text-white p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden shadow-2xl border border-gray-800/50">
               
               <div className="relative z-10">
                 <div className="flex text-yellow-400 mb-6">
                   {[...Array(5)].map((_, i) => <Star key={i} size={22} fill="currentColor" />)}
                 </div>
                 
                 <blockquote className="text-2xl font-medium leading-relaxed mb-8 font-poppins">
                   "Finally, a doctor's office that respects my time. The app makes booking incredibly easy, and Dr. Chen actually listened to my concerns without rushing."
                 </blockquote>

                 <div className="flex items-center gap-4">
                   {/* Initials Avatar Placeholder */}
                   <div className="w-14 h-14 rounded-full bg-blue-500  flex items-center justify-center text-white font-bold text-xl shadow-inner border-2 border-bluee-700">
                     MT
                   </div>
                   <div>
                     <div className="font-bold text-lg">Mark T.</div>
                     <div className="text-gray-400 text-sm">Patient since 2021</div>
                   </div>
                 </div>
               </div>
             </div>
             
             <div className="mt-8 flex justify-between items-center px-4">
               <div>
                  <div className="text-3xl font-bold text-clinix-dark dark:text-white font-poppins">4.8/5</div>
                  <div className="text-clinix-muted dark:text-gray-400 text-sm">Average rating</div>
               </div>
               <Button variant="ghost" className="text-clinix-blue dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30">Read all 3,200+ reviews</Button>
             </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default Features;