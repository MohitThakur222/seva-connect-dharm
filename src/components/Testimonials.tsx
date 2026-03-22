import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import type { Testimonial } from '@/hooks/useSiteSettings';

interface TestimonialsProps {
  t: (key: string) => string;
  testimonials?: Testimonial[];
}

const Testimonials = ({ t, testimonials = [] }: TestimonialsProps) => {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-navy text-center mb-12">
          {t('testimonials_title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-card rounded-lg p-6 shadow-service border border-border"
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: item.rating }).map((_, j) => (
                  <Star key={j} size={16} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground/80 font-body text-sm leading-relaxed mb-4 italic">
                "{item.text}"
              </p>
              <p className="font-display font-semibold text-navy">{item.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
