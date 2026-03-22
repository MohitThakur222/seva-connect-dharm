import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Shield, Heart, GraduationCap, Stethoscope, HandHeart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';
import type { ContactInfo } from '@/hooks/useSiteSettings';

type DonationCategory = Database['public']['Enums']['donation_category'];

interface DonationPageProps {
  t: (key: string) => string;
  contactInfo?: ContactInfo;
}

const categories: { icon: typeof Stethoscope; key: string; value: DonationCategory }[] = [
  { icon: Stethoscope, key: 'medical_camp', value: 'medical_camp' },
  { icon: GraduationCap, key: 'student_help', value: 'student_help' },
  { icon: Heart, key: 'marriage_support', value: 'marriage_support' },
  { icon: HandHeart, key: 'general_seva', value: 'general_seva' },
];

const DonationPage = ({ t, contactInfo }: DonationPageProps) => {
  const upiId = contactInfo?.upi_id || 'mohitthakur222333@oksbi';
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<DonationCategory | null>(null);
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDonationRecord = async () => {
    if (!selectedCategory) {
      toast.error('Please select a donation category');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('donations').insert({
        category: selectedCategory,
        donor_name: donorName.trim() || null,
        donor_phone: donorPhone.trim() || null,
        amount: amount ? parseFloat(amount) : null,
      });

      if (error) throw error;

      toast.success('Donation recorded! Thank you for your generosity.');
      setDonorName('');
      setDonorPhone('');
      setAmount('');
      setSelectedCategory(null);
    } catch (err) {
      console.error('Donation error:', err);
      toast.error('Failed to record donation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20 pb-8">
      <div className="bg-navy text-secondary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{t('donation_title')}</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto font-body">{t('donation_subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto bg-card rounded-xl shadow-service border border-border p-8 text-center mb-12"
        >
          <h2 className="font-display text-2xl font-bold text-navy mb-6">Donate via UPI</h2>
          <div className="bg-muted rounded-lg p-4 flex items-center justify-between gap-3 mb-4">
            <span className="font-mono text-foreground font-semibold text-sm break-all">{upiId}</span>
            <button
              onClick={handleCopy}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-body text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity flex-shrink-0"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? t('copied') : t('copy_upi')}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 bg-kesari-light text-accent-foreground px-4 py-2 rounded-lg">
            <Shield size={18} className="text-kesari" />
            <span className="text-sm font-semibold font-body">{t('tax_benefit')}</span>
          </div>
        </motion.div>

        <h2 className="font-display text-2xl font-bold text-navy text-center mb-8">Donation Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedCategory(cat.value)}
              className={`bg-card rounded-xl shadow-service border p-6 text-center cursor-pointer transition-all ${
                selectedCategory === cat.value ? 'border-primary ring-2 ring-primary/30' : 'border-border hover:border-primary/30'
              }`}
            >
              <div className="bg-kesari-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <cat.icon size={28} className="text-kesari" />
              </div>
              <h3 className="font-display font-semibold text-navy">{t(cat.key)}</h3>
            </motion.div>
          ))}
        </div>

        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto bg-card rounded-xl shadow-service border border-border p-6 space-y-4 mb-12"
          >
            <h3 className="font-display text-lg font-bold text-navy text-center">Record Your Donation</h3>
            <input type="text" placeholder="Your Name (optional)" value={donorName} onChange={(e) => setDonorName(e.target.value)}
              className="w-full border border-input rounded-lg px-4 py-3 bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-primary/30 outline-none" maxLength={100} />
            <input type="tel" placeholder="Phone (optional)" value={donorPhone} onChange={(e) => setDonorPhone(e.target.value)}
              className="w-full border border-input rounded-lg px-4 py-3 bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-primary/30 outline-none" maxLength={15} />
            <input type="number" placeholder="Amount (optional)" value={amount} onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-input rounded-lg px-4 py-3 bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-primary/30 outline-none" />
            <button onClick={handleDonationRecord} disabled={submitting}
              className="w-full gradient-kesari text-primary-foreground py-3 rounded-lg font-semibold font-body hover:opacity-90 transition-opacity disabled:opacity-50">
              {submitting ? 'Recording...' : 'Record Donation'}
            </button>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="max-w-2xl mx-auto bg-muted rounded-xl p-8 text-center">
          <h3 className="font-display text-xl font-bold text-navy mb-3">Transparency & Trust</h3>
          <p className="text-muted-foreground font-body leading-relaxed">
            All donations are utilized transparently for community welfare. Detailed accounts are maintained
            and shared with the community regularly. Your contribution is eligible for 80G tax benefits under
            the Income Tax Act.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default DonationPage;
