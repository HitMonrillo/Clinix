import React, { useState, useEffect, useContext } from 'react';
import NavBar from '../components/NavBar';
import HeroSection from '../components/HeroSection';
import Features from '../components/Features';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import { ThemeContext } from '../Layouts/RootLayout';
import { Plus, ChevronDown } from 'lucide-react';


const HomePage = () => {
  
  const [blobs, setBlobs] = useState([
    { id: 1, color: "from-blue-600 to-blue-500/80" },
    { id: 2, color: "from-red-700 to-red-600/90" },
    { id: 3, color: "from-green-600 to-green-500/80" },
    { id: 4, color: "from-purple-600 to-purple-500/80" },
    { id: 5, color: "from-pink-600 to-pink-500/80" },
  ]);
  
  // Initialize styles for blobs
  const [blobStyles, setBlobStyles] = useState({});

  const { isDark, toggleTheme, isMobile } = useContext(ThemeContext);


  

  useEffect(() => {
    const generateRandomStyle = () => {
      const baseWidth = 200 + Math.random() * 300; 
      const baseHeight = 200 + Math.random() * 300;
      return {
        top: `${Math.random() * 100}vh`,
        left: `${Math.random() * 100}vw`,
        width: `${baseWidth}px`,
        height: `${baseHeight}px`,
        transform: `translate(-50%, -50%) scale(${0.8 + Math.random() * 0.4})`,
        opacity: isDark ? 0.15 : 0.25, // Lower opacity for dark mode to keep text readable
      };
    };

    // Initial generation
    const newStyles = {};
    blobs.forEach(b => newStyles[b.id] = generateRandomStyle());
    setBlobStyles(newStyles);

    const interval = setInterval(() => {
      setBlobStyles(prev => {
        const next = { ...prev };
        blobs.forEach(b => {
           // Randomly update some blobs for organic movement
           if (Math.random() > 0.5) {
             next[b.id] = { ...next[b.id], ...generateRandomStyle() };
           }
        });
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [blobs, isDark]);

  return (
    <div className={`relative min-h-screen font-sans transition-colors duration-300 ${isDark ? 'text-white' : 'text-clinix-dark'}`}>
      
      {/* Background Blobs Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-clinix-bg dark:bg-gray-950 transition-colors duration-500">
        {blobs.map(blob => (
          <div
            key={blob.id}
            className={`absolute rounded-full blur-[80px] transition-all duration-[4000ms] ease-in-out bg-gradient-to-r ${blob.color}`}
            style={blobStyles[blob.id] || {}}
          ></div>
        ))}
        {/* Overlay to ensure text contrast */}
        <div className="absolute inset-0 bg-white/40 dark:bg-black/20 backdrop-blur-[2px]"></div>
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <NavBar isDark={isDark} toggleTheme={toggleTheme} />
        
        <main>
          <HeroSection />
          <Features />
          
          {/* Services Grid */}
          <section id="services" className="py-20 bg-white/60 dark:bg-gray-900/40 backdrop-blur-md border-y border-white/50 dark:border-white/5" aria-label="Medical Services">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 font-poppins dark:text-white">Everything you need in one place</h2>
                <p className="text-clinix-muted dark:text-gray-300 text-lg">From annual physicals to unexpected illnesses, our team is here to help you stay healthy.</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {[
                   { title: "Primary Care", desc: "Annual physicals, screenings, and preventive health." },
                   { title: "Urgent Care", desc: "Same-day treatment for flu, infections, and minor injuries." },
                   { title: "Mental Health", desc: "Therapy and medication management for anxiety & depression." },
                   { title: "Chronic Care", desc: "Ongoing support for diabetes, hypertension, and more." }
                 ].map((service, i) => (
                   <div key={i} className="group p-6 rounded-3xl border border-white/60 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg hover:border-clinix-blue/30 dark:hover:border-blue-500/30 transition-all duration-300">
                     <h3 className="text-xl font-bold mb-2 group-hover:text-clinix-blue dark:group-hover:text-blue-400 transition-colors font-poppins dark:text-white">{service.title}</h3>
                     <p className="text-clinix-muted dark:text-gray-400 mb-6">{service.desc}</p>
                     <a href="#" className="text-sm font-semibold text-clinix-blue dark:text-blue-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                       Book Now <Plus size={16} />
                     </a>
                   </div>
                 ))}
              </div>
              
              <div className="mt-12 text-center">
                <Button variant="outline" size="lg">View all services</Button>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20" aria-label="Frequently Asked Questions">
            <div className="max-w-3xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12 font-poppins dark:text-white">Common questions</h2>
              <div className="space-y-4">
                {[
                  "Do you accept my insurance?",
                  "How much does a visit cost without insurance?",
                  "Can I book a video appointment for a new patient visit?",
                  "What is your cancellation policy?"
                ].map((q, i) => (
                  <details key={i} className="group bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 dark:border-gray-700/50 open:ring-2 open:ring-clinix-blue/10 dark:open:ring-blue-500/20">
                    <summary className="flex items-center justify-between p-6 cursor-pointer font-medium text-lg list-none font-poppins dark:text-gray-100">
                      {q}
                      <ChevronDown className="text-clinix-muted dark:text-gray-400 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-6 pb-6 text-clinix-muted dark:text-gray-300 leading-relaxed">
                      Most major insurance plans are accepted including Aetna, Cigna, BlueCross, and United. For those paying cash, visits start at $150 for initial intake and $89 for follow-ups.
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-20 bg-clinix-blue dark:bg-blue-600 text-white text-center shadow-lg relative z-20">
            <div className="max-w-4xl mx-auto px-6">
               <h2 className="text-3xl md:text-4xl font-bold mb-6 font-poppins">Ready to feel better?</h2>
               <p className="text-blue-100 mb-8 max-w-xl mx-auto text-lg">Join thousands of patients who have found a better way to manage their health.</p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <Button size="lg" className=" bg-white text-blue-600 hover:bg-blue-50 hover:text-white border-transparent dark:bg-white/90 dark:text-clinix-blue dark:hover:text-white dark:hover:bg-blue-700">
                   Book Appointment
                 </Button>
                 <Button variant="outline" size="lg" className="border-blue-300 text-white hover:bg-blue-700/50 dark:border-blue-200">
                   Download App
                 </Button>
               </div>
            </div>
          </section>

        </main>

        <Footer />
      </div>
    </div>
  );
};

export default HomePage;