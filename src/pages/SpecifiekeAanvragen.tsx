import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SpecialRequests from "@/components/SpecialRequests";

const SpecifiekeAanvragen = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <SpecialRequests />
      </main>
      
      <Footer />
    </div>
  );
};

export default SpecifiekeAanvragen;
