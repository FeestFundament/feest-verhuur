import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import SpecialRequests from "@/components/SpecialRequests";
import Footer from "@/components/Footer";
import { products } from "@/lib/products";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-party.jpg";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      
      <main className="flex-1 container mx-auto px-4 py-16">
        <section>
          <h2 className="text-4xl font-bold text-secondary mb-8 text-center">
            Onze populairste producten
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {products
              .filter(p => ['1', '2', '3', '5'].includes(p.id))
              .map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                />
              ))}
          </div>

          <div className="text-center py-12 border-t border-border">
            <h3 className="text-2xl font-semibold text-secondary mb-6">
              Meer producten bekijken
            </h3>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Link to="/producten?categorie=tafels">
                <Button variant="goldOutline">Tafels</Button>
              </Link>
              <Link to="/producten?categorie=bar">
                <Button variant="goldOutline">Bars</Button>
              </Link>
              <Link to="/producten?categorie=tenten">
                <Button variant="goldOutline">Tenten</Button>
              </Link>
              <Link to="/producten?categorie=extras">
                <Button variant="goldOutline">Extra's</Button>
              </Link>
            </div>
            <Link to="/producten/alle">
              <Button variant="gold" size="lg">Bekijk alle producten</Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Hero afbeelding sectie onderaan */}
      <section className="relative py-4 bg-background">
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
      </section>
      
      <SpecialRequests />
      
      <Footer />
    </div>
  );
};

export default Index;
