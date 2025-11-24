import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { z } from "zod";

const emailSchema = z.string().trim().email({ message: "Ongeldig e-mailadres" });
const passwordSchema = z.string().min(6, { message: "Wachtwoord moet minimaal 6 tekens bevatten" });

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<"prive" | "zakelijk">("prive");
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    const emailValidation = emailSchema.safeParse(email);
    const passwordValidation = passwordSchema.safeParse(password);

    if (!emailValidation.success) {
      toast({
        title: "Fout",
        description: emailValidation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    if (!passwordValidation.success) {
      toast({
        title: "Fout",
        description: passwordValidation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Inloggen mislukt",
              description: "E-mail of wachtwoord is onjuist",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Fout",
              description: error.message,
              variant: "destructive",
            });
          }
          return;
        }
        
        toast({
          title: "Welkom terug!",
          description: "U bent succesvol ingelogd",
        });
        navigate("/");
      } else {
        const { error } = await signUp(email, password, accountType);
        
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Account bestaat al",
              description: "Dit e-mailadres is al geregistreerd. Probeer in te loggen.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Fout",
              description: error.message,
              variant: "destructive",
            });
          }
          return;
        }
        
        toast({
          title: "Account aangemaakt!",
          description: "U bent succesvol geregistreerd en ingelogd",
        });
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {isLogin ? "Inloggen" : "Registreren"}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin 
                ? "Log in met uw e-mailadres" 
                : "Maak een account aan om te beginnen"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={isLogin ? "login" : "signup"} onValueChange={(v) => setIsLogin(v === "login")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Inloggen</TabsTrigger>
                <TabsTrigger value="signup">Registreren</TabsTrigger>
              </TabsList>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mailadres</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="naam@voorbeeld.nl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Wachtwoord</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {!isLogin && (
                  <div className="space-y-3">
                    <Label>Account type</Label>
                    <RadioGroup value={accountType} onValueChange={(v) => setAccountType(v as "prive" | "zakelijk")}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="prive" id="prive" />
                        <Label htmlFor="prive" className="font-normal cursor-pointer">
                          Privé account
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="zakelijk" id="zakelijk" />
                        <Label htmlFor="zakelijk" className="font-normal cursor-pointer">
                          Zakelijk account
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading} variant="gold">
                  {loading ? "Bezig..." : isLogin ? "Inloggen" : "Registreren"}
                </Button>
              </form>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Auth;
