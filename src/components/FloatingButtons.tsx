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

      {/* Mobile sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden flex">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-whatsapp text-whatsapp-foreground py-3 flex items-center justify-center gap-2 font-semibold text-sm font-body"
        >
          <MessageCircle size={18} /> WhatsApp
        </a>
        <a
          href={`tel:${CALL_NUMBER}`}
          className="flex-1 bg-navy text-secondary-foreground py-3 flex items-center justify-center gap-2 font-semibold text-sm font-body"
        >
          <Phone size={18} /> Call Now
        </a>
      </div>
    </>
  );
};

export default FloatingButtons;
