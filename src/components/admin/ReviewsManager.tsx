import { useState } from 'react';
import { Plus, Pencil, Trash2, Star, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGoogleReviews } from '@/hooks/useBusinessData';
import { supabase } from '@/integrations/supabase/client';
import { GoogleReview } from '@/types/database';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export function ReviewsManager() {
  const queryClient = useQueryClient();
  const { data: reviews } = useGoogleReviews();
  const [editingReview, setEditingReview] = useState<GoogleReview | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    author_name: '',
    rating: '5',
    text: '',
    time_description: '',
    is_visible: true,
  });

  const resetForm = () => {
    setFormData({
      author_name: '',
      rating: '5',
      text: '',
      time_description: '',
      is_visible: true,
    });
    setEditingReview(null);
  };

  const openEditDialog = (review: GoogleReview) => {
    setEditingReview(review);
    setFormData({
      author_name: review.author_name,
      rating: review.rating.toString(),
      text: review.text || '',
      time_description: review.time_description || '',
      is_visible: review.is_visible,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.author_name) {
      toast.error('Nimi on pakollinen');
      return;
    }

    const data = {
      author_name: formData.author_name,
      rating: parseInt(formData.rating),
      text: formData.text || null,
      time_description: formData.time_description || null,
      is_visible: formData.is_visible,
    };

    if (editingReview) {
      const { error } = await supabase
        .from('google_reviews')
        .update(data)
        .eq('id', editingReview.id);

      if (error) {
        toast.error('Päivitys epäonnistui');
        return;
      }
      toast.success('Arvostelu päivitetty');
    } else {
      const { error } = await supabase
        .from('google_reviews')
        .insert(data);

      if (error) {
        toast.error('Lisäys epäonnistui');
        return;
      }
      toast.success('Arvostelu lisätty');
    }

    queryClient.invalidateQueries({ queryKey: ['google-reviews'] });
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Haluatko varmasti poistaa tämän arvostelun?')) return;

    const { error } = await supabase
      .from('google_reviews')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Poisto epäonnistui');
      return;
    }

    toast.success('Arvostelu poistettu');
    queryClient.invalidateQueries({ queryKey: ['google-reviews'] });
  };

  const toggleVisibility = async (review: GoogleReview) => {
    const { error } = await supabase
      .from('google_reviews')
      .update({ is_visible: !review.is_visible })
      .eq('id', review.id);

    if (error) {
      toast.error('Päivitys epäonnistui');
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['google-reviews'] });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Arvostelut</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Lisää arvostelu
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingReview ? 'Muokkaa arvostelua' : 'Lisää uusi arvostelu'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="author_name">Arvostelijan nimi *</Label>
                <Input
                  id="author_name"
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  placeholder="Esim. Matti M."
                />
              </div>
              <div>
                <Label htmlFor="rating">Arvosana (1-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="text">Arvostelu</Label>
                <Textarea
                  id="text"
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="Asiakkaan arvostelu..."
                />
              </div>
              <div>
                <Label htmlFor="time_description">Aika (esim. "2 viikkoa sitten")</Label>
                <Input
                  id="time_description"
                  value={formData.time_description}
                  onChange={(e) => setFormData({ ...formData, time_description: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_visible">Näytetään sivustolla</Label>
                <Switch
                  id="is_visible"
                  checked={formData.is_visible}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
                />
              </div>
              <Button onClick={handleSave} className="w-full">
                {editingReview ? 'Tallenna muutokset' : 'Lisää arvostelu'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          {!reviews || reviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Ei arvosteluja</p>
          ) : (
            <div className="space-y-3">
              {reviews.map(review => (
                <div
                  key={review.id}
                  className={`p-4 rounded-lg border ${
                    !review.is_visible ? 'bg-muted/50 opacity-60' : 'bg-background'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{review.author_name}</span>
                        <div className="flex">{renderStars(review.rating)}</div>
                        {!review.is_visible && (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      {review.text && (
                        <p className="text-sm text-muted-foreground">{review.text}</p>
                      )}
                      {review.time_description && (
                        <p className="text-xs text-muted-foreground mt-1">{review.time_description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => toggleVisibility(review)}
                        title={review.is_visible ? 'Piilota' : 'Näytä'}
                      >
                        {review.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => openEditDialog(review)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(review.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
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
