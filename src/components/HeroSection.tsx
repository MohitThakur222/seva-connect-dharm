import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import heroImageDefault from '@/assets/hero-gurudwara.jpg';

interface HeroSectionProps {
  t: (key: string) => string;
}

const HeroSection = ({ t }: HeroSectionProps) => {
  const [heroImage, setHeroImage] = useState(heroImageDefault);

  useEffect(() => {
    const fetchImage = async () => {
      const { data } = await supabase
        .from('site_images')
        .select('image_url')
        .eq('image_key', 'hero')
        .single();
      if (data?.image_url) setHeroImage(data.image_url);
    };
    fetchImage();
  }, []);

  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 hero-overlay" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight"
        >
          {t('hero_title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto leading-relaxed font-body"
        >
          {t('hero_subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/donation"
            className="gradient-kesari text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 font-body"
          >
            {t('donate_now')}
          </Link>
          <Link
            to="/services"
            className="border-2 border-primary-foreground text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-foreground/10 transition-all font-body"
          >
            {t('request_service')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
