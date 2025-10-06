import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { nl } from "date-fns/locale";
import { format } from "date-fns";

const Agenda = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-secondary mb-4 text-center">
          Agenda & Beschikbaarheid
        </h1>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Bekijk onze beschikbaarheid en selecteer uw gewenste verhuurperiode
        </p>
        
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-secondary text-2xl">Selecteer uw verhuurperiode</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                disabled={(date) => date < new Date()}
                locale={nl}
                className="rounded-md border border-border pointer-events-auto"
              />
              
              {dateRange?.from && (
                <div className="mt-6 text-center">
                  <p className="text-muted-foreground mb-2">Geselecteerde periode:</p>
                  <p className="text-xl font-semibold text-secondary">
                    {dateRange.to ? (
                      <>
                        {format(dateRange.from, 'PPP', { locale: nl })} - {format(dateRange.to, 'PPP', { locale: nl })}
                      </>
                    ) : (
                      format(dateRange.from, 'PPP', { locale: nl })
                    )}
                  </p>
                </div>
              )}

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-secondary"></div>
                  <span className="text-sm text-muted-foreground">Beschikbaar</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-muted"></div>
                  <span className="text-sm text-muted-foreground">Niet beschikbaar</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Agenda;
