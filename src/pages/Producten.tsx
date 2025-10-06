import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { products } from "@/lib/products";

const Producten = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-secondary mb-4 text-center">
          Onze producten
        </h1>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Bekijk ons complete assortiment aan professionele feestartikelen. 
          Selecteer uw verhuurperiode en voeg producten toe aan uw winkelwagen.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
            />
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Producten;
