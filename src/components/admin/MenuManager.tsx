import { useState } from 'react';
import { Plus, Pencil, Trash2, Star, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useMenuCategories, useMenuItems } from '@/hooks/useBusinessData';
import { supabase } from '@/integrations/supabase/client';
import { MenuItem, MenuCategory } from '@/types/database';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export function MenuManager() {
  const queryClient = useQueryClient();
  const { data: categories } = useMenuCategories();
  const { data: items } = useMenuItems();
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    is_popular: false,
    is_available: true,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      is_popular: false,
      is_available: true,
    });
    setEditingItem(null);
  };

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category_id: item.category_id || '',
      is_popular: item.is_popular,
      is_available: item.is_available,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.category_id) {
      toast.error('Täytä kaikki pakolliset kentät');
      return;
    }

    const data = {
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price),
      category_id: formData.category_id,
      is_popular: formData.is_popular,
      is_available: formData.is_available,
      updated_at: new Date().toISOString(),
    };

    if (editingItem) {
      const { error } = await supabase
        .from('menu_items')
        .update(data)
        .eq('id', editingItem.id);

      if (error) {
        toast.error('Päivitys epäonnistui');
        return;
      }
      toast.success('Tuote päivitetty');
    } else {
      const { error } = await supabase
        .from('menu_items')
        .insert(data);

      if (error) {
        toast.error('Lisäys epäonnistui');
        return;
      }
      toast.success('Tuote lisätty');
    }

    queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Haluatko varmasti poistaa tämän tuotteen?')) return;

    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Poisto epäonnistui');
      return;
    }

    toast.success('Tuote poistettu');
    queryClient.invalidateQueries({ queryKey: ['menu-items'] });
  };

  const toggleAvailability = async (item: MenuItem) => {
    const { error } = await supabase
      .from('menu_items')
      .update({ is_available: !item.is_available, updated_at: new Date().toISOString() })
      .eq('id', item.id);

    if (error) {
      toast.error('Päivitys epäonnistui');
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['menu-items'] });
  };

  const getItemsByCategory = (categoryId: string) => {
    return items?.filter(item => item.category_id === categoryId) || [];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Menu-hallinta</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Lisää tuote
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Muokkaa tuotetta' : 'Lisää uusi tuote'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Nimi *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Tuotteen nimi"
                />
              </div>
              <div>
                <Label htmlFor="description">Kuvaus</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tuotteen kuvaus"
                />
              </div>
              <div>
                <Label htmlFor="price">Hinta (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="category">Kategoria *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Valitse kategoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_popular">Suosittu tuote</Label>
                <Switch
                  id="is_popular"
                  checked={formData.is_popular}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_popular: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_available">Saatavilla</Label>
                <Switch
                  id="is_available"
                  checked={formData.is_available}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                />
              </div>
              <Button onClick={handleSave} className="w-full">
                {editingItem ? 'Tallenna muutokset' : 'Lisää tuote'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {categories?.map(category => (
        <Card key={category.id}>
          <CardHeader>
            <CardTitle className="text-lg">{category.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getItemsByCategory(category.id).length === 0 ? (
                <p className="text-muted-foreground text-sm">Ei tuotteita</p>
              ) : (
                getItemsByCategory(category.id).map(item => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      !item.is_available ? 'bg-muted/50 opacity-60' : 'bg-background'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.name}</span>
                          {item.is_popular && (
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          )}
                          {!item.is_available && (
                            <Badge variant="secondary">Ei saatavilla</Badge>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-primary">{item.price.toFixed(2)}€</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => toggleAvailability(item)}
                        title={item.is_available ? 'Merkitse ei-saatavilla' : 'Merkitse saatavilla'}
                      >
                        {item.is_available ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-destructive" />}
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => openEditDialog(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
