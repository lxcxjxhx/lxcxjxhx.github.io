import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import CanvasBackground from "./components/effects/CanvasBackground";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import FloatingWidget from "./components/ui/FloatingWidget";
import HomePage from "./pages/HomePage";
import ResearchPage from "./pages/ResearchPage";
import ProjectsPage from "./pages/ProjectsPage";
import BlogPage from "./pages/BlogPage";
import AboutPage from "./pages/AboutPage";

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return <div className="page-transition">{children}</div>;
}

export default function App() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage("fadeOut");
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage("fadeIn");
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [location, displayLocation]);

  return (
    <>
      <CanvasBackground />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-16">
          <div
            className={`transition-all duration-300 ${
              transitionStage === "fadeIn"
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 -translate-y-5 scale-[0.98]"
            }`}
            key={displayLocation.pathname}
          >
            <AnimatedPage>
              <Routes location={displayLocation}>
                <Route path="/" element={<HomePage />} />
                <Route path="/research" element={<ResearchPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </AnimatedPage>
          </div>
        </main>
        <Footer />
        <FloatingWidget />
      </div>
    </>
  );
}
