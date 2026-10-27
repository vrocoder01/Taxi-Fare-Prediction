import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './sections/HeroSection';
import { PredictionSection } from './sections/PredictionSection';
import { ArchitectureSection } from './sections/ArchitectureSection';
import { ModelComparisonSection } from './sections/ModelComparisonSection';
import { StatisticalAnalysisSection } from './sections/StatisticalAnalysisSection';
import { AnalyticsSection } from './sections/AnalyticsSection';
import { HowItWorksSection } from './sections/HowItWorksSection';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'predict', 'architecture', 'comparison', 'insights', 'analytics', 'how-it-works'];
      const scrollPosition = window.scrollY + 250;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-charcoal-950 text-white selection:bg-taxi-yellow selection:text-charcoal-950 relative">
      <Navbar onNavigate={handleNavigate} activeSection={activeSection} />

      <main>
        <HeroSection onExplore={() => handleNavigate('predict')} />
        <PredictionSection />
        <ArchitectureSection />
        <ModelComparisonSection onNavigateToAnalytics={() => handleNavigate('insights')} />
        <StatisticalAnalysisSection />
        <AnalyticsSection />
        <HowItWorksSection />
      </main>

      <Footer />
    </div>
  );
};

export default App;
