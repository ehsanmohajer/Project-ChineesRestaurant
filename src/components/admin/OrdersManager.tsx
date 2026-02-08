import { useState, useEffect } from 'react';
import { Bell, Check, X, Clock, ChefHat, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderItem } from '@/types/database';
import { toast } from 'sonner';

type OrderWithItems = Order & { order_items: OrderItem[] };

const statusLabels: Record<Order['status'], string> = {
  pending: 'Uusi',
  confirmed: 'Vahvistettu',
  preparing: 'Valmistellaan',
  ready: 'Valmis',
  completed: 'Noudettu',
  cancelled: 'Peruutettu',
};

const statusColors: Record<Order['status'], string> = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-blue-500',
  preparing: 'bg-orange-500',
  ready: 'bg-green-500',
  completed: 'bg-muted',
  cancelled: 'bg-destructive',
};

export function OrdersManager() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      toast.error('Tilausten haku epäonnistui');
      return;
    }

    setOrders(data as OrderWithItems[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchOrders();
          // Play sound for new orders
          const audio = new Audio('/notification.mp3');
          audio.play().catch(() => {});
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) {
      toast.error('Tilan päivitys epäonnistui');
      return;
    }

    toast.success(`Tilaus päivitetty: ${statusLabels[status]}`);
    fetchOrders();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('fi-FI', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const activeOrders = orders.filter(o => !['completed', 'cancelled'].includes(o.status));
  const pastOrders = orders.filter(o => ['completed', 'cancelled'].includes(o.status));

  if (loading) {
    return <p className="text-muted-foreground text-center py-8">Ladataan tilauksia...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Active Orders */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Aktiiviset tilaukset ({activeOrders.length})
        </h2>

        {activeOrders.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Ei aktiivisia tilauksia
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {activeOrders.map(order => (
              <Card key={order.id} className="border-l-4" style={{ borderLeftColor: `var(--${order.status === 'pending' ? 'warning' : 'primary'})` }}>
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </CardTitle>
                      <Badge className={statusColors[order.status]}>
                        {statusLabels[order.status]}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(order.created_at)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Customer Info */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Asiakas: </span>
                      <span className="font-medium">{order.customer_name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Puh: </span>
                      <a href={`tel:${order.customer_phone}`} className="font-medium text-primary">
                        {order.customer_phone}
                      </a>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-muted/50 rounded-lg p-3">
                    <ul className="space-y-1">
                      {order.order_items.map(item => (
                        <li key={item.id} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.item_name}</span>
                          <span className="text-muted-foreground">
                            {(item.unit_price * item.quantity).toFixed(2)}€
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                      <span>Yhteensä</span>
                      <span className="text-primary">{Number(order.total_amount).toFixed(2)}€</span>
                    </div>
                  </div>

                  {order.special_instructions && (
                    <div className="bg-accent/50 rounded-lg p-3 text-sm">
                      <span className="font-medium">Erityistoiveet: </span>
                      {order.special_instructions}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {order.status === 'pending' && (
                      <>
                        <Button size="sm" onClick={() => updateOrderStatus(order.id, 'confirmed')}>
                          <Check className="h-4 w-4 mr-1" />
                          Vahvista
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => updateOrderStatus(order.id, 'cancelled')}>
                          <X className="h-4 w-4 mr-1" />
                          Peruuta
                        </Button>
                      </>
                    )}
                    {order.status === 'confirmed' && (
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, 'preparing')}>
                        <ChefHat className="h-4 w-4 mr-1" />
                        Aloita valmistus
                      </Button>
                    )}
                    {order.status === 'preparing' && (
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, 'ready')}>
                        <Package className="h-4 w-4 mr-1" />
                        Valmis noudettavaksi
                      </Button>
                    )}
                    {order.status === 'ready' && (
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, 'completed')}>
                        <Check className="h-4 w-4 mr-1" />
                        Noudettu
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Past Orders */}
      {pastOrders.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Aiemmat tilaukset
          </h2>
          <div className="grid gap-2">
            {pastOrders.slice(0, 10).map(order => (
              <Card key={order.id} className="bg-muted/30">
                <CardContent className="py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="font-mono">#{order.id.slice(0, 8).toUpperCase()}</span>
                      <Badge variant="outline" className={order.status === 'cancelled' ? 'text-destructive' : ''}>
                        {statusLabels[order.status]}
                      </Badge>
                      <span>{order.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{Number(order.total_amount).toFixed(2)}€</span>
                      <span className="text-muted-foreground">{formatDate(order.created_at)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
