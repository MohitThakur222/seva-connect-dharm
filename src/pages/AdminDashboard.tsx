import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LogOut, Calendar, DollarSign, Bell, Trash2, Edit, Plus, X, Check } from 'lucide-react';
import { format } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';

type Booking = Tables<'bookings'>;
type Donation = Tables<'donations'>;
type EventPopup = Tables<'event_popups'>;

const AdminDashboard = () => {
  const [tab, setTab] = useState<'bookings' | 'donations' | 'popups'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [popups, setPopups] = useState<EventPopup[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPopup, setEditingPopup] = useState<EventPopup | null>(null);
  const [newPopup, setNewPopup] = useState(false);
  const [popupForm, setPopupForm] = useState({ name: '', event_date: '', description: '', is_active: true });
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/admin');
      return;
    }
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!roleData) {
      await supabase.auth.signOut();
      navigate('/admin');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const [bookingsRes, donationsRes, popupsRes] = await Promise.all([
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('donations').select('*').order('created_at', { ascending: false }),
      supabase.from('event_popups').select('*').order('created_at', { ascending: false }),
    ]);

    if (bookingsRes.data) setBookings(bookingsRes.data);
    if (donationsRes.data) setDonations(donationsRes.data);
    if (popupsRes.data) setPopups(popupsRes.data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const updateBookingStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success('Status updated');
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    }
  };

  const deleteBooking = async (id: string) => {
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete');
    } else {
      setBookings(bookings.filter(b => b.id !== id));
      toast.success('Booking deleted');
    }
  };

  const deleteDonation = async (id: string) => {
    const { error } = await supabase.from('donations').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete');
    } else {
      setDonations(donations.filter(d => d.id !== id));
      toast.success('Donation deleted');
    }
  };

  const savePopup = async () => {
    if (!popupForm.name || !popupForm.event_date || !popupForm.description) {
      toast.error('All fields are required');
      return;
    }

    if (editingPopup) {
      const { error } = await supabase
        .from('event_popups')
        .update(popupForm)
        .eq('id', editingPopup.id);
      if (error) {
        toast.error('Failed to update popup');
      } else {
        toast.success('Popup updated');
        setEditingPopup(null);
        fetchData();
      }
    } else {
      const { error } = await supabase.from('event_popups').insert(popupForm);
      if (error) {
        toast.error('Failed to create popup');
      } else {
        toast.success('Popup created');
        setNewPopup(false);
        fetchData();
      }
    }
    setPopupForm({ name: '', event_date: '', description: '', is_active: true });
  };

  const deletePopup = async (id: string) => {
    const { error } = await supabase.from('event_popups').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete');
    } else {
      setPopups(popups.filter(p => p.id !== id));
      toast.success('Popup deleted');
    }
  };

  const togglePopupActive = async (id: string, is_active: boolean) => {
    const { error } = await supabase.from('event_popups').update({ is_active: !is_active }).eq('id', id);
    if (error) {
      toast.error('Failed to update');
    } else {
      setPopups(popups.map(p => p.id === id ? { ...p, is_active: !is_active } : p));
    }
  };

  const startEditPopup = (popup: EventPopup) => {
    setEditingPopup(popup);
    setNewPopup(false);
    setPopupForm({
      name: popup.name,
      event_date: popup.event_date,
      description: popup.description,
      is_active: popup.is_active,
    });
  };

  const tabs = [
    { key: 'bookings' as const, label: 'Bookings', icon: Calendar, count: bookings.length },
    { key: 'donations' as const, label: 'Donations', icon: DollarSign, count: donations.length },
    { key: 'popups' as const, label: 'Event Popups', icon: Bell, count: popups.length },
  ];

  return (
    <div className="pt-20 min-h-screen bg-muted">
      <div className="bg-navy text-secondary-foreground py-6">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-body opacity-80 hover:opacity-100 transition-opacity"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-body text-sm font-medium whitespace-nowrap transition-all ${
                tab === t.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-foreground border border-border hover:border-primary/30'
              }`}
            >
              <t.icon size={16} />
              {t.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                tab === t.key ? 'bg-primary-foreground/20' : 'bg-muted'
              }`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground font-body">Loading...</div>
        ) : (
          <>
            {/* Bookings */}
            {tab === 'bookings' && (
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground font-body">No bookings yet</div>
                ) : (
                  bookings.map((booking) => (
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
                  ))
                )}
              </div>
            )}

            {/* Donations */}
            {tab === 'donations' && (
              <div className="space-y-4">
                {donations.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground font-body">No donations recorded yet</div>
                ) : (
                  donations.map((donation) => (
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
                  ))
                )}
              </div>
            )}

            {/* Event Popups */}
            {tab === 'popups' && (
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setNewPopup(true);
                    setEditingPopup(null);
                    setPopupForm({ name: '', event_date: '', description: '', is_active: true });
                  }}
                  className="gradient-kesari text-primary-foreground px-4 py-2.5 rounded-lg font-body text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <Plus size={16} /> Add Event Popup
                </button>

                {/* Add/Edit form */}
                {(newPopup || editingPopup) && (
                  <div className="bg-card rounded-lg border border-primary/30 p-6 shadow-service space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-lg font-bold text-navy">
                        {editingPopup ? 'Edit Event Popup' : 'New Event Popup'}
                      </h3>
                      <button onClick={() => { setNewPopup(false); setEditingPopup(null); }} className="p-1 hover:bg-muted rounded">
                        <X size={18} />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Event Name"
                      value={popupForm.name}
                      onChange={(e) => setPopupForm({ ...popupForm, name: e.target.value })}
                      className="w-full border border-input rounded-lg px-4 py-3 bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-primary/30 outline-none"
                      maxLength={200}
                    />
                    <input
                      type="date"
                      value={popupForm.event_date}
                      onChange={(e) => setPopupForm({ ...popupForm, event_date: e.target.value })}
                      className="w-full border border-input rounded-lg px-4 py-3 bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-primary/30 outline-none"
                    />
                    <textarea
                      placeholder="Event Description"
                      value={popupForm.description}
                      onChange={(e) => setPopupForm({ ...popupForm, description: e.target.value })}
                      rows={3}
                      className="w-full border border-input rounded-lg px-4 py-3 bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-primary/30 outline-none resize-none"
                      maxLength={1000}
                    />
                    <label className="flex items-center gap-2 font-body text-sm">
                      <input
                        type="checkbox"
                        checked={popupForm.is_active}
                        onChange={(e) => setPopupForm({ ...popupForm, is_active: e.target.checked })}
                        className="accent-primary"
                      />
                      Active (show to visitors)
                    </label>
                    <button
                      onClick={savePopup}
                      className="gradient-kesari text-primary-foreground px-6 py-2.5 rounded-lg font-body text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      {editingPopup ? 'Update Popup' : 'Create Popup'}
                    </button>
                  </div>
                )}

                {popups.length === 0 && !newPopup ? (
                  <div className="text-center py-12 text-muted-foreground font-body">No event popups yet</div>
                ) : (
                  popups.map((popup) => (
                    <div key={popup.id} className="bg-card rounded-lg border border-border p-4 shadow-service">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-navy font-body">{popup.name}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-body ${
                              popup.is_active ? 'bg-kesari-light text-accent-foreground' : 'bg-muted text-muted-foreground'
                            }`}>
                              {popup.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground font-body">{popup.event_date}</p>
                          <p className="text-sm text-foreground/70 font-body mt-1">{popup.description}</p>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => togglePopupActive(popup.id, popup.is_active)}
                            className={`p-1.5 rounded transition-colors ${
                              popup.is_active ? 'text-muted-foreground hover:bg-muted' : 'text-primary hover:bg-kesari-light'
                            }`}
                            title={popup.is_active ? 'Deactivate' : 'Activate'}
                          >
                            <Check size={16} />
                          </button>
                          <button onClick={() => startEditPopup(popup)} className="p-1.5 text-foreground hover:bg-muted rounded transition-colors">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => deletePopup(popup.id)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
