import { useState } from 'react';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useDailyDeals } from '@/hooks/useBusinessData';
import { supabase } from '@/integrations/supabase/client';
import { DailyDeal } from '@/types/database';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export function DealsManager() {
  const queryClient = useQueryClient();
  const { data: deals } = useDailyDeals();
  const [editingDeal, setEditingDeal] = useState<DailyDeal | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_percentage: '',
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      discount_percentage: '',
      is_active: true,
    });
    setEditingDeal(null);
  };

  const openEditDialog = (deal: DailyDeal) => {
    setEditingDeal(deal);
    setFormData({
      title: deal.title,
      description: deal.description || '',
      discount_percentage: deal.discount_percentage?.toString() || '',
      is_active: deal.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title) {
      toast.error('Otsikko on pakollinen');
      return;
    }

    const data = {
      title: formData.title,
      description: formData.description || null,
      discount_percentage: formData.discount_percentage ? parseInt(formData.discount_percentage) : null,
      is_active: formData.is_active,
      updated_at: new Date().toISOString(),
    };

    if (editingDeal) {
      const { error } = await supabase
        .from('daily_deals')
        .update(data)
        .eq('id', editingDeal.id);

      if (error) {
        toast.error('Päivitys epäonnistui');
        return;
      }
      toast.success('Tarjous päivitetty');
    } else {
      const { error } = await supabase
        .from('daily_deals')
        .insert(data);

      if (error) {
        toast.error('Lisäys epäonnistui');
        return;
      }
      toast.success('Tarjous lisätty');
    }

    queryClient.invalidateQueries({ queryKey: ['daily-deals'] });
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Haluatko varmasti poistaa tämän tarjouksen?')) return;

    const { error } = await supabase
      .from('daily_deals')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Poisto epäonnistui');
      return;
    }

    toast.success('Tarjous poistettu');
    queryClient.invalidateQueries({ queryKey: ['daily-deals'] });
  };

  const toggleActive = async (deal: DailyDeal) => {
    const { error } = await supabase
      .from('daily_deals')
      .update({ is_active: !deal.is_active, updated_at: new Date().toISOString() })
      .eq('id', deal.id);

    if (error) {
      toast.error('Päivitys epäonnistui');
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['daily-deals'] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Tarjoukset</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Lisää tarjous
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingDeal ? 'Muokkaa tarjousta' : 'Lisää uusi tarjous'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="title">Otsikko *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Esim. Päivän lounastuikku"
                />
              </div>
              <div>
                <Label htmlFor="description">Kuvaus</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tarjouksen kuvaus"
                />
              </div>
              <div>
                <Label htmlFor="discount">Alennus (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                  placeholder="Esim. 20"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Aktiivinen</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
              <Button onClick={handleSave} className="w-full">
                {editingDeal ? 'Tallenna muutokset' : 'Lisää tarjous'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          {!deals || deals.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Ei tarjouksia</p>
          ) : (
            <div className="space-y-3">
              {deals.map(deal => (
                <div
                  key={deal.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    !deal.is_active ? 'bg-muted/50 opacity-60' : 'bg-background'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Tag className="h-5 w-5 text-primary" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{deal.title}</span>
                        {deal.discount_percentage && (
                          <Badge variant="destructive">-{deal.discount_percentage}%</Badge>
                        )}
                        {!deal.is_active && (
                          <Badge variant="secondary">Ei aktiivinen</Badge>
                        )}
                      </div>
                      {deal.description && (
                        <p className="text-sm text-muted-foreground">{deal.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={deal.is_active}
                      onCheckedChange={() => toggleActive(deal)}
                    />
                    <Button size="icon" variant="ghost" onClick={() => openEditDialog(deal)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(deal.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
