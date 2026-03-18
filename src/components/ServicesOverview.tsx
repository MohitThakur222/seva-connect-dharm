import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, GraduationCap, Heart, ShieldAlert } from 'lucide-react';

interface ServicesOverviewProps {
  t: (key: string) => string;
}

const services = [
  { icon: Stethoscope, titleKey: 'medical_title', descKey: 'medical_desc', color: 'text-kesari' },
  { icon: GraduationCap, titleKey: 'education_title', descKey: 'education_desc', color: 'text-kesari' },
  { icon: Heart, titleKey: 'marriage_title', descKey: 'marriage_desc', color: 'text-kesari' },
  { icon: ShieldAlert, titleKey: 'emergency_title', descKey: 'emergency_desc', color: 'text-kesari' },
];

const ServicesOverview = ({ t }: ServicesOverviewProps) => {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
            {t('services_title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            {t('services_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.titleKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-card rounded-lg p-6 shadow-service border border-border hover:border-primary/30 transition-all"
            >
              <service.icon size={40} className={`${service.color} mb-4`} />
              <h3 className="font-display text-xl font-semibold text-navy mb-3">
                {t(service.titleKey)}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-body mb-4">
                {t(service.descKey)}
              </p>
              <Link
                to="/services"
                className="text-primary font-semibold text-sm hover:underline font-body"
              >
                {t('view_details')} →
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;
