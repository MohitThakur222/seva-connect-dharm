
-- Services table for dynamic service management
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'Stethoscope',
  details text[] NOT NULL DEFAULT '{}',
  whatsapp_msg text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active services" ON public.services
  FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE POLICY "Admins can view all services" ON public.services
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert services" ON public.services
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update services" ON public.services
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete services" ON public.services
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Site images table for dynamic image management
CREATE TABLE public.site_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_key text NOT NULL UNIQUE,
  image_url text NOT NULL,
  label text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site images" ON public.site_images
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can insert site images" ON public.site_images
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site images" ON public.site_images
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site images" ON public.site_images
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Storage bucket for site images
INSERT INTO storage.buckets (id, name, public) VALUES ('site-images', 'site-images', true);

-- Storage policies
CREATE POLICY "Anyone can view site images storage" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'site-images');

CREATE POLICY "Admins can upload site images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site images storage" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site images storage" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));

-- Seed default services
INSERT INTO public.services (title, description, icon, details, whatsapp_msg, sort_order) VALUES
('Medical Services', 'Free medical camps and health services for the community', 'Stethoscope', ARRAY['Free medical camps with qualified doctors', 'Health checkups & diagnostics', 'Free medicine distribution', 'Specialist consultations'], 'Hello, I would like information about Medical Services.', 1),
('Educational Support', 'Supporting students with scholarships and educational resources', 'GraduationCap', ARRAY['Student fee assistance program', 'Scholarship for meritorious students', 'Required documents: Marksheet, Income Certificate, Aadhar Card', 'Educational material distribution'], 'Hello, I would like information about Educational Support.', 2),
('Marriage & Social Support', 'Helping families with marriage and social events', 'Heart', ARRAY['Financial help for girl marriages', 'Marriage hall booking', 'Event space for community functions', 'Catering & decoration support'], 'Hello, I would like information about Marriage & Social Support.', 3),
('Emergency & Community Support', 'Round-the-clock emergency community services', 'ShieldAlert', ARRAY['Dead body freezer service (24/7)', 'Rajai & Gadda service for events', 'Bartan (utensils) service', 'Emergency community support'], 'Hello, I need Emergency & Community Support.', 4);

-- Seed default site images
INSERT INTO public.site_images (image_key, image_url, label) VALUES
('hero', '', 'Hero Background'),
('about', '', 'About Section');

-- Triggers for updated_at
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_images_updated_at BEFORE UPDATE ON public.site_images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
