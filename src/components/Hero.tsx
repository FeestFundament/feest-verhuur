import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-party.jpg";

const Hero = () => {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary/90" />
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-bold text-secondary mb-6 drop-shadow-lg">
          Feest-Fundament
        </h1>
        <p className="text-2xl md:text-3xl text-secondary/90 mb-8 font-light">
          Het fundament voor een geslaagd feest!
        </p>
        <Link to="/producten">
          <Button 
            variant="gold" 
            size="xl"
            className="shadow-2xl"
          >
            Bekijk ons assortiment
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
