import { MessageCircle, Phone } from 'lucide-react';
import type { ContactInfo } from '@/hooks/useSiteSettings';

interface FloatingButtonsProps {
  contactInfo?: ContactInfo;
}

const FloatingButtons = ({ contactInfo }: FloatingButtonsProps) => {
  const whatsappNumber = contactInfo?.whatsapp_number || '918191011219';
  const callNumber = contactInfo?.call_number || '8191011219';

  return (
    <>
      <a
        href={`https://wa.me/${whatsappNumber}?text=Hello%2C%20I%20would%20like%20information%20about%20your%20services.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-whatsapp text-whatsapp-foreground p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all"
        aria-label="WhatsApp"
      >
        <MessageCircle size={28} />
      </a>

      <a
        href={`tel:${callNumber}`}
        className="fixed bottom-6 left-6 z-40 bg-navy text-secondary-foreground p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all"
        aria-label="Call Now"
      >
        <Phone size={28} />
      </a>
    </>
  );
};

export default FloatingButtons;
