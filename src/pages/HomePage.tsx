import HeroSection from "../components/sections/HeroSection";
import ResearchSection from "../components/sections/ResearchSection";
import ProjectsSection from "../components/sections/ProjectsSection";
import BlogSection from "../components/sections/BlogSection";
import AboutSection from "../components/sections/AboutSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ResearchSection />
      <ProjectsSection />
      <BlogSection />
      <AboutSection />
    </>
  );
}
