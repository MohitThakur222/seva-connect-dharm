import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Save, Plus, Trash2, Users, Phone, MessageSquare, Building } from 'lucide-react';

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  label: string;
}

interface AdminContentProps {
  settings: SiteSetting[];
  fetchData: () => void;
}

const AdminContent = ({ settings, fetchData }: AdminContentProps) => {
  const [editingValues, setEditingValues] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    const values: Record<string, any> = {};
    settings.forEach((s) => {
      values[s.setting_key] = s.setting_value;
    });
    setEditingValues(values);
  }, [settings]);

  const saveSetting = async (key: string) => {
    setSaving(key);
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ setting_value: editingValues[key], updated_at: new Date().toISOString() })
        .eq('setting_key', key);
      if (error) throw error;
      toast.success('Saved successfully!');
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Save failed');
    } finally {
      setSaving(null);
    }
  };

  const updateValue = (key: string, value: any) => {
    setEditingValues((prev) => ({ ...prev, [key]: value }));
  };

  const contactInfo = editingValues['contact_info'] || {};
  const committeeMembers = editingValues['committee_members'] || [];
  const testimonials = editingValues['testimonials'] || [];
  const gurudwaraName = editingValues['gurudwara_name'] || '';
  const footerText = editingValues['footer_text'] || '';

  const addCommitteeMember = () => {
    updateValue('committee_members', [...committeeMembers, { name: '', role: '' }]);
  };

  const removeCommitteeMember = (index: number) => {
    updateValue('committee_members', committeeMembers.filter((_: any, i: number) => i !== index));
  };

  const updateCommitteeMember = (index: number, field: string, value: string) => {
    const updated = [...committeeMembers];
    updated[index] = { ...updated[index], [field]: value };
    updateValue('committee_members', updated);
  };

  const addTestimonial = () => {
    updateValue('testimonials', [...testimonials, { name: '', text: '', rating: 5 }]);
  };

  const removeTestimonial = (index: number) => {
    updateValue('testimonials', testimonials.filter((_: any, i: number) => i !== index));
  };

  const updateTestimonial = (index: number, field: string, value: any) => {
    const updated = [...testimonials];
    updated[index] = { ...updated[index], [field]: value };
    updateValue('testimonials', updated);
  };

  return (
    <div className="space-y-8">
      {/* Gurudwara Name & Footer Text */}
      <div className="bg-card rounded-lg border border-border p-5 shadow-service space-y-4">
        <h3 className="font-semibold text-navy font-body flex items-center gap-2">
          <Building size={18} className="text-primary" />
          General Info
        </h3>
        <div>
          <label className="text-sm font-medium text-foreground font-body">Gurudwara Name</label>
          <input
            type="text"
            value={gurudwaraName}
            onChange={(e) => updateValue('gurudwara_name', e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm font-body bg-background"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground font-body">Footer Description</label>
          <textarea
            value={footerText}
            onChange={(e) => updateValue('footer_text', e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm font-body bg-background"
            rows={2}
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => saveSetting('gurudwara_name')} disabled={saving === 'gurudwara_name'}
            className="bg-navy text-secondary-foreground px-4 py-2 rounded-lg font-semibold font-body text-sm flex items-center gap-2 hover:bg-navy-light transition-colors disabled:opacity-50">
            <Save size={14} /> {saving === 'gurudwara_name' ? 'Saving...' : 'Save Name'}
          </button>
          <button onClick={() => saveSetting('footer_text')} disabled={saving === 'footer_text'}
            className="bg-navy text-secondary-foreground px-4 py-2 rounded-lg font-semibold font-body text-sm flex items-center gap-2 hover:bg-navy-light transition-colors disabled:opacity-50">
            <Save size={14} /> {saving === 'footer_text' ? 'Saving...' : 'Save Footer Text'}
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-card rounded-lg border border-border p-5 shadow-service space-y-4">
        <h3 className="font-semibold text-navy font-body flex items-center gap-2">
          <Phone size={18} className="text-primary" />
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'whatsapp_number', label: 'WhatsApp Number' },
            { key: 'call_number', label: 'Call Number' },
            { key: 'upi_id', label: 'UPI ID' },
            { key: 'address', label: 'Address' },
            { key: 'google_maps_url', label: 'Google Maps URL' },
            { key: 'maps_embed_url', label: 'Maps Embed URL' },
          ].map((field) => (
            <div key={field.key}>
              <label className="text-sm font-medium text-foreground font-body">{field.label}</label>
              <input
                type="text"
                value={contactInfo[field.key] || ''}
                onChange={(e) => updateValue('contact_info', { ...contactInfo, [field.key]: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm font-body bg-background"
              />
            </div>
          ))}
        </div>
        <button onClick={() => saveSetting('contact_info')} disabled={saving === 'contact_info'}
          className="bg-navy text-secondary-foreground px-4 py-2 rounded-lg font-semibold font-body text-sm flex items-center gap-2 hover:bg-navy-light transition-colors disabled:opacity-50">
          <Save size={14} /> {saving === 'contact_info' ? 'Saving...' : 'Save Contact Info'}
        </button>
      </div>

      {/* Committee Members */}
      <div className="bg-card rounded-lg border border-border p-5 shadow-service space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-navy font-body flex items-center gap-2">
            <Users size={18} className="text-primary" />
            Committee Members
          </h3>
          <button onClick={addCommitteeMember}
            className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-body font-medium flex items-center gap-1">
            <Plus size={14} /> Add Member
          </button>
        </div>
        <div className="space-y-3">
          {committeeMembers.map((member: any, i: number) => (
            <div key={i} className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="Name"
                value={member.name}
                onChange={(e) => updateCommitteeMember(i, 'name', e.target.value)}
                className="flex-1 px-3 py-2 border border-border rounded-lg text-sm font-body bg-background"
              />
              <input
                type="text"
                placeholder="Role"
                value={member.role}
                onChange={(e) => updateCommitteeMember(i, 'role', e.target.value)}
                className="flex-1 px-3 py-2 border border-border rounded-lg text-sm font-body bg-background"
              />
              <button onClick={() => removeCommitteeMember(i)} className="text-destructive hover:opacity-70 p-1">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => saveSetting('committee_members')} disabled={saving === 'committee_members'}
          className="bg-navy text-secondary-foreground px-4 py-2 rounded-lg font-semibold font-body text-sm flex items-center gap-2 hover:bg-navy-light transition-colors disabled:opacity-50">
          <Save size={14} /> {saving === 'committee_members' ? 'Saving...' : 'Save Members'}
        </button>
      </div>

      {/* Testimonials */}
      <div className="bg-card rounded-lg border border-border p-5 shadow-service space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-navy font-body flex items-center gap-2">
            <MessageSquare size={18} className="text-primary" />
            Testimonials
          </h3>
          <button onClick={addTestimonial}
            className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-body font-medium flex items-center gap-1">
            <Plus size={14} /> Add Testimonial
          </button>
        </div>
        <div className="space-y-4">
          {testimonials.map((t: any, i: number) => (
            <div key={i} className="border border-border rounded-lg p-4 space-y-3 bg-muted/30">
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Person Name"
                  value={t.name}
                  onChange={(e) => updateTestimonial(i, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 border border-border rounded-lg text-sm font-body bg-background"
                />
                <select
                  value={t.rating}
                  onChange={(e) => updateTestimonial(i, 'rating', Number(e.target.value))}
                  className="px-3 py-2 border border-border rounded-lg text-sm font-body bg-background"
                >
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>{r} ★</option>
                  ))}
                </select>
                <button onClick={() => removeTestimonial(i)} className="text-destructive hover:opacity-70 p-1">
                  <Trash2 size={16} />
                </button>
              </div>
              <textarea
                placeholder="Testimonial text..."
                value={t.text}
                onChange={(e) => updateTestimonial(i, 'text', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm font-body bg-background"
                rows={2}
              />
            </div>
          ))}
        </div>
        <button onClick={() => saveSetting('testimonials')} disabled={saving === 'testimonials'}
          className="bg-navy text-secondary-foreground px-4 py-2 rounded-lg font-semibold font-body text-sm flex items-center gap-2 hover:bg-navy-light transition-colors disabled:opacity-50">
          <Save size={14} /> {saving === 'testimonials' ? 'Saving...' : 'Save Testimonials'}
        </button>
      </div>
    </div>
  );
};

export default AdminContent;
