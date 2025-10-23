import { Building2, Compass, Ruler } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    icon: Building2,
    title: "Construction Works",
    description: "From groundbreaking to completion, we deliver high-quality construction projects on time and within budget. Our experienced team handles residential, commercial, and industrial builds.",
  },
  {
    icon: Compass,
    title: "Architecture Design",
    description: "Innovative architectural solutions that blend aesthetics with functionality. We create spaces that inspire while meeting all regulatory requirements and sustainability goals.",
  },
  {
    icon: Ruler,
    title: "Structural Design",
    description: "Precision-engineered structural solutions ensuring safety, durability, and efficiency. Our expert engineers use cutting-edge technology for optimal structural integrity.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive solutions for all your construction and design needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="border-2 hover:border-primary transition-all duration-300 hover:shadow-lg group"
            >
              <CardHeader>
                <div className="mb-4 inline-flex p-4 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
