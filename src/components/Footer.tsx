import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import khandaIconDefault from '@/assets/khanda-icon.png';
import type { ContactInfo } from '@/hooks/useSiteSettings';

interface FooterProps {
  t: (key: string) => string;
  contactInfo?: ContactInfo;
  gurudwaraName?: string;
  footerText?: string;
}

const Footer = ({ t, contactInfo, gurudwaraName = 'Gurudwara Sadh Sangat Sahib', footerText }: FooterProps) => {
  const [logoUrl, setLogoUrl] = useState(khandaIconDefault);

  useEffect(() => {
    const fetchLogo = async () => {
      const { data } = await supabase
        .from('site_images')
        .select('image_url')
        .eq('image_key', 'footer_logo')
        .single();
      if (data?.image_url) setLogoUrl(data.image_url);
    };
    fetchLogo();
  }, []);

  const address = contactInfo?.address || 'Saiyyad Mohalla, Dehradun, Uttarakhand';
  const callNumber = contactInfo?.call_number || '8191011219';
  const mapsUrl = contactInfo?.google_maps_url || '#';
  const mapsEmbedUrl = contactInfo?.maps_embed_url || '';
  const description = footerText || 'Dedicated to serving humanity through selfless service, spiritual guidance, and charitable initiatives.';

  return (
    <footer className="bg-navy text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logoUrl} alt="" className="h-10 w-10 brightness-0 invert" />
              <h3 className="font-display text-xl font-bold">{gurudwaraName}</h3>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">{description}</p>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm opacity-80 hover:opacity-100 transition-opacity">{t('nav_home')}</Link>
              <Link to="/services" className="text-sm opacity-80 hover:opacity-100 transition-opacity">{t('nav_services')}</Link>
              <Link to="/booking" className="text-sm opacity-80 hover:opacity-100 transition-opacity">{t('nav_booking')}</Link>
              <Link to="/donation" className="text-sm opacity-80 hover:opacity-100 transition-opacity">{t('nav_donation')}</Link>
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold mb-4">{t('nav_contact')}</h4>
            <div className="flex flex-col gap-3">
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition-opacity">
                <MapPin size={16} className="text-kesari" />
                {address}
              </a>
              <a href={`tel:${callNumber}`} className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition-opacity">
                <Phone size={16} className="text-kesari" />
                +91 {callNumber}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-8 pt-6 text-center">
          <p className="text-sm opacity-60">
            © {new Date().getFullYear()} {gurudwaraName}. All rights reserved.
          </p>
        </div>
      </div>

      {mapsEmbedUrl && (
        <div className="w-full h-64">
          <iframe
            src={mapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Gurudwara Location"
          ></iframe>
        </div>
      )}
    </footer>
  );
};

export default Footer;
