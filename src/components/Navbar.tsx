import { Link } from "react-router-dom";
import { ShoppingCart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import logo from "@/assets/logo-primary.png";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();

  return (
    <nav className="bg-primary border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-primary/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Feest-Fundament Logo" className="h-20 w-auto" />
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-secondary hover:text-secondary/80 transition-colors font-medium">
              Home
            </Link>
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-secondary hover:text-secondary/80 bg-transparent hover:bg-transparent data-[state=open]:bg-transparent font-medium">
                    Producten
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-background border border-border shadow-lg z-50">
                    <div className="grid gap-3 p-6 w-[400px] lg:w-[500px]">
                      <div className="grid gap-2 pb-2 border-b">
                        <Link to="/producten/alle" className="font-bold text-base text-secondary hover:text-secondary/80 transition-colors">
                          Alle producten
                        </Link>
                      </div>
                      
                      <div className="grid gap-2">
                        <Link to="/producten?categorie=tafels" className="font-semibold text-sm text-foreground hover:text-secondary transition-colors">
                          Tafels
                        </Link>
                        <Link to="/producten?categorie=alle-tafels" className="text-sm text-muted-foreground hover:text-secondary transition-colors pl-2">
                          Alle tafels
                        </Link>
                      </div>
                      
                      <div className="grid gap-2 pt-2 border-t">
                        <Link to="/producten?categorie=bar" className="font-semibold text-sm text-foreground hover:text-secondary transition-colors">
                          Bar
                        </Link>
                        <Link to="/producten?categorie=ombouw" className="text-sm text-muted-foreground hover:text-secondary transition-colors pl-2">
                          Ombouw
                        </Link>
                        <Link to="/producten?categorie=extra-tafel" className="text-sm text-muted-foreground hover:text-secondary transition-colors pl-2">
                          Extra tafel naast de bar
                        </Link>
                      </div>
                      
                      <div className="grid gap-2 pt-2 border-t">
                        <Link to="/producten?categorie=tenten" className="font-semibold text-sm text-foreground hover:text-secondary transition-colors">
                          Tenten
                        </Link>
                        <Link to="/producten?categorie=alle-tenten" className="text-sm text-muted-foreground hover:text-secondary transition-colors pl-2">
                          Alle tenten
                        </Link>
                      </div>
                      
                      <div className="grid gap-2 pt-2 border-t">
                        <Link to="/producten?categorie=extras" className="font-semibold text-sm text-foreground hover:text-secondary transition-colors">
                          Extra's
                        </Link>
                        <Link to="/producten?categorie=verlichting" className="text-sm text-muted-foreground hover:text-secondary transition-colors pl-2">
                          Verlichting
                        </Link>
                        <Link to="/producten?categorie=verwarming" className="text-sm text-muted-foreground hover:text-secondary transition-colors pl-2">
                          Verwarming
                        </Link>
                        <Link to="/producten?categorie=accessoires" className="text-sm text-muted-foreground hover:text-secondary transition-colors pl-2">
                          Overige accessoires
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <Link to="/specifieke-aanvragen" className="text-secondary hover:text-secondary/80 transition-colors font-medium">
              Specifieke aanvragen
            </Link>
            <Link to="/over-ons" className="text-secondary hover:text-secondary/80 transition-colors font-medium">
              Over ons
            </Link>
            <Link to="/contact" className="text-secondary hover:text-secondary/80 transition-colors font-medium">
              Contact
            </Link>
          </div>

          <Link to="/winkelwagen" className="relative">
            <Button variant="ghost" size="icon" className="text-secondary hover:text-secondary/80">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-secondary text-secondary-foreground"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
