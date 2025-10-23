const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-4">BuildCraft</h3>
            <p className="text-background/80">
              Building excellence through innovation, integrity, and expert craftsmanship.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-background/80">
              <li>Construction Works</li>
              <li>Architecture Design</li>
              <li>Structural Design</li>
              <li>Project Management</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-background/80">
              <li>About Us</li>
              <li>Our Team</li>
              <li>Careers</li>
              <li>News & Updates</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-background/80">
              <li>+1 (555) 123-4567</li>
              <li>info@buildcraft.com</li>
              <li>123 Construction Ave</li>
              <li>New York, NY 10001</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 text-center text-background/70">
          <p>&copy; {currentYear} BuildCraft Construction. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
