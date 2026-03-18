import { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
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
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const PublicLayout = ({ lang, setLang }: { lang: Language; setLang: (l: Language) => void }) => {
  const t = useTranslation(lang);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <>
      <Header lang={lang} setLang={setLang} t={t} />
      <Footer t={t} />
      <FloatingButtons />
      <EventPopup t={t} />
    </>
  );
};

const AppRoutes = ({ lang }: { lang: Language }) => {
  const t = useTranslation(lang);

  return (
    <Routes>
      <Route path="/" element={<Index t={t} />} />
      <Route path="/services" element={<ServicesPage t={t} />} />
      <Route path="/donation" element={<DonationPage t={t} />} />
      <Route path="/booking" element={<BookingPage t={t} />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  const [lang, setLang] = useState<Language>('en');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <PublicLayout lang={lang} setLang={setLang} />
          <AppRoutes lang={lang} />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
