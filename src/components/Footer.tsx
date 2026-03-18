import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { CALL_NUMBER, GOOGLE_MAPS_URL } from '@/lib/constants';
import khandaIcon from '@/assets/khanda-icon.png';

interface FooterProps {
  t: (key: string) => string;
}

const Footer = ({ t }: FooterProps) => {
  return (
    <footer className="bg-navy text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={khandaIcon} alt="" className="h-10 w-10 brightness-0 invert" />
              <h3 className="font-display text-xl font-bold">Gurudwara Sadh Sangat Sahib</h3>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Dedicated to serving humanity through selfless service, spiritual guidance, and charitable initiatives.
            </p>
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
              <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition-opacity">
                <MapPin size={16} className="text-kesari" />
                {t('footer_address')}
              </a>
              <a href={`tel:${CALL_NUMBER}`} className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition-opacity">
                <Phone size={16} className="text-kesari" />
                +91 {CALL_NUMBER}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-8 pt-6 text-center">
          <p className="text-sm opacity-60">
            © {new Date().getFullYear()} Gurudwara Sadh Sangat Sahib. All rights reserved.
          </p>
        </div>
      </div>

      {/* Google Maps Embed */}
      <div className="w-full h-64">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3444.5!2d78.03!3d30.32!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDE5JzEyLjAiTiA3OMKwMDEnNDguMCJF!5e0!3m2!1sen!2sin!4v1"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Gurudwara Location"
        ></iframe>
      </div>
    </footer>
  );
};

export default Footer;
