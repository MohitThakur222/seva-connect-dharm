import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, GraduationCap, Heart, ShieldAlert, Users, Home, Car, Utensils, Baby, Briefcase, MessageCircle, Phone } from 'lucide-react';
import { WHATSAPP_NUMBER, CALL_NUMBER } from '@/lib/constants';
import { supabase } from '@/integrations/supabase/client';

interface ServicesPageProps {
  t: (key: string) => string;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Stethoscope, GraduationCap, Heart, ShieldAlert, Users, Home, Car, Utensils, Baby, Briefcase,
};

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  details: string[];
  whatsapp_msg: string;
  sort_order: number;
  is_active: boolean;
}

const ServicesPage = ({ t }: ServicesPageProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (data) setServices(data);
      setLoading(false);
    };
    fetchServices();
  }, []);

  return (
    <div className="pt-20 pb-8">
      <div className="bg-navy text-secondary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{t('services_title')}</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto font-body">{t('services_subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground font-body">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground font-body">No services available at this time.</div>
        ) : (
          <div className="space-y-8">
            {services.map((service, i) => {
              const IconComponent = iconMap[service.icon] || Stethoscope;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-card rounded-xl shadow-service border border-border overflow-hidden"
                >
                  <div className="p-6 md:p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-kesari-light p-3 rounded-lg">
                        <IconComponent size={32} className="text-kesari" />
                      </div>
                      <div className="flex-1">
                        <h2 className="font-display text-2xl font-bold text-navy mb-2">{service.title}</h2>
                        <p className="text-muted-foreground font-body">{service.description}</p>
                      </div>
                    </div>

                    {service.details.length > 0 && (
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6 ml-2">
                        {service.details.map((detail, j) => (
                          <li key={j} className="flex items-center gap-2 text-foreground/80 font-body text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(service.whatsapp_msg)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-whatsapp text-whatsapp-foreground px-6 py-3 rounded-lg font-semibold font-body flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                      >
                        <MessageCircle size={18} /> {t('whatsapp_now')}
                      </a>
                      <a
                        href={`tel:${CALL_NUMBER}`}
                        className="bg-navy text-secondary-foreground px-6 py-3 rounded-lg font-semibold font-body flex items-center justify-center gap-2 hover:bg-navy-light transition-colors"
                      >
                        <Phone size={18} /> {t('call_now')}
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
