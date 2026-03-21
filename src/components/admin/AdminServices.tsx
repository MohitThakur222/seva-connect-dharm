import { useState } from 'react';
import { Trash2, Edit, Plus, X, GripVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ICON_OPTIONS = ['Stethoscope', 'GraduationCap', 'Heart', 'ShieldAlert', 'Users', 'Home', 'Car', 'Utensils', 'Baby', 'Briefcase'];

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  details: string[];
  whatsapp_msg: string;
  sort_order: number;
  is_active: boolean;
}

interface AdminServicesProps {
  services: Service[];
  fetchData: () => void;
}

const AdminServices = ({ services, fetchData }: AdminServicesProps) => {
  const [editing, setEditing] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', icon: 'Stethoscope', details: [''], whatsapp_msg: '', sort_order: 0, is_active: true,
  });

  const resetForm = () => {
    setForm({ title: '', description: '', icon: 'Stethoscope', details: [''], whatsapp_msg: '', sort_order: 0, is_active: true });
    setEditing(null);
    setShowForm(false);
  };

  const startEdit = (s: Service) => {
    setEditing(s);
    setShowForm(true);
    setForm({
      title: s.title,
      description: s.description,
      icon: s.icon,
      details: s.details.length > 0 ? s.details : [''],
      whatsapp_msg: s.whatsapp_msg,
      sort_order: s.sort_order,
      is_active: s.is_active,
    });
  };

  const save = async () => {
    if (!form.title || !form.description) {
      toast.error('Title and description are required');
      return;
    }
    const cleanDetails = form.details.filter(d => d.trim() !== '');
    const payload = { ...form, details: cleanDetails };

    if (editing) {
      const { error } = await supabase.from('services').update(payload).eq('id', editing.id);
      if (error) toast.error('Failed to update service');
      else { toast.success('Service updated'); resetForm(); fetchData(); }
    } else {
      const { error } = await supabase.from('services').insert(payload);
      if (error) toast.error('Failed to create service');
      else { toast.success('Service created'); resetForm(); fetchData(); }
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else { toast.success('Service deleted'); fetchData(); }
  };

  const toggleActive = async (id: string, is_active: boolean) => {
    const { error } = await supabase.from('services').update({ is_active: !is_active }).eq('id', id);
    if (error) toast.error('Failed to update');
    else fetchData();
  };

  const addDetail = () => setForm({ ...form, details: [...form.details, ''] });
  const removeDetail = (i: number) => setForm({ ...form, details: form.details.filter((_, idx) => idx !== i) });
  const updateDetail = (i: number, val: string) => {
    const d = [...form.details];
    d[i] = val;
    setForm({ ...form, details: d });
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => { setShowForm(true); setEditing(null); setForm({ title: '', description: '', icon: 'Stethoscope', details: [''], whatsapp_msg: '', sort_order: services.length + 1, is_active: true }); }}
        className="gradient-kesari text-primary-foreground px-4 py-2.5 rounded-lg font-body text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
      >
        <Plus size={16} /> Add Service
      </button>

      {showForm && (
        <div className="bg-card rounded-lg border border-primary/30 p-6 shadow-service space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-navy">{editing ? 'Edit Service' : 'New Service'}</h3>
            <button onClick={resetForm} className="p-1 hover:bg-muted rounded"><X size={18} /></button>
          </div>

          <input type="text" placeholder="Service Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-input rounded-lg px-4 py-3 bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-primary/30 outline-none" />

          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
            className="w-full border border-input rounded-lg px-4 py-3 bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-primary/30 outline-none resize-none" />

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2 font-body">Icon</label>
            <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-full border border-input rounded-lg px-4 py-3 bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-primary/30 outline-none">
              {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2 font-body">Details / Features</label>
            {form.details.map((d, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input type="text" value={d} onChange={(e) => updateDetail(i, e.target.value)} placeholder={`Detail ${i + 1}`}
                  className="flex-1 border border-input rounded-lg px-4 py-2 bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-primary/30 outline-none" />
                {form.details.length > 1 && (
                  <button onClick={() => removeDetail(i)} className="p-2 text-destructive hover:bg-destructive/10 rounded"><X size={14} /></button>
                )}
              </div>
            ))}
            <button onClick={addDetail} className="text-primary text-sm font-body font-semibold hover:underline">+ Add detail</button>
          </div>

          <input type="text" placeholder="WhatsApp message" value={form.whatsapp_msg} onChange={(e) => setForm({ ...form, whatsapp_msg: e.target.value })}
            className="w-full border border-input rounded-lg px-4 py-3 bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-primary/30 outline-none" />

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-foreground mb-2 font-body">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                className="w-full border border-input rounded-lg px-4 py-3 bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-primary/30 outline-none" />
            </div>
            <label className="flex items-center gap-2 font-body text-sm self-end pb-3">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="accent-primary" />
              Active
            </label>
          </div>

          <button onClick={save} className="gradient-kesari text-primary-foreground px-6 py-2.5 rounded-lg font-body text-sm font-semibold hover:opacity-90 transition-opacity">
            {editing ? 'Update Service' : 'Create Service'}
          </button>
        </div>
      )}

      {services.length === 0 && !showForm ? (
        <div className="text-center py-12 text-muted-foreground font-body">No services yet</div>
      ) : (
        services.sort((a, b) => a.sort_order - b.sort_order).map((service) => (
          <div key={service.id} className="bg-card rounded-lg border border-border p-4 shadow-service">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <GripVertical size={16} className="text-muted-foreground mt-1 flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-navy font-body">{service.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-body ${service.is_active ? 'bg-kesari-light text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {service.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-body">{service.description}</p>
                  <p className="text-xs text-muted-foreground font-body mt-1">Icon: {service.icon} • Order: {service.sort_order} • {service.details.length} details</p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button onClick={() => toggleActive(service.id, service.is_active)}
                  className={`text-xs px-3 py-1 rounded-full font-body font-semibold border transition-colors ${service.is_active ? 'border-muted-foreground text-muted-foreground hover:bg-muted' : 'border-primary text-primary hover:bg-kesari-light'}`}>
                  {service.is_active ? 'Disable' : 'Enable'}
                </button>
                <button onClick={() => startEdit(service)} className="p-1.5 text-foreground hover:bg-muted rounded transition-colors">
                  <Edit size={16} />
                </button>
                <button onClick={() => deleteService(service.id)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminServices;
