import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, Phone, MapPin, Home } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBusinessSettings } from '@/hooks/useBusinessData';

export default function OrderConfirmation() {
  const location = useLocation();
  const { data: settings } = useBusinessSettings();
  const orderId = location.state?.orderId;

  if (!orderId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="container mx-auto px-4 max-w-lg">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl">感谢您的订单！</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                您的订单已收到，我们正在为您准备。
                订单完成后我们会致电通知您取餐。
              </p>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">订单号</p>
                <p className="font-mono text-lg font-bold text-foreground">
                  {orderId.slice(0, 8).toUpperCase()}
                </p>
              </div>

              <div className="space-y-3 text-left">
                <h3 className="font-semibold text-foreground">取餐地址</h3>
                {settings?.address && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{settings.address}</span>
                  </div>
                )}
                {settings?.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-5 w-5 text-primary shrink-0" />
                    <a href={`tel:${settings.phone}`} className="hover:text-primary">
                      {settings.phone}
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-4 space-y-3">
                {settings?.phone && (
                  <a href={`tel:${settings.phone}`} className="block">
                    <Button variant="outline" className="w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      致电餐厅
                    </Button>
                  </a>
                )}
                <Link to="/" className="block">
                  <Button className="w-full">
                    <Home className="h-4 w-4 mr-2" />
                    返回首页
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
