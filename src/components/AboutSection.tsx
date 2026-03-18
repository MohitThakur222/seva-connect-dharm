import { motion } from 'framer-motion';
import aboutImage from '@/assets/about-gurudwara.jpg';

interface AboutSectionProps {
  t: (key: string) => string;
}

const AboutSection = ({ t }: AboutSectionProps) => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-6">
              {t('about_title')}
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4 font-body text-lg">
              {t('about_text')}
            </p>
            <p className="text-foreground/80 leading-relaxed font-body text-lg">
              {t('about_text2')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-xl overflow-hidden shadow-service"
          >
            <img
              src={aboutImage}
              alt="Inside Gurudwara Sadh Sangat Sahib"
              className="w-full h-80 object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
