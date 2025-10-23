import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

const projects = [
  {
    image: project1,
    title: "Modern Commercial Complex",
    category: "Architecture & Construction",
    description: "A state-of-the-art commercial building featuring sustainable design and innovative structural solutions.",
  },
  {
    image: project2,
    title: "Luxury Residential Development",
    category: "Construction & Design",
    description: "High-end residential construction with custom architectural elements and premium finishes.",
  },
  {
    image: project3,
    title: "Structural Engineering Excellence",
    category: "Structural Design",
    description: "Complex structural design project showcasing our engineering expertise and attention to detail.",
  },
];

const Projects = () => {
  return (
    <section id="projects" className="py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Projects</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our portfolio of successful construction and design projects
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/70 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-background">
                <div className="text-sm font-semibold text-primary mb-2">
                  {project.category}
                </div>
                <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                <p className="text-background/90 line-clamp-2">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
