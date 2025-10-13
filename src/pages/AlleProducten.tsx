import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { products } from "@/lib/products";

const AlleProducten = () => {
  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, typeof products>);

  // Category display names
  const categoryNames: Record<string, string> = {
    'Tafels': 'Tafels',
    'Bars': 'Bars',
    'Tenten': 'Tenten',
    'Verlichting': 'Verlichting',
    'Dranken': 'Dranken'
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-secondary mb-4 text-center">
          Alle producten
        </h1>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Bekijk ons complete assortiment aan professionele feestartikelen. Selecteer uw verhuurperiode en voeg producten toe aan uw winkelwagen.
        </p>
        
        {Object.entries(groupedProducts).map(([category, categoryProducts], index) => (
          <section key={category} className={index > 0 ? "mt-16" : ""}>
            <h2 className="text-3xl font-bold text-secondary mb-8 pb-4 border-b border-border">
              {categoryNames[category] || category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                />
              ))}
            </div>
          </section>
        ))}
      </main>
      
      <Footer />
    </div>
  );
};

export default AlleProducten;
