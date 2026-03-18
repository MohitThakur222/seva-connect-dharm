import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { UPCOMING_EVENT } from '@/lib/constants';

interface EventHighlightProps {
  t: (key: string) => string;
}

const EventHighlight = ({ t }: EventHighlightProps) => {
  const eventDate = new Date(UPCOMING_EVENT.date);
  const formattedDate = eventDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-navy text-center mb-12">
          {t('upcoming_events')}
        </h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto bg-kesari-light border border-primary/20 rounded-xl p-8 text-center"
        >
          <Calendar size={48} className="text-kesari mx-auto mb-4" />
          <h3 className="font-display text-2xl font-bold text-navy mb-2">
            {UPCOMING_EVENT.name}
          </h3>
          <p className="text-primary font-semibold mb-3 font-body">{formattedDate}</p>
          <p className="text-foreground/80 font-body leading-relaxed">
            {UPCOMING_EVENT.description}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default EventHighlight;
