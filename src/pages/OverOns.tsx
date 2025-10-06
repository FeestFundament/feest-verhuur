import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const OverOns = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-secondary mb-4 text-center">
          Over ons
        </h1>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto text-lg">
          Het fundament voor een geslaagd feest sinds 2010
        </p>
        
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-secondary mb-4">Wie zijn wij?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Feest-Fundament is uw betrouwbare partner voor de verhuur van professionele feestartikelen. 
                Met jarenlange ervaring in de eventsector bieden wij een breed assortiment aan hoogwaardige 
                producten voor elk type evenement.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Of u nu een intiem familiefeest, een groots bedrijfsevenement of een bruisend festival 
                organiseert, wij zorgen ervoor dat u beschikt over de juiste materialen om uw evenement 
                tot een succes te maken.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-secondary mb-6">Waarom Feest-Fundament?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Hoogwaardige professionele apparatuur",
                  "Flexibele verhuurperiodes",
                  "Scherpe prijzen zonder verborgen kosten",
                  "Snelle levering en ophaalservice",
                  "Persoonlijk advies en begeleiding",
                  "Ruim assortiment voor elk evenement"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-secondary mb-4">Ons aanbod</h2>
              <p className="text-muted-foreground leading-relaxed">
                Ons uitgebreide assortiment omvat onder andere statafels, biertafels, bars, verlichting, 
                partytenten, geluidsapparatuur en nog veel meer. Al onze producten worden regelmatig 
                onderhouden en gecontroleerd om de hoogste kwaliteit te garanderen.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OverOns;
