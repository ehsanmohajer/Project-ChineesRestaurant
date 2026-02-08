import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, ShoppingBag, UtensilsCrossed, Clock, Tag, Star, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { OrdersManager } from '@/components/admin/OrdersManager';
import { MenuManager } from '@/components/admin/MenuManager';
import { HoursManager } from '@/components/admin/HoursManager';
import { DealsManager } from '@/components/admin/DealsManager';
import { ReviewsManager } from '@/components/admin/ReviewsManager';
import { SettingsManager } from '@/components/admin/SettingsManager';
import { toast } from 'sonner';

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Uloskirjautuminen epäonnistui');
    } else {
      navigate('/admin/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Ladataan...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">🍕 Saaren Pizza - Ylläpito</h1>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Kirjaudu ulos
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-2 h-auto mb-6">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Tilaukset</span>
            </TabsTrigger>
            <TabsTrigger value="menu" className="flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              <span className="hidden sm:inline">Menu</span>
            </TabsTrigger>
            <TabsTrigger value="hours" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Aukioloajat</span>
            </TabsTrigger>
            <TabsTrigger value="deals" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span className="hidden sm:inline">Tarjoukset</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Arvostelut</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Asetukset</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <OrdersManager />
          </TabsContent>
          <TabsContent value="menu">
            <MenuManager />
          </TabsContent>
          <TabsContent value="hours">
            <HoursManager />
          </TabsContent>
          <TabsContent value="deals">
            <DealsManager />
          </TabsContent>
          <TabsContent value="reviews">
            <ReviewsManager />
          </TabsContent>
          <TabsContent value="settings">
            <SettingsManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
