import { useState } from 'react';
import { Trash2, Edit, Plus, X, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EventPopup {
  id: string;
  name: string;
  event_date: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface AdminPopupsProps {
  popups: EventPopup[];
  fetchData: () => void;
}

const AdminPopups = ({ popups, fetchData }: AdminPopupsProps) => {
  const [editingPopup, setEditingPopup] = useState<EventPopup | null>(null);
  const [newPopup, setNewPopup] = useState(false);
  const [popupForm, setPopupForm] = useState({ name: '', event_date: '', description: '', is_active: true });

  const savePopup = async () => {
    if (!popupForm.name || !popupForm.event_date || !popupForm.description) {
      toast.error('All fields are required');
      return;
    }
    if (editingPopup) {
      const { error } = await supabase.from('event_popups').update(popupForm).eq('id', editingPopup.id);
      if (error) toast.error('Failed to update popup');
      else { toast.success('Popup updated'); setEditingPopup(null); fetchData(); }
    } else {
      const { error } = await supabase.from('event_popups').insert(popupForm);
      if (error) toast.error('Failed to create popup');
      else { toast.success('Popup created'); setNewPopup(false); fetchData(); }
    }
    setPopupForm({ name: '', event_date: '', description: '', is_active: true });
  };

  const deletePopup = async (id: string) => {
    const { error } = await supabase.from('event_popups').delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else { toast.success('Popup deleted'); fetchData(); }
  };

  const togglePopupActive = async (id: string, is_active: boolean) => {
    const { error } = await supabase.from('event_popups').update({ is_active: !is_active }).eq('id', id);
    if (error) toast.error('Failed to update');
    else fetchData();
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => { setNewPopup(true); setEditingPopup(null); setPopupForm({ name: '', event_date: '', description: '', is_active: true }); }}
        className="gradient-kesari text-primary-foreground px-4 py-2.5 rounded-lg font-body text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
      >
        <Plus size={16} /> Add Event Popup
      </button>

      {(newPopup || editingPopup) && (
        <div className="bg-card rounded-lg border border-primary/30 p-6 shadow-service space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-navy">{editingPopup ? 'Edit Event Popup' : 'New Event Popup'}</h3>
            <button onClick={() => { setNewPopup(false); setEditingPopup(null); }} className="p-1 hover:bg-muted rounded"><X size={18} /></button>
          </div>
          <input type="text" placeholder="Event Name" value={popupForm.name} onChange={(e) => setPopupForm({ ...popupForm, name: e.target.value })} className="w-full border border-input rounded-lg px-4 py-3 bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-primary/30 outline-none" />
          <input type="date" value={popupForm.event_date} onChange={(e) => setPopupForm({ ...popupForm, event_date: e.target.value })} className="w-full border border-input rounded-lg px-4 py-3 bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-primary/30 outline-none" />
          <textarea placeholder="Event Description" value={popupForm.description} onChange={(e) => setPopupForm({ ...popupForm, description: e.target.value })} rows={3} className="w-full border border-input rounded-lg px-4 py-3 bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-primary/30 outline-none resize-none" />
          <label className="flex items-center gap-2 font-body text-sm">
            <input type="checkbox" checked={popupForm.is_active} onChange={(e) => setPopupForm({ ...popupForm, is_active: e.target.checked })} className="accent-primary" />
            Active (show to visitors)
          </label>
          <button onClick={savePopup} className="gradient-kesari text-primary-foreground px-6 py-2.5 rounded-lg font-body text-sm font-semibold hover:opacity-90 transition-opacity">
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
                  <span className={`text-xs px-2 py-0.5 rounded-full font-body ${popup.is_active ? 'bg-kesari-light text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {popup.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-body">{popup.event_date}</p>
                <p className="text-sm text-foreground/70 font-body mt-1">{popup.description}</p>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button onClick={() => togglePopupActive(popup.id, popup.is_active)} className={`p-1.5 rounded transition-colors ${popup.is_active ? 'text-muted-foreground hover:bg-muted' : 'text-primary hover:bg-kesari-light'}`} title={popup.is_active ? 'Deactivate' : 'Activate'}>
                  <Check size={16} />
                </button>
                <button onClick={() => { setEditingPopup(popup); setNewPopup(false); setPopupForm({ name: popup.name, event_date: popup.event_date, description: popup.description, is_active: popup.is_active }); }} className="p-1.5 text-foreground hover:bg-muted rounded transition-colors">
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
  );
};

export default AdminPopups;
