
import React, { useState, useEffect } from 'react';
import NavBar from '../components/layout/NavBar';
import Sidebar from '../components/layout/Sidebar';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { CalendarPlus, CalendarClock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  application_id?: string;
  type: 'event' | 'application';
}

interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: string;
  applied_date: string;
}

const CalendarPage: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const isMobile = useIsMobile();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: new Date(),
  });
  const { user } = useAuth();
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Format date to string (YYYY-MM-DD format)
  const formatDateToString = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };

  // Fetch all calendar events
  const fetchEvents = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data: eventData, error: eventError } = await supabase
        .from('calendar_events')
        .select('*');
        
      if (eventError) throw eventError;
      
      const { data: appData, error: appError } = await supabase
        .from('job_applications')
        .select('*');
        
      if (appError) throw appError;
      
      // Process application data as events
      const applicationEvents = appData.map((app: JobApplication) => ({
        id: `app-${app.id}`,
        title: `${app.position} at ${app.company}`,
        description: `Job application for ${app.position} position`,
        date: formatDateToString(new Date(app.applied_date)),
        application_id: app.id,
        type: 'application' as const
      }));
      
      const calendarEvents = eventData.map((event: any) => ({
        ...event,
        type: 'event' as const
      }));
      
      // Combine both types of events
      const allEvents = [...calendarEvents, ...applicationEvents];
      setEvents(allEvents);
      setApplications(appData);
      
      if (date) {
        const filteredEvents = allEvents.filter(event => 
          event.date === formatDateToString(date)
        );
        setEventsForSelectedDate(filteredEvents);
      }
    } catch (error: any) {
      toast.error('Failed to load calendar events: ' + error.message);
      console.error('Error loading calendar events:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchEvents();
  }, [user]);
  
  useEffect(() => {
    if (date && events.length > 0) {
      const filteredEvents = events.filter(event => 
        event.date === formatDateToString(date)
      );
      setEventsForSelectedDate(filteredEvents);
    }
  }, [date, events]);
  
  // Handle adding a new event
  const handleAddEvent = async () => {
    if (!user) return;
    
    if (!newEvent.title) {
      toast.error('Event title is required');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('calendar_events')
        .insert({
          user_id: user.id,
          title: newEvent.title,
          description: newEvent.description,
          date: formatDateToString(newEvent.date || new Date()),
        });
        
      if (error) throw error;
      
      toast.success('Event added successfully');
      // Reset form
      setNewEvent({
        title: '',
        description: '',
        date: new Date(),
      });
      // Refresh events
      fetchEvents();
    } catch (error: any) {
      toast.error('Failed to add event: ' + error.message);
      console.error('Error adding event:', error);
    }
  };
  
  // Function to highlight dates with events
  const isDayWithEvent = (day: Date): boolean => {
    const formattedDay = formatDateToString(day);
    return events.some(event => event.date === formattedDay);
  };

  return (
    <div className="flex h-screen w-full bg-gradient-light">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full ml-0 md:ml-20">
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <NavBar />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Calendar</CardTitle>
                  <CardDescription>Plan your applications and interviews</CardDescription>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <CalendarPlus size={16} />
                      <span className="hidden sm:inline">Add Event</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Event</DialogTitle>
                      <DialogDescription>
                        Create a new event on your calendar
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Event Title</label>
                        <Input 
                          value={newEvent.title}
                          onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                          placeholder="Interview, Follow-up, etc."
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea 
                          value={newEvent.description}
                          onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                          placeholder="Add details about this event"
                          rows={3}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <div className="border rounded-md p-2">
                          <Calendar
                            mode="single"
                            selected={newEvent.date}
                            onSelect={(date) => date && setNewEvent({...newEvent, date})}
                            className="mx-auto"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button onClick={handleAddEvent}>Add Event</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className={`flex ${isMobile ? 'justify-center' : 'justify-start'}`}>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border pointer-events-auto"
                    modifiers={{
                      event: (date) => isDayWithEvent(date),
                    }}
                    modifiersClassNames={{
                      event: "border-2 border-domino-mint",
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {date ? format(date, 'MMMM d, yyyy') : 'Events'}
                </CardTitle>
                {eventsForSelectedDate.length > 0 && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <CalendarClock size={14} />
                    <span>{eventsForSelectedDate.length} events</span>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center p-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {eventsForSelectedDate.length > 0 ? (
                      eventsForSelectedDate.map((event) => (
                        <div 
                          key={event.id}
                          className="p-3 border rounded-md hover:bg-accent/30 transition-colors cursor-pointer"
                          onClick={() => setSelectedEvent(event)}
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{event.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              event.type === 'application' 
                                ? 'bg-domino-green/20 text-domino-green' 
                                : 'bg-domino-rose/20 text-domino-rose'
                            }`}>
                              {event.type === 'application' ? 'Application' : 'Event'}
                            </span>
                          </div>
                          {event.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-4 border rounded-md">
                        <p className="text-muted-foreground">No events for this day</p>
                        <Button 
                          variant="link" 
                          onClick={() => {
                            const dialogTrigger = document.querySelector('[data-state="closed"]');
                            if (dialogTrigger instanceof HTMLElement) {
                              dialogTrigger.click();
                            }
                          }}
                          className="mt-2"
                        >
                          Add an event
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
