import { Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Donation {
  id: string;
  donor_name: string | null;
  donor_phone: string | null;
  category: string;
  amount: number | null;
  notes: string | null;
  created_at: string;
}

interface AdminDonationsProps {
  donations: Donation[];
  setDonations: React.Dispatch<React.SetStateAction<Donation[]>>;
}

const AdminDonations = ({ donations, setDonations }: AdminDonationsProps) => {
  const deleteDonation = async (id: string) => {
    const { error } = await supabase.from('donations').delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else {
      setDonations(donations.filter(d => d.id !== id));
      toast.success('Donation deleted');
    }
  };

  if (donations.length === 0) {
    return <div className="text-center py-12 text-muted-foreground font-body">No donations recorded yet</div>;
  }

  return (
    <div className="space-y-4">
      {donations.map((donation) => (
        <div key={donation.id} className="bg-card rounded-lg border border-border p-4 shadow-service">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-navy font-body">{donation.donor_name || 'Anonymous'}</h3>
              <p className="text-sm text-muted-foreground font-body">
                {donation.category} • {donation.donor_phone || 'No phone'} • {format(new Date(donation.created_at), 'PPP')}
              </p>
              {donation.amount && (
                <p className="text-primary font-semibold font-body mt-1">₹{donation.amount}</p>
              )}
            </div>
            <button onClick={() => deleteDonation(donation.id)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors self-end sm:self-center">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminDonations;
