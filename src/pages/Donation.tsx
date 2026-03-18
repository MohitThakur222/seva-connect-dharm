import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Shield, Heart, GraduationCap, Stethoscope, HandHeart } from 'lucide-react';
import { UPI_ID } from '@/lib/constants';

interface DonationPageProps {
  t: (key: string) => string;
}

const categories = [
  { icon: Stethoscope, key: 'medical_camp' },
  { icon: GraduationCap, key: 'student_help' },
  { icon: Heart, key: 'marriage_support' },
  { icon: HandHeart, key: 'general_seva' },
];

const DonationPage = ({ t }: DonationPageProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-20 pb-20 md:pb-8">
      <div className="bg-navy text-secondary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{t('donation_title')}</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto font-body">{t('donation_subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* UPI Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto bg-card rounded-xl shadow-service border border-border p-8 text-center mb-12"
        >
          <h2 className="font-display text-2xl font-bold text-navy mb-6">Donate via UPI</h2>
          <div className="bg-muted rounded-lg p-4 flex items-center justify-between gap-3 mb-4">
            <span className="font-mono text-foreground font-semibold text-sm break-all">{UPI_ID}</span>
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

        {/* Donation Categories */}
        <h2 className="font-display text-2xl font-bold text-navy text-center mb-8">Donation Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-card rounded-xl shadow-service border border-border p-6 text-center cursor-pointer hover:border-primary/30 transition-all"
            >
              <div className="bg-kesari-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <cat.icon size={28} className="text-kesari" />
              </div>
              <h3 className="font-display font-semibold text-navy">{t(cat.key)}</h3>
            </motion.div>
          ))}
        </div>

        {/* Transparency */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mt-12 bg-muted rounded-xl p-8 text-center"
        >
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
