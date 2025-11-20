import logo from "@/assets/logo-primary.png";

const Hero = () => {
  return (
    <section className="bg-background py-4">
      <div className="container mx-auto px-4 text-center animate-fade-in">
        <img 
          src={logo} 
          alt="Feest-Fundament - Het fundament voor een geslaagd feest" 
          className="w-full max-w-xl mx-auto drop-shadow-2xl"
        />
      </div>
    </section>
  );
};

export default Hero;
