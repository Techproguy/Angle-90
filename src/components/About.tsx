import { Award, Users, Target } from "lucide-react";

const stats = [
  { icon: Award, value: "25+", label: "Years Experience" },
  { icon: Users, value: "500+", label: "Projects Completed" },
  { icon: Target, value: "100%", label: "Client Satisfaction" },
];

const About = () => {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Building Excellence Since 1998
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              At BuildCraft, we combine decades of construction expertise with innovative architectural design and structural engineering excellence. Our commitment to quality, safety, and client satisfaction has made us a trusted name in the industry.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              From concept to completion, our integrated approach ensures seamless project delivery. We work closely with clients to understand their vision and bring it to life with precision and care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-6 rounded-lg bg-muted/50 border-2 border-transparent hover:border-primary transition-all"
              >
                <div className="p-3 rounded-lg bg-primary/10">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
