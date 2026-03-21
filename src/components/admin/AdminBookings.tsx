import { Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Booking {
  id: string;
  name: string;
  phone: string;
  event_type: string;
  event_date: string;
  message: string | null;
  status: string;
  created_at: string;
}

interface AdminBookingsProps {
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
}

const AdminBookings = ({ bookings, setBookings }: AdminBookingsProps) => {
  const updateBookingStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (error) toast.error('Failed to update status');
    else {
      toast.success('Status updated');
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    }
  };

  const deleteBooking = async (id: string) => {
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else {
      setBookings(bookings.filter(b => b.id !== id));
      toast.success('Booking deleted');
    }
  };

  if (bookings.length === 0) {
    return <div className="text-center py-12 text-muted-foreground font-body">No bookings yet</div>;
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking.id} className="bg-card rounded-lg border border-border p-4 shadow-service">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-navy font-body">{booking.name}</h3>
              <p className="text-sm text-muted-foreground font-body">
                {booking.event_type} • {booking.event_date} • {booking.phone}
              </p>
              {booking.message && (
                <p className="text-sm text-foreground/70 font-body mt-1">{booking.message}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={booking.status}
                onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border font-body ${
                  booking.status === 'confirmed' ? 'bg-kesari-light text-accent-foreground border-primary/30' :
                  booking.status === 'cancelled' ? 'bg-destructive/10 text-destructive border-destructive/30' :
                  'bg-muted text-muted-foreground border-border'
                }`}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button onClick={() => deleteBooking(booking.id)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminBookings;
