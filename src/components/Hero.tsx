import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-party.jpg";
import logo from "@/assets/logo-primary.png";
import { useAuth } from "@/contexts/AuthContext";

const Hero = () => {
  const { profile } = useAuth();
  
  const tagline = profile?.account_type === 'zakelijk' 
    ? 'Uw partner voor professionele feestartikelen'
    : 'Uw verhuurder voor professionele feestartikelen';
  
  return (
    <section className="h-screen max-h-screen flex flex-col bg-background overflow-hidden pb-16 md:pb-24">
      {/* Logo sectie */}
      <div className="py-4 md:py-8">
        <div className="container mx-auto px-4 text-center animate-fade-in">
          <img 
            src={logo} 
            alt="Feest-Fundament - Het fundament voor een geslaagd feest" 
            className="w-full max-w-[250px] md:max-w-xl mx-auto drop-shadow-2xl"
          />
        </div>
      </div>
      
      {/* Spacer om de balk naar beneden te duwen */}
      <div className="flex-1" />
      
      {/* Hero afbeelding balk onderaan viewport */}
      <div className="w-full">
        <div className="container mx-auto px-4">
          <div className="relative h-[100px] md:h-[150px] w-full flex items-center justify-center overflow-hidden rounded-lg">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/30" />
            
            <div className="relative z-10 flex flex-col items-center justify-center gap-3 px-4 animate-fade-in">
              <p className="text-foreground/90 text-xs md:text-sm font-medium tracking-wide">
                {tagline}
              </p>
              <Link to="/producten">
                <Button 
                  variant="gold" 
                  size="xl"
                  className="shadow-2xl text-sm md:text-base"
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
