import { motion } from 'framer-motion';
import { Stethoscope, GraduationCap, Heart, ShieldAlert, MessageCircle, Phone, FileText, Calendar } from 'lucide-react';
import { WHATSAPP_NUMBER, CALL_NUMBER } from '@/lib/constants';

interface ServicesPageProps {
  t: (key: string) => string;
}

const serviceCategories = [
  {
    icon: Stethoscope,
    titleKey: 'medical_title',
    descKey: 'medical_desc',
    details: [
      'Free medical camps with qualified doctors',
      'Health checkups & diagnostics',
      'Free medicine distribution',
      'Specialist consultations',
    ],
    actionKey: 'register',
    whatsappMsg: 'Hello, I would like information about Medical Services.',
  },
  {
    icon: GraduationCap,
    titleKey: 'education_title',
    descKey: 'education_desc',
    details: [
      'Student fee assistance program',
      'Scholarship for meritorious students',
      'Required documents: Marksheet, Income Certificate, Aadhar Card',
      'Educational material distribution',
    ],
    actionKey: 'apply_now',
    whatsappMsg: 'Hello, I would like information about Educational Support.',
  },
  {
    icon: Heart,
    titleKey: 'marriage_title',
    descKey: 'marriage_desc',
    details: [
      'Financial help for girl marriages',
      'Marriage hall booking',
      'Event space for community functions',
      'Catering & decoration support',
    ],
    actionKey: 'book_now',
    whatsappMsg: 'Hello, I would like information about Marriage & Social Support.',
  },
  {
    icon: ShieldAlert,
    titleKey: 'emergency_title',
    descKey: 'emergency_desc',
    details: [
      'Dead body freezer service (24/7)',
      'Rajai & Gadda service for events',
      'Bartan (utensils) service',
      'Emergency community support',
    ],
    actionKey: 'call_now',
    whatsappMsg: 'Hello, I need Emergency & Community Support.',
  },
];

const ServicesPage = ({ t }: ServicesPageProps) => {
  return (
    <div className="pt-20 pb-8">
      <div className="bg-navy text-secondary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{t('services_title')}</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto font-body">{t('services_subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {serviceCategories.map((service, i) => (
            <motion.div
              key={service.titleKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card rounded-xl shadow-service border border-border overflow-hidden"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-kesari-light p-3 rounded-lg">
                    <service.icon size={32} className="text-kesari" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-2xl font-bold text-navy mb-2">
                      {t(service.titleKey)}
                    </h2>
                    <p className="text-muted-foreground font-body">{t(service.descKey)}</p>
                  </div>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6 ml-2">
                  {service.details.map((detail, j) => (
                    <li key={j} className="flex items-center gap-2 text-foreground/80 font-body text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(service.whatsappMsg)}`}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
