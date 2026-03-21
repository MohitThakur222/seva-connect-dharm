import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, GraduationCap, Heart, ShieldAlert, Users, Home, Car, Utensils, Baby, Briefcase } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ServicesOverviewProps {
  t: (key: string) => string;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Stethoscope, GraduationCap, Heart, ShieldAlert, Users, Home, Car, Utensils, Baby, Briefcase,
};

const ServicesOverview = ({ t }: ServicesOverviewProps) => {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('services')
        .select('id, title, description, icon')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .limit(4);
      if (data) setServices(data);
    };
    fetch();
  }, []);

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
          {services.map((service, i) => {
            const IconComponent = iconMap[service.icon] || Stethoscope;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-card rounded-lg p-6 shadow-service border border-border hover:border-primary/30 transition-all"
              >
                <IconComponent size={40} className="text-kesari mb-4" />
                <h3 className="font-display text-xl font-semibold text-navy mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-body mb-4">
                  {service.description}
                </p>
                <Link
                  to="/services"
                  className="text-primary font-semibold text-sm hover:underline font-body"
                >
                  {t('view_details')} →
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;
