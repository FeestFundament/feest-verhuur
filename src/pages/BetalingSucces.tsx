import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Home, ShoppingBag } from "lucide-react";

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  start_date: string;
  end_date: string;
  item_total: number;
  color?: string;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  total: number;
  created_at: string;
}

const BetalingSucces = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("order");
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .maybeSingle();

      if (orderData) {
        setOrder(orderData);

        const { data: itemsData } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", orderId);

        if (itemsData) {
          setItems(itemsData);
        }
      }
    };

    fetchOrder();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="mx-auto h-20 w-20 text-green-500 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Betaling geslaagd!</h1>
          <p className="text-muted-foreground mb-8">
            Bedankt voor je bestelling. Je ontvangt een bevestiging per e-mail.
          </p>

          {order && (
            <Card className="text-left mb-8">
              <CardHeader>
                <CardTitle>Bestellingsdetails</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Bestelnummer:</span>
                    <p className="font-mono">{order.id.slice(0, 8)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Datum:</span>
                    <p>{new Date(order.created_at).toLocaleDateString('nl-NL')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Naam:</span>
                    <p>{order.customer_name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">E-mail:</span>
                    <p>{order.customer_email}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Gehuurde items:</h4>
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">
                          {item.product_name}
                          {item.color && <span className="text-muted-foreground"> ({item.color})</span>}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity}x • {new Date(item.start_date).toLocaleDateString('nl-NL')} - {new Date(item.end_date).toLocaleDateString('nl-NL')}
                        </p>
                      </div>
                      <p className="font-medium">€{Number(item.item_total).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Totaal betaald</span>
                  <span>€{Number(order.total).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate("/")} variant="outline">
              <Home className="mr-2 h-4 w-4" />
              Naar homepage
            </Button>
            <Button onClick={() => navigate("/producten")}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Verder winkelen
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BetalingSucces;
