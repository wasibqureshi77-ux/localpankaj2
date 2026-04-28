"use client";
import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

import axios from "axios";

const Footer = () => {
  const [config, setConfig] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await axios.get("/api/site-config");
        if (data) setConfig(data);
      } catch (err) {
        console.error("Footer config fetch error:", err);
      }
    };
    fetchConfig();
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800 font-sans">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4">
          <h3 className="app-h3 text-white">Local<span className="text-blue-500">Pankaj</span></h3>
          <p className="text-sm leading-loose text-gray-400">
            {config?.footerText || "Jaipur's most trusted home service platform. From AC repair to plumbing, we bring the experts to your doorstep within hours."}
          </p>
          <div className="flex items-center space-x-4">
            <Link href="#" className="hover:text-blue-500 transition-colors"><Facebook size={20} /></Link>
            <Link href="https://www.instagram.com/localpankaj/" className="hover:text-pink-500 transition-colors"><Instagram size={20} /></Link>
            <Link href="#" className="hover:text-blue-400 transition-colors"><Twitter size={20} /></Link>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 text-sm tracking-widest">Quick Links</h4>
          <ul className="space-y-3 font-medium">
            <li><Link href="/" className="hover:text-blue-500 transition-colors">Home</Link></li>
            <li><Link href="/#services" className="hover:text-blue-500 transition-colors">All Services</Link></li>
            <li><Link href="/ac-repair-jaipur" className="hover:text-blue-500 transition-colors">AC Repair Jaipur</Link></li>
            <li><Link href="/ro-repair-jaipur" className="hover:text-blue-500 transition-colors">RO Repair Jaipur</Link></li>
            <li><Link href="/#faq" className="hover:text-blue-500 transition-colors">FAQs</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 text-sm tracking-widest">Support</h4>
          <ul className="space-y-3 font-medium">
            <li><Link href="/privacy" className="hover:text-blue-500 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-blue-500 transition-colors">Terms of Service</Link></li>
            <li><Link href="/contact" className="hover:text-blue-500 transition-colors">Contact Us</Link></li>
            {/* <li><Link href="/editor/login" className="hover:text-yellow-500 transition-colors">Editor Login</Link></li>
             <li><Link href="/super-admin/login" className="hover:text-red-500 transition-colors">Admin Login</Link></li> */}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 text-sm tracking-widest">Connect</h4>
          <ul className="space-y-4 font-medium">
            <li className="flex items-start space-x-3">
              <MapPin className="text-blue-500 shrink-0 mt-1" size={18} />
              <a 
                href="https://share.google/RFItqoQXmB3bDykWD"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500 transition-colors cursor-pointer"
              >
                Aastha Pride, Police Station, Plot No 69, Skit College Rd, near Ram Nagariya, Jagatpura, Jaipur, Rajasthan 302017
              </a>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="text-blue-500 shrink-0" size={18} />
              <a href={`tel:${config?.phone || "+919876543210"}`} className="hover:text-blue-500">{config?.phone || "+91 98765 43210"}</a>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="text-blue-500 shrink-0" size={18} />
              <a href={`mailto:${config?.email || "support@localpankaj.com"}`} className="hover:text-blue-500">{config?.email || "support@localpankaj.com"}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-8 border-t border-gray-800 text-center text-xs font-semibold tracking-widest text-gray-500">
        © 2026 Local Pankaj. Made for Jaipur with ❤️. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

