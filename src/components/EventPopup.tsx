import { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UPCOMING_EVENT } from '@/lib/constants';
import { Link } from 'react-router-dom';

interface EventPopupProps {
  t: (key: string) => string;
}

const EventPopup = ({ t }: EventPopupProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('event-popup-seen');
    if (!seen) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem('event-popup-seen', 'true');
  };

  const eventDate = new Date(UPCOMING_EVENT.date);
  const formattedDate = eventDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative gradient-kesari rounded-2xl p-8 max-w-md w-full text-primary-foreground shadow-2xl"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1 hover:bg-primary-foreground/20 rounded-full transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <Calendar size={40} className="mb-4" />
            <h3 className="font-display text-2xl font-bold mb-2">{UPCOMING_EVENT.name}</h3>
            <p className="font-semibold mb-3 font-body opacity-90">{formattedDate}</p>
            <p className="text-sm opacity-90 leading-relaxed font-body mb-6">
              {UPCOMING_EVENT.description}
            </p>
            <Link
              to="/booking"
              onClick={handleClose}
              className="inline-block bg-navy text-secondary-foreground px-6 py-3 rounded-lg font-semibold font-body hover:bg-navy-light transition-colors"
            >
              {t('view_details')}
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventPopup;
