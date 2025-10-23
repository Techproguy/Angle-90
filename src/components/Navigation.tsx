import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="text-2xl font-bold text-primary">BuildCraft</div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection("services")}
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection("about")}
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection("projects")}
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              Projects
            </button>
            <Button onClick={() => scrollToSection("contact")}>
              Contact Us
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setIsOpen(false);
                }}
                className="text-left text-foreground/80 hover:text-primary transition-colors font-medium"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection("services")}
                className="text-left text-foreground/80 hover:text-primary transition-colors font-medium"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection("about")}
                className="text-left text-foreground/80 hover:text-primary transition-colors font-medium"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection("projects")}
                className="text-left text-foreground/80 hover:text-primary transition-colors font-medium"
              >
                Projects
              </button>
              <Button onClick={() => scrollToSection("contact")} className="w-full">
                Contact Us
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
