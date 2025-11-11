import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SpecialRequests = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast.error("Vul alle verplichte velden in");
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'quote',
          name,
          email,
          phone,
          message
        }
      });

      if (error) throw error;

      toast.success("Uw offerte aanvraag is verstuurd! We nemen zo snel mogelijk contact met u op.");
      
      // Reset formulier
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error("Er is iets misgegaan. Probeer het later opnieuw.");
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-secondary mb-4">
            Specifieke aanvragen
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Heeft u specifieke aanvragen of zoekt u iets dat niet in ons assortiment staat? 
            Vraag vrijblijvend een offerte aan en wij denken graag met u mee!
          </p>
        </div>

        <Card className="max-w-2xl mx-auto bg-card border-border">
          <CardHeader>
            <CardTitle className="text-secondary flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Vraag een offerte aan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-secondary">
                  Naam *
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Uw naam"
                  className="bg-background border-border"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-secondary">
                  E-mailadres *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="uw@email.nl"
                  className="bg-background border-border"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-secondary">
                  Telefoonnummer
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06 12345678"
                  className="bg-background border-border"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-secondary">
                  Uw aanvraag *
                </Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Beschrijf hier uw specifieke aanvraag..."
                  className="bg-background border-border min-h-[120px]"
                  required
                />
              </div>

              <Button type="submit" variant="gold" className="w-full" size="lg">
                Verstuur aanvraag
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SpecialRequests;
