import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Eye, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  customer_phone: string;
  customer_address: string;
  subtotal: number;
  travel_cost: number;
  total: number;
  status: string;
  created_at: string;
}

const AdminBestellingen = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      if (authLoading) return;
      
      if (!user) {
        navigate("/auth");
        return;
      }

      // Check if user is admin
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        navigate("/");
        return;
      }

      setIsAdmin(true);
      fetchOrders();
    };

    checkAdminAndFetch();
  }, [user, authLoading, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const fetchOrderItems = async (orderId: string) => {
    const { data } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);
    
    setOrderItems(data || []);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      toast({
        title: "Fout",
        description: "Kon status niet bijwerken",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Status bijgewerkt",
        description: `Bestelling is nu ${newStatus}`,
      });
      fetchOrders();
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      paid: "default",
      confirmed: "default",
      delivered: "default",
      cancelled: "destructive",
    };
    const labels: Record<string, string> = {
      pending: "In afwachting",
      paid: "Betaald",
      confirmed: "Bevestigd",
      delivered: "Geleverd",
      cancelled: "Geannuleerd",
    };
    return <Badge variant={variants[status] || "outline"}>{labels[status] || status}</Badge>;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Bestellingen beheren</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/admin")}>
            Terug naar Admin
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Alle bestellingen ({orders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                Nog geen bestellingen ontvangen.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Datum</TableHead>
                    <TableHead>Klant</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Telefoon</TableHead>
                    <TableHead>Totaal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        {new Date(order.created_at).toLocaleDateString('nl-NL')}
                      </TableCell>
                      <TableCell className="font-medium">{order.customer_name}</TableCell>
                      <TableCell>{order.customer_email}</TableCell>
                      <TableCell>{order.customer_phone}</TableCell>
                      <TableCell>€{Number(order.total).toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  fetchOrderItems(order.id);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Bestellingsdetails</DialogTitle>
                              </DialogHeader>
                              {selectedOrder && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-muted-foreground">Klant</p>
                                      <p className="font-medium">{selectedOrder.customer_name}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">E-mail</p>
                                      <p className="font-medium">{selectedOrder.customer_email}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Telefoon</p>
                                      <p className="font-medium">{selectedOrder.customer_phone}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Bezorgadres</p>
                                      <p className="font-medium">{selectedOrder.customer_address}</p>
                                    </div>
                                  </div>

                                  <div className="border-t pt-4">
                                    <h4 className="font-medium mb-2">Items</h4>
                                    {orderItems.map((item) => (
                                      <div key={item.id} className="flex justify-between py-2 border-b last:border-0">
                                        <div>
                                          <p className="font-medium">
                                            {item.product_name}
                                            {item.color && ` (${item.color})`}
                                          </p>
                                          <p className="text-sm text-muted-foreground">
                                            {item.quantity}x • {new Date(item.start_date).toLocaleDateString('nl-NL')} - {new Date(item.end_date).toLocaleDateString('nl-NL')}
                                          </p>
                                        </div>
                                        <p className="font-medium">€{Number(item.item_total).toFixed(2)}</p>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="border-t pt-4 space-y-1">
                                    <div className="flex justify-between">
                                      <span>Subtotaal</span>
                                      <span>€{Number(selectedOrder.subtotal).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Bezorgkosten</span>
                                      <span>€{Number(selectedOrder.travel_cost).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold">
                                      <span>Totaal</span>
                                      <span>€{Number(selectedOrder.total).toFixed(2)}</span>
                                    </div>
                                  </div>

                                  <div className="border-t pt-4">
                                    <p className="text-sm text-muted-foreground mb-2">Status wijzigen:</p>
                                    <Select
                                      value={selectedOrder.status}
                                      onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">In afwachting</SelectItem>
                                        <SelectItem value="paid">Betaald</SelectItem>
                                        <SelectItem value="confirmed">Bevestigd</SelectItem>
                                        <SelectItem value="delivered">Geleverd</SelectItem>
                                        <SelectItem value="cancelled">Geannuleerd</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default AdminBestellingen;
