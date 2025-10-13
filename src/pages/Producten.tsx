import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { products } from "@/lib/products";

const Producten = () => {
  const [searchParams] = useSearchParams();
  const categorie = searchParams.get('categorie');
  
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
          return categoryLower === 'verlichting' || categoryLower === 'verwarming' || categoryLower === 'accessoires' || categoryLower === 'dranken';
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
      </main>
      
      <Footer />
    </div>
  );
};

export default Producten;
