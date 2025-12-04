import { Link } from "react-router-dom";
import { ShoppingCart, ChevronDown, Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo-primary.png";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";


const Navbar = () => {
  const { getCartItemCount } = useCart();
  const { user, signOut } = useAuth();
  const cartItemCount = getCartItemCount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-primary border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-primary/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Feest-Fundament Logo" className="h-16 md:h-20 w-auto" />
          </Link>
          
          {/* Desktop menu */}
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
                    <div className="grid gap-3 p-6 w-[300px]">
                      <div className="grid gap-2 pb-2 border-b">
                        <Link to="/producten/alle" className="font-bold text-base text-secondary hover:text-secondary/80 transition-colors">
                          Alle producten
                        </Link>
                      </div>
                      
                      <div className="grid gap-2">
                        <Link to="/producten?categorie=tafels" className="font-semibold text-sm text-foreground hover:text-secondary transition-colors">
                          Tafels
                        </Link>
                      </div>
                      
                      <div className="grid gap-2 pt-2 border-t">
                        <Link to="/producten?categorie=tenten" className="font-semibold text-sm text-foreground hover:text-secondary transition-colors">
                          Tenten
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
          
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => signOut()}
                  className="text-secondary hover:text-secondary/80"
                  title="Uitloggen"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Link to="/auth" className="hidden md:block">
                <Button variant="ghost" size="sm" className="text-secondary hover:text-secondary/80">
                  <User className="h-4 w-4 mr-2" />
                  Inloggen
                </Button>
              </Link>
            )}
            
            <Link to="/winkelwagen">
              <Button variant="ghost" size="icon" className="relative text-secondary hover:text-secondary/80">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-secondary">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-background">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link 
                    to="/" 
                    className="text-lg font-medium text-secondary hover:text-secondary/80 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  
                  <div className="flex flex-col gap-2">
                    <span className="text-lg font-semibold text-secondary">Producten</span>
                    <Link 
                      to="/producten/alle" 
                      className="text-base text-foreground hover:text-secondary transition-colors pl-4"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Alle producten
                    </Link>
                    
                    <div className="flex flex-col gap-2 pl-4">
                      <Link 
                        to="/producten?categorie=tafels" 
                        className="text-base text-muted-foreground hover:text-secondary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Tafels
                      </Link>
                      <Link 
                        to="/producten?categorie=tenten" 
                        className="text-base text-muted-foreground hover:text-secondary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Tenten
                      </Link>
                    </div>
                  </div>
                  
                  <Link 
                    to="/specifieke-aanvragen" 
                    className="text-lg font-medium text-secondary hover:text-secondary/80 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Specifieke aanvragen
                  </Link>
                  
                  <Link 
                    to="/over-ons" 
                    className="text-lg font-medium text-secondary hover:text-secondary/80 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Over ons
                  </Link>
                  
                  <Link 
                    to="/contact" 
                    className="text-lg font-medium text-secondary hover:text-secondary/80 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  
                  {user ? (
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="text-lg font-medium text-secondary hover:text-secondary/80 justify-start px-0"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Uitloggen
                    </Button>
                  ) : (
                    <Link 
                      to="/auth" 
                      className="text-lg font-medium text-secondary hover:text-secondary/80 transition-colors flex items-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5 mr-2" />
                      Inloggen
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
