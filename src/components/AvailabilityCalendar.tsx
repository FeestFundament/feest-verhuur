import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { nl } from "date-fns/locale";

interface AvailabilityCalendarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (startDate: Date, endDate: Date) => void;
  productName: string;
}

const AvailabilityCalendar = ({ open, onOpenChange, onConfirm, productName }: AvailabilityCalendarProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleConfirm = () => {
    if (dateRange?.from) {
      const endDate = dateRange.to || dateRange.from;
      onConfirm(dateRange.from, endDate);
      onOpenChange(false);
      setDateRange(undefined);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-secondary">Beschikbaarheid - {productName}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Selecteer de verhuurperiode voor dit product
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center py-4">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={1}
            disabled={(date) => date < new Date()}
            locale={nl}
            className="rounded-md border border-border pointer-events-auto"
          />
        </div>

        {dateRange?.from && (
          <div className="text-center text-sm text-muted-foreground">
            {dateRange.to ? (
              <>
                {format(dateRange.from, 'PPP', { locale: nl })} - {format(dateRange.to, 'PPP', { locale: nl })}
              </>
            ) : (
              format(dateRange.from, 'PPP', { locale: nl })
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Annuleren
          </Button>
          <Button 
            variant="gold" 
            onClick={handleConfirm}
            disabled={!dateRange?.from}
          >
            Bevestigen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AvailabilityCalendar;
