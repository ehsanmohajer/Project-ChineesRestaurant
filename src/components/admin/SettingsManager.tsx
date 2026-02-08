import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useBusinessSettings } from '@/hooks/useBusinessData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export function SettingsManager() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useBusinessSettings();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    tagline: '',
    description: '',
    google_reviews_url: '',
    google_rating: '',
    google_review_count: '',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        name: settings.name || '',
        phone: settings.phone || '',
        email: settings.email || '',
        address: settings.address || '',
        tagline: settings.tagline || '',
        description: settings.description || '',
        google_reviews_url: settings.google_reviews_url || '',
        google_rating: settings.google_rating?.toString() || '',
        google_review_count: settings.google_review_count?.toString() || '',
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = {
        name: formData.name,
        phone: formData.phone || null,
        email: formData.email || null,
        address: formData.address || null,
        tagline: formData.tagline || null,
        description: formData.description || null,
        google_reviews_url: formData.google_reviews_url || null,
        google_rating: formData.google_rating ? parseFloat(formData.google_rating) : null,
        google_review_count: formData.google_review_count ? parseInt(formData.google_review_count) : null,
        updated_at: new Date().toISOString(),
      };

      if (settings?.id) {
        const { error } = await supabase
          .from('business_settings')
          .update(data)
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('business_settings')
          .insert(data);

        if (error) throw error;
      }

      toast.success('Asetukset tallennettu');
      queryClient.invalidateQueries({ queryKey: ['business-settings'] });
    } catch (error) {
      toast.error('Tallennus epäonnistui');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <p className="text-muted-foreground text-center py-8">Ladataan...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Ravintolan asetukset</h2>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Tallennetaan...' : 'Tallenna'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Perustiedot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Ravintolan nimi</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="tagline">Iskulause</Label>
              <Input
                id="tagline"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">Kuvaus</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Yhteystiedot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="phone">Puhelinnumero</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Sähköposti</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="address">Osoite</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Google-arvostelut</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="google_reviews_url">Google Reviews URL</Label>
                <Input
                  id="google_reviews_url"
                  value={formData.google_reviews_url}
                  onChange={(e) => setFormData({ ...formData, google_reviews_url: e.target.value })}
                  placeholder="https://g.page/..."
                />
              </div>
              <div>
                <Label htmlFor="google_rating">Keskimääräinen arvosana</Label>
                <Input
                  id="google_rating"
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={formData.google_rating}
                  onChange={(e) => setFormData({ ...formData, google_rating: e.target.value })}
                  placeholder="4.5"
                />
              </div>
              <div>
                <Label htmlFor="google_review_count">Arvostelujen määrä</Label>
                <Input
                  id="google_review_count"
                  type="number"
                  value={formData.google_review_count}
                  onChange={(e) => setFormData({ ...formData, google_review_count: e.target.value })}
                  placeholder="150"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
