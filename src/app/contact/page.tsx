"use client";
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  ShieldCheck,
  Zap,
  Map,
  CheckCircle2
} from "lucide-react";

// --- Reusable UI Components ---

const ContactCard = ({ icon: Icon, title, description, link, linkText }: any) => (
  <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-6">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">{description}</p>
    <a 
      href={link} 
      className="text-blue-600 font-semibold text-sm hover:text-blue-700 inline-flex items-center group"
    >
      {linkText}
      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </a>
  </div>
);

const InputField = ({ label, id, type = "text", placeholder, required = false, isTextArea = false }: any) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-semibold text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {isTextArea ? (
      <textarea
        id={id}
        rows={4}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-900 placeholder:text-gray-400"
        placeholder={placeholder}
        required={required}
      ></textarea>
    ) : (
      <input
        id={id}
        type={type}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-900 placeholder:text-gray-400"
        placeholder={placeholder}
        required={required}
      />
    )}
  </div>
);

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => setFormStatus('success'), 1500);
  };

  return (
    <main className="min-h-screen bg-white font-sans text-gray-900">
      <Header />
      
      {/* 1. Hero Section */}
      <section className="relative py-20 lg:py-32 px-4 bg-gray-50 overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 -skew-x-12 translate-x-1/4" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 max-w-xl">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
                Support Center
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                How can we help <span className="text-blue-600">your home</span> today?
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Whether you need an emergency repair or a routine maintenance check, our expert technicians in Jaipur are ready to assist you.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                  Submit Inquiry
                </button>
                <a 
                  href="tel:+918000023359"
                  className="px-8 py-4 bg-white border border-gray-200 hover:border-blue-600 hover:text-blue-600 text-gray-700 rounded-lg font-bold transition-all active:scale-95 flex items-center"
                >
                  <Phone size={18} className="mr-2" />
                  Call Support
                </a>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-blue-600/10 blur-[100px] rounded-full scale-75" />
              <img 
                src="/expert.png" 
                alt="Local Pankaj Support" 
                className="relative z-10 w-full max-w-md mx-auto brightness-95"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Contact Methods Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Multiple Ways to Reach Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto italic">Choose the most convenient method for your request. Our team monitors all channels hourly.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ContactCard 
              icon={Phone}
              title="Call Support"
              description="Speak directly with our dispatch team for urgent appliance repairs and home services."
              link="tel:+918000023359"
              linkText="+91 80000 23359"
            />
            <ContactCard 
              icon={Mail}
              title="Email Inquiry"
              description="For service quotes, partnerships, or detailed technical inquiries, drop us a line."
              link="mailto:support@localpankaj.com"
              linkText="support@localpankaj.com"
            />
            <ContactCard 
              icon={MapPin}
              title="Visit Hub"
              description="Our local headquarters is located in the heart of Jaipur for physical consultations."
              link="https://maps.google.com"
              linkText="Mansarovar, Jaipur"
            />
          </div>
        </div>
      </section>

      {/* 3. Trust / Info Strip (NEW) */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 group">
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Available 7 Days</h4>
                <p className="text-sm text-gray-500">9:00 AM - 9:00 PM Service</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 group">
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <Zap size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Fast Response</h4>
                <p className="text-sm text-gray-500">Confirmed booking in 30 mins</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 group">
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <Map size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Jaipur Coverage</h4>
                <p className="text-sm text-gray-500">All major sectors and colonies</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Inquiry Section (Main Form) */}
      <section id="inquiry-form" className="py-24 lg:py-32 px-4 bg-white scroll-mt-20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-12">
              <div>
                <h2 className="text-4xl font-extrabold text-gray-900 mb-6 uppercase italic tracking-tight">Need a professional repair?</h2>
                <p className="text-gray-600 text-lg leading-relaxed italic">
                  Complete the form and our technical desk will evaluate your requirement and assign the best-suited specialist for your location.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-green-500"><CheckCircle2 size={24} /></div>
                  <div>
                    <h4 className="font-bold text-gray-900">Certified Technicians</h4>
                    <p className="text-gray-500 text-sm">Every engineer is background-verified and expert in their category.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-green-500"><CheckCircle2 size={24} /></div>
                  <div>
                    <h4 className="font-bold text-gray-900">Authentic Spare Parts</h4>
                    <p className="text-gray-500 text-sm">We only use genuine components with manufacturer warranty.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-green-500"><CheckCircle2 size={24} /></div>
                  <div>
                    <h4 className="font-bold text-gray-900">Transparent Pricing</h4>
                    <p className="text-gray-500 text-sm">No hidden charges. Pay only for the service and parts used.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 lg:p-12 rounded-2xl border border-gray-100 shadow-2xl relative">
              {formStatus === 'success' ? (
                <div className="text-center py-12 animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Received!</h3>
                  <p className="text-gray-600">Our team will call you within 30 minutes to confirm your slot.</p>
                  <button 
                    onClick={() => setFormStatus('idle')}
                    className="mt-8 text-blue-600 font-bold hover:underline"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField 
                      label="Full Name" 
                      id="name" 
                      placeholder="e.g. Rahul Sharma" 
                      required 
                    />
                    <InputField 
                      label="Phone Number" 
                      id="phone" 
                      placeholder="e.g. +91 90000 00000" 
                      required 
                      type="tel"
                    />
                  </div>
                  <InputField 
                    label="Service Address" 
                    id="address" 
                    placeholder="Area, Locality, or Landmark in Jaipur" 
                    required 
                  />
                  <InputField 
                    label="Problem Description" 
                    id="message" 
                    placeholder="Please explain the issue (e.g. AC not cooling, Fridge making noise)" 
                    isTextArea
                    required
                  />
                  <button 
                    disabled={formStatus === 'submitting'}
                    className="w-full flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-5 rounded-lg font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                  >
                    {formStatus === 'submitting' ? (
                      <span className="inline-block animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-3" />
                    ) : (
                      <Send size={18} />
                    )}
                    <span>{formStatus === 'submitting' ? 'Processing...' : 'Send Inquiry Now'}</span>
                  </button>
                  <p className="text-center text-[11px] text-gray-400 uppercase tracking-widest font-bold">
                    By submitting, you agree to our Terms of Service
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <Footer />
    </main>
  );
}
