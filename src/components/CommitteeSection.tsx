import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import type { CommitteeMember } from '@/hooks/useSiteSettings';

interface CommitteeSectionProps {
  t: (key: string) => string;
  members?: CommitteeMember[];
}

const CommitteeSection = ({ t, members = [] }: CommitteeSectionProps) => {
  if (members.length === 0) return null;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-navy text-center mb-12">
          {t('committee_title')}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {members.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-full bg-kesari-light flex items-center justify-center mx-auto mb-3">
                <User size={32} className="text-kesari" />
              </div>
              <h4 className="font-display font-semibold text-navy text-sm">{member.name}</h4>
              <p className="text-muted-foreground text-xs font-body">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommitteeSection;
