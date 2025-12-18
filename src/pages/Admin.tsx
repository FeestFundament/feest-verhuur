import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Package, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserProfile {
  id: string;
  email: string;
  account_type: 'prive' | 'zakelijk';
  created_at: string;
}

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAndFetchUsers = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      // Check if user is admin
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (!roleData) {
        navigate('/');
        return;
      }

      setIsAdmin(true);

      // Fetch all profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profiles) {
        setUsers(profiles);
      }
      setLoading(false);
    };

    if (!authLoading) {
      checkAdminAndFetchUsers();
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link to="/admin/bestellingen">
            <Card className="hover:border-primary transition-colors cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <Package className="h-10 w-10 text-primary" />
                <div>
                  <h3 className="text-xl font-semibold">Bestellingen</h3>
                  <p className="text-muted-foreground">Bekijk en beheer alle bestellingen</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <Users className="h-10 w-10 text-primary" />
              <div>
                <h3 className="text-xl font-semibold">Gebruikers</h3>
                <p className="text-muted-foreground">{users.length} geregistreerde gebruikers</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Geregistreerde Gebruikers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Account Type</TableHead>
                  <TableHead>Aangemeld op</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((userProfile) => (
                  <TableRow key={userProfile.id}>
                    <TableCell>{userProfile.email}</TableCell>
                    <TableCell>
                      <Badge variant={userProfile.account_type === 'zakelijk' ? 'default' : 'secondary'}>
                        {userProfile.account_type === 'zakelijk' ? 'Zakelijk' : 'Privé'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(userProfile.created_at).toLocaleDateString('nl-NL', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Geen gebruikers gevonden
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
