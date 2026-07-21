import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <>
      <CanvasBackground />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <AnimatedPage>
                    <HomePage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/research"
                element={
                  <AnimatedPage>
                    <ResearchPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/projects"
                element={
                  <AnimatedPage>
                    <ProjectsPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/blog"
                element={
                  <AnimatedPage>
                    <BlogPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/about"
                element={
                  <AnimatedPage>
                    <AboutPage />
                  </AnimatedPage>
                }
              />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
        <FloatingWidget />
      </div>
    </>
  );
}
