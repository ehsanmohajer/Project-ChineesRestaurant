import { useIsOpen } from '@/hooks/useBusinessData';

export function OpenCloseIndicator() {
  const { isOpen, todayHours } = useIsOpen();

  const formatTime = (time: string | null) => {
    if (!time) return '';
    return time.slice(0, 5);
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`h-2.5 w-2.5 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-destructive'}`} />
      <span className={`text-sm font-medium ${isOpen ? 'text-green-600' : 'text-destructive'}`}>
        {isOpen ? 'Open' : 'Closed'}
      </span>
      {todayHours && !todayHours.is_closed && (
        <span className="text-xs text-muted-foreground hidden sm:inline">
          ({formatTime(todayHours.open_time)} - {formatTime(todayHours.close_time)})
        </span>
      )}
    </div>
  );
}
