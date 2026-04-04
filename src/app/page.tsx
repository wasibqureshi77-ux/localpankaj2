"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeadPopup from "@/components/LeadPopup";

// Modular Section Components
import HeroSlider from "@/components/home/HeroSlider";
import ApplianceGrid from "@/components/home/ApplianceGrid";
import HomeRepairGrid from "@/components/home/HomeRepairGrid";
import AboutSection from "@/components/home/AboutSection";
import StatsBanner from "@/components/home/StatsBanner";
import HomeTestimonials from "@/components/home/HomeTestimonials";

const HomePage = () => {
  const [services, setServices] = useState<any[]>([]);
  const [siteConfig, setSiteConfig] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 1. Data Fetching
    const fetchData = async () => {
      try {
        const [servicesRes, configRes] = await Promise.all([
          axios.get("/api/services"),
          axios.get("/api/site-config")
        ]);
        setServices(servicesRes.data || []);
        setSiteConfig(configRes.data || null);
      } catch (err) {
        console.error("Home data fetch error:", err);
      }
    };
    fetchData();

    // 2. Responsive Check
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Filter Services by Category
  const applianceServices = services.filter(s => s.category === "APPLIANCE");
  const homeServices = services.filter(s => s.category === "HOME");

  return (
    <main className="min-h-screen relative font-sans text-gray-900 bg-white">
      <Header />
      <LeadPopup />

      {/* 1. Hero Dynamic Slider */}
      <HeroSlider isMobile={isMobile} />

      {/* 2. Appliance Repair Grid (Expert Solutions) */}
      <ApplianceGrid services={applianceServices} />

      {/* 3. Home Repair Secondary Section (Primary Blue) */}
      <HomeRepairGrid services={homeServices} />

      {/* 4. The Advantage Section (Why Jaipur Trusts Us) */}
      <AboutSection config={siteConfig} />

      {/* 5. Production Precision Banner (Full-Width Stats) */}
      <StatsBanner />

      {/* 6. Social Proof / Testimonials (Feedback Registry) */}
      <HomeTestimonials />

      <Footer />
    </main>
  );
};

export default HomePage;
