import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'contact',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message
        }
      });

      if (error) throw error;

      toast.success("Bedankt voor uw bericht! We nemen zo snel mogelijk contact met u op.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error("Er is iets misgegaan. Probeer het later opnieuw.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-secondary mb-4 text-center">
          Contact
        </h1>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto text-lg">
          Heeft u vragen of wilt u een vrijblijvende offerte? Neem gerust contact met ons op!
        </p>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-secondary mb-6">Stuur ons een bericht</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-secondary">Naam *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2 bg-background border-border"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-secondary">E-mailadres *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-2 bg-background border-border"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-secondary">Telefoonnummer</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-2 bg-background border-border"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message" className="text-secondary">Bericht *</Label>
                  <Textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="mt-2 bg-background border-border"
                  />
                </div>
                
                <Button type="submit" variant="gold" className="w-full" size="lg">
                  Verstuur bericht
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-secondary mb-6">Contactgegevens</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-secondary">E-mail</p>
                      <a href="mailto:info@feest-fundament.nl" className="text-muted-foreground hover:text-secondary transition-colors">
                        info@feest-fundament.nl
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-secondary">Telefoon</p>
                      <a href="tel:+31612345678" className="text-muted-foreground hover:text-secondary transition-colors">
                        +31 6 12 34 56 78
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-secondary">Adres</p>
                      <p className="text-muted-foreground">
                        Voorbeeldstraat 123<br />
                        1234 AB Amsterdam
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-secondary mb-4">Openingstijden</h2>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Maandag - Vrijdag</span>
                    <span className="font-semibold">09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Zaterdag</span>
                    <span className="font-semibold">10:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Zondag</span>
                    <span className="font-semibold">Gesloten</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
