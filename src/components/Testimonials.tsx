import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface TestimonialsProps {
  t: (key: string) => string;
}

const testimonials = [
  {
    name: 'Rajinder Kaur',
    text: 'The medical camp organized by Gurudwara Sadh Sangat Sahib saved my father\'s life. Free checkups and medicines were provided with love and care.',
    rating: 5,
  },
  {
    name: 'Mohit Sharma',
    text: 'My daughter received educational support for her engineering studies. The committee is truly dedicated to helping the community.',
    rating: 5,
  },
  {
    name: 'Gurpreet Singh',
    text: 'The marriage hall and support services made our family function memorable. Everything was organized beautifully.',
    rating: 5,
  },
];

const Testimonials = ({ t }: TestimonialsProps) => {
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
