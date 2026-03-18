import { MessageCircle, Phone } from 'lucide-react';
import { WHATSAPP_NUMBER, CALL_NUMBER } from '@/lib/constants';

const FloatingButtons = () => {
  return (
    <>
      {/* WhatsApp - Bottom Right */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%2C%20I%20would%20like%20information%20about%20your%20services.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-whatsapp text-whatsapp-foreground p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all"
        aria-label="WhatsApp"
      >
        <MessageCircle size={28} />
      </a>

      {/* Call - Bottom Left */}
      <a
        href={`tel:${CALL_NUMBER}`}
        className="fixed bottom-6 left-6 z-40 bg-navy text-secondary-foreground p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all"
        aria-label="Call Now"
      >
        <Phone size={28} />
      </a>

    </>
  );
};

export default FloatingButtons;
