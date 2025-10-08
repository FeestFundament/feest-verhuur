import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-secondary font-bold text-xl mb-4">Feest-Fundament</h3>
            <p className="text-muted-foreground">
              Uw partner voor professionele feestartikelen verhuur.
            </p>
          </div>
          
          <div>
            <h4 className="text-secondary font-semibold mb-4">Navigatie</h4>
            <div className="flex flex-col space-y-2">
              <Link to="/" className="text-secondary hover:text-secondary/80 transition-colors">
                Home
              </Link>
              <Link to="/producten" className="text-secondary hover:text-secondary/80 transition-colors">
                Producten
              </Link>
              <Link to="/specifieke-aanvragen" className="text-secondary hover:text-secondary/80 transition-colors">
                Specifieke aanvragen
              </Link>
              <Link to="/over-ons" className="text-secondary hover:text-secondary/80 transition-colors">
                Over ons
              </Link>
              <Link to="/contact" className="text-secondary hover:text-secondary/80 transition-colors">
                Contact
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-secondary font-semibold mb-4">Volg ons</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-secondary hover:text-secondary/80 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-secondary hover:text-secondary/80 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-secondary hover:text-secondary/80 transition-colors">
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Feest-Fundament. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
