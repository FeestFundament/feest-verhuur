import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-party.jpg";
import logo from "@/assets/logo-primary.png";

const Hero = () => {
  return (
    <section className="h-screen flex flex-col bg-background">
      {/* Logo sectie */}
      <div className="py-4">
        <div className="container mx-auto px-4 text-center animate-fade-in">
          <img 
            src={logo} 
            alt="Feest-Fundament - Het fundament voor een geslaagd feest" 
            className="w-full max-w-xl mx-auto drop-shadow-2xl"
          />
        </div>
      </div>
      
      {/* Spacer om de balk naar beneden te duwen */}
      <div className="flex-1" />
      
      {/* Hero afbeelding sectie onderaan */}
      <div className="relative py-4">
        <div className="w-full">
          <div className="relative h-[150px] w-full flex items-center justify-center overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/30" />
            
            <div className="relative z-10 text-center px-4 animate-fade-in">
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
