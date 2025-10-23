import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-construction.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Construction site with architectural blueprints" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Building Tomorrow's
            <span className="block text-primary">Landmarks Today</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-background/90 max-w-2xl font-semibold">
            Expert construction, architecture, and structural design services that transform visions into reality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" variant="hero" className="text-lg group">
              Start Your Project
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="heroOutline" className="text-lg">
              View Portfolio
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-0" />
    </section>
  );
};

export default Hero;
