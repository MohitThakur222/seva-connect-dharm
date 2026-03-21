import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LogOut, Calendar, DollarSign, Bell, Wrench, ImageIcon } from 'lucide-react';
import AdminBookings from '@/components/admin/AdminBookings';
import AdminDonations from '@/components/admin/AdminDonations';
import AdminPopups from '@/components/admin/AdminPopups';
import AdminServices from '@/components/admin/AdminServices';
import AdminImages from '@/components/admin/AdminImages';

type TabKey = 'bookings' | 'donations' | 'popups' | 'services' | 'images';

const AdminDashboard = () => {
  const [tab, setTab] = useState<TabKey>('bookings');
  const [bookings, setBookings] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [popups, setPopups] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [siteImages, setSiteImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/admin'); return; }
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();
    if (!roleData) { await supabase.auth.signOut(); navigate('/admin'); }
  };

  const fetchData = async () => {
    setLoading(true);
    const [bookingsRes, donationsRes, popupsRes, servicesRes, imagesRes] = await Promise.all([
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('donations').select('*').order('created_at', { ascending: false }),
      supabase.from('event_popups').select('*').order('created_at', { ascending: false }),
      supabase.from('services').select('*').order('sort_order', { ascending: true }),
      supabase.from('site_images').select('*').order('image_key'),
    ]);

    if (bookingsRes.data) setBookings(bookingsRes.data);
    if (donationsRes.data) setDonations(donationsRes.data);
    if (popupsRes.data) setPopups(popupsRes.data);
    if (servicesRes.data) setServices(servicesRes.data);
    if (imagesRes.data) setSiteImages(imagesRes.data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const tabs = [
    { key: 'bookings' as const, label: 'Bookings', icon: Calendar, count: bookings.length },
    { key: 'donations' as const, label: 'Donations', icon: DollarSign, count: donations.length },
    { key: 'popups' as const, label: 'Popups', icon: Bell, count: popups.length },
    { key: 'services' as const, label: 'Services', icon: Wrench, count: services.length },
    { key: 'images' as const, label: 'Images', icon: ImageIcon, count: siteImages.length },
  ];

  return (
    <div className="pt-20 min-h-screen bg-muted">
      <div className="bg-navy text-secondary-foreground py-6">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-body opacity-80 hover:opacity-100 transition-opacity">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
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
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.key ? 'bg-primary-foreground/20' : 'bg-muted'}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground font-body">Loading...</div>
        ) : (
          <>
            {tab === 'bookings' && <AdminBookings bookings={bookings} setBookings={setBookings} />}
            {tab === 'donations' && <AdminDonations donations={donations} setDonations={setDonations} />}
            {tab === 'popups' && <AdminPopups popups={popups} fetchData={fetchData} />}
            {tab === 'services' && <AdminServices services={services} fetchData={fetchData} />}
            {tab === 'images' && <AdminImages images={siteImages} fetchData={fetchData} />}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
