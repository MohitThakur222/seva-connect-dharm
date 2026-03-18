import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type EventType = Database['public']['Enums']['event_type'];

interface BookingPageProps {
  t: (key: string) => string;
}

const eventTypes: EventType[] = ['marriage', 'birthday', 'barsi', 'tervi', 'other'];

const BookingPage = ({ t }: BookingPageProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [eventType, setEventType] = useState<EventType | ''>('');
  const [date, setDate] = useState<Date>();
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !eventType || !date) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('bookings').insert({
        name: name.trim(),
        phone: phone.trim(),
        event_type: eventType as EventType,
        event_date: format(date, 'yyyy-MM-dd'),
        message: message.trim() || null,
      });

      if (error) throw error;

      toast.success('Booking request submitted successfully! We will contact you soon.');
      setName('');
      setPhone('');
      setEventType('');
      setDate(undefined);
      setMessage('');
    } catch (err) {
      console.error('Booking error:', err);
      toast.error('Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20 pb-8">
      <div className="bg-navy text-secondary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{t('booking_title')}</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto font-body">{t('booking_subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-card rounded-xl shadow-service border border-border p-8 space-y-5"
        >
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2 font-body">{t('select_event')}</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value as EventType)}
              className="w-full border border-input rounded-lg px-4 py-3 bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-primary/30 outline-none"
            >
              <option value="">{t('select_event')}</option>
              {eventTypes.map((type) => (
                <option key={type} value={type}>{t(type)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2 font-body">{t('date')}</label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "w-full border border-input rounded-lg px-4 py-3 text-left font-body text-sm flex items-center gap-2",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon size={16} />
                  {date ? format(date, 'PPP') : t('date')}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2 font-body">{t('your_name')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-input rounded-lg px-4 py-3 bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-primary/30 outline-none"
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2 font-body">{t('phone')}</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-input rounded-lg px-4 py-3 bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-primary/30 outline-none"
              maxLength={15}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2 font-body">{t('message')}</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full border border-input rounded-lg px-4 py-3 bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-primary/30 outline-none resize-none"
              maxLength={500}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full gradient-kesari text-primary-foreground py-3 rounded-lg font-semibold text-lg font-body hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : t('submit')}
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default BookingPage;
