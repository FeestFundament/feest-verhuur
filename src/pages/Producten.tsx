import { useSearchParams, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/products";

const Producten = () => {
  const [searchParams] = useSearchParams();
  const categorie = searchParams.get('categorie');
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categorie]);
  
  // Filter products based on category
  const filteredProducts = categorie 
    ? products.filter(product => {
        const categoryLower = product.category.toLowerCase();
        
        // Map URL categories to product categories
        if (categorie === 'tafels' || categorie === 'alle-tafels') {
          return categoryLower === 'tafels';
        }
        if (categorie === 'bar' || categorie === 'ombouw' || categorie === 'extra-tafel') {
          return categoryLower === 'bars';
        }
        if (categorie === 'tenten' || categorie === 'alle-tenten') {
          return categoryLower === 'tenten';
        }
        if (categorie === 'extras' || categorie === 'verlichting' || categorie === 'verwarming' || categorie === 'accessoires') {
          return categoryLower === 'verlichting' || categoryLower === 'verwarming' || categoryLower === 'accessoires' || categoryLower === 'dranken' || categoryLower === 'diensten';
        }
        
        return false;
      })
    : products;
  
  // Get category title
  const getCategoryTitle = () => {
    if (!categorie) return "Onze producten";
    
    const titles: { [key: string]: string } = {
      'tafels': 'Tafels',
      'alle-tafels': 'Alle tafels',
      'bar': 'Bar',
      'ombouw': 'Ombouw',
      'extra-tafel': 'Extra tafel naast de bar',
      'tenten': 'Tenten',
      'alle-tenten': 'Alle tenten',
      'extras': "Extra's",
      'verlichting': 'Verlichting',
      'verwarming': 'Verwarming',
      'accessoires': 'Overige accessoires'
    };
    
    return titles[categorie] || "Onze producten";
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-secondary mb-4 text-center">
          {getCategoryTitle()}
        </h1>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          {categorie 
            ? `Bekijk ons assortiment ${getCategoryTitle().toLowerCase()}. Selecteer uw verhuurperiode en voeg producten toe aan uw winkelwagen.`
            : 'Bekijk ons complete assortiment aan professionele feestartikelen. Selecteer uw verhuurperiode en voeg producten toe aan uw winkelwagen.'
          }
        </p>
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Er zijn momenteel geen producten beschikbaar in deze categorie.
            </p>
          </div>
        )}

        <div className="text-center py-12 border-t border-border mt-12">
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
      </main>
      
      <Footer />
    </div>
  );
};

export default Producten;
