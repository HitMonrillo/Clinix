import React from 'react';
import { HeartPulse } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative z-10 bg-white/40 dark:bg-gray-950/40 backdrop-blur-md border-t border-white/60 dark:border-gray-800 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
               <div className="w-9 h-8 bg-clinix-blue rounded-lg flex items-center justify-center text-white font-bold font-poppins">C</div>
               <span className="text-xl font-bold text-clinix-dark dark:text-white font-poppins">Clinix</span>
            </div>
            <p className="text-clinix-muted dark:text-gray-400 text-sm leading-relaxed mb-6 font-medium">
              Modern primary care designed for real life. Compassionate providers, smart technology, and transparent pricing.
            </p>
            <div className="flex gap-4">
              {/* Social placeholders */}
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-clinix-blue hover:text-white transition-colors cursor-pointer"></div>
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-clinix-blue hover:text-white transition-colors cursor-pointer"></div>
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-clinix-blue hover:text-white transition-colors cursor-pointer"></div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-clinix-dark dark:text-white mb-4 font-poppins">Patients</h4>
            <ul className="space-y-3 text-sm text-clinix-muted dark:text-gray-400 font-medium">
              <li><a href="#" className="hover:text-clinix-blue dark:hover:text-blue-400 transition-colors">Log In</a></li>
              <li><a href="#" className="hover:text-clinix-blue dark:hover:text-blue-400 transition-colors">Book Appointment</a></li>
              <li><a href="#" className="hover:text-clinix-blue dark:hover:text-blue-400 transition-colors">Insurance & Pricing</a></li>
              <li><a href="#" className="hover:text-clinix-blue dark:hover:text-blue-400 transition-colors">Pay Bill</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-clinix-dark dark:text-white mb-4 font-poppins">Services</h4>
            <ul className="space-y-3 text-sm text-clinix-muted dark:text-gray-400 font-medium">
              <li><a href="#" className="hover:text-clinix-blue dark:hover:text-blue-400 transition-colors">Primary Care</a></li>
              <li><a href="#" className="hover:text-clinix-blue dark:hover:text-blue-400 transition-colors">Urgent Care</a></li>
              <li><a href="#" className="hover:text-clinix-blue dark:hover:text-blue-400 transition-colors">Mental Health</a></li>
              <li><a href="#" className="hover:text-clinix-blue dark:hover:text-blue-400 transition-colors">Women's Health</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-clinix-dark dark:text-white mb-4 font-poppins">Contact</h4>
            <ul className="space-y-3 text-sm text-clinix-muted dark:text-gray-400 font-medium">
              <li>help@clinix.health</li>
              <li>(800) 555-0123</li>
              <li className="pt-2">
                <span className="block font-semibold text-clinix-dark dark:text-white">Hours</span>
                Mon-Fri: 8am - 8pm<br/>Sat-Sun: 9am - 5pm
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-clinix-muted dark:text-gray-500 font-medium">
          <div className="flex items-center gap-2">
            <HeartPulse size={16} />
            <span>&copy; {new Date().getFullYear()} Clinix Health, Inc.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-clinix-dark dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-clinix-dark dark:hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-clinix-dark dark:hover:text-white transition-colors">HIPAA Notice</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;