import { useState } from 'react';
import { Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useOpeningHours } from '@/hooks/useBusinessData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const dayNames = ['Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai'];

export function HoursManager() {
  const queryClient = useQueryClient();
  const { data: hours, isLoading } = useOpeningHours();
  const [saving, setSaving] = useState(false);
  const [localHours, setLocalHours] = useState<Record<number, { open: string; close: string; closed: boolean }>>({});

  const getHoursForDay = (dayOfWeek: number) => {
    if (localHours[dayOfWeek]) return localHours[dayOfWeek];
    const h = hours?.find(hour => hour.day_of_week === dayOfWeek);
    return {
      open: h?.open_time?.slice(0, 5) || '10:00',
      close: h?.close_time?.slice(0, 5) || '21:00',
      closed: h?.is_closed || false,
    };
  };

  const updateLocalHours = (dayOfWeek: number, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    const current = getHoursForDay(dayOfWeek);
    setLocalHours(prev => ({
      ...prev,
      [dayOfWeek]: {
        ...current,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const day of [0, 1, 2, 3, 4, 5, 6]) {
        const h = getHoursForDay(day);
        const existing = hours?.find(hour => hour.day_of_week === day);
        
        const data = {
          day_of_week: day,
          open_time: h.open + ':00',
          close_time: h.close + ':00',
          is_closed: h.closed,
        };

        if (existing) {
          const { error } = await supabase
            .from('opening_hours')
            .update(data)
            .eq('id', existing.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('opening_hours')
            .insert(data);
          if (error) throw error;
        }
      }

      toast.success('Aukioloajat tallennettu');
      queryClient.invalidateQueries({ queryKey: ['opening-hours'] });
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
        <h2 className="text-xl font-semibold text-foreground">Aukioloajat</h2>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Tallennetaan...' : 'Tallenna'}
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 0].map(day => {
              const h = getHoursForDay(day);
              return (
                <div key={day} className="flex items-center gap-4 py-2 border-b last:border-0">
                  <div className="w-32 font-medium">{dayNames[day]}</div>
                  <div className="flex items-center gap-2">
                    <Label className="text-muted-foreground">Suljettu</Label>
                    <Switch
                      checked={h.closed}
                      onCheckedChange={(checked) => updateLocalHours(day, 'closed', checked)}
                    />
                  </div>
                  {!h.closed && (
                    <>
                      <div className="flex items-center gap-2">
                        <Label className="text-muted-foreground">Avataan</Label>
                        <Input
                          type="time"
                          value={h.open}
                          onChange={(e) => updateLocalHours(day, 'open', e.target.value)}
                          className="w-32"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-muted-foreground">Suljetaan</Label>
                        <Input
                          type="time"
                          value={h.close}
                          onChange={(e) => updateLocalHours(day, 'close', e.target.value)}
                          className="w-32"
                        />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
