import { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Language, useTranslation } from '@/lib/i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import EventPopup from '@/components/EventPopup';
import Index from "./pages/Index";
import ServicesPage from "./pages/Services";
import DonationPage from "./pages/Donation";
import BookingPage from "./pages/Booking";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [lang, setLang] = useState<Language>('en');
  const t = useTranslation(lang);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <Header lang={lang} setLang={setLang} t={t} />
          <Routes>
            <Route path="/" element={<Index t={t} />} />
            <Route path="/services" element={<ServicesPage t={t} />} />
            <Route path="/donation" element={<DonationPage t={t} />} />
            <Route path="/booking" element={<BookingPage t={t} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer t={t} />
          <FloatingButtons />
          <EventPopup t={t} />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
