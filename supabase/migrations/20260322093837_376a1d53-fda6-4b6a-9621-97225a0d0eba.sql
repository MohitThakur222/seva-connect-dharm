
-- Create site_settings table for editable content
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL DEFAULT '{}',
  label text NOT NULL DEFAULT '',
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings
CREATE POLICY "Anyone can view site settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);

-- Only admins can modify
CREATE POLICY "Admins can insert site settings" ON public.site_settings
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site settings" ON public.site_settings
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site settings" ON public.site_settings
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Insert additional image keys
INSERT INTO public.site_images (image_key, image_url, label) VALUES
  ('header_logo', '', 'Header Logo'),
  ('footer_logo', '', 'Footer Logo')
ON CONFLICT DO NOTHING;

-- Insert default site settings
INSERT INTO public.site_settings (setting_key, setting_value, label) VALUES
  ('contact_info', '{"whatsapp_number": "918191011219", "call_number": "8191011219", "upi_id": "mohitthakur222333@oksbi", "google_maps_url": "https://maps.app.goo.gl/8iMekJgNYfPgypan6", "address": "Saiyyad Mohalla, Dehradun, Uttarakhand", "maps_embed_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3444.5!2d78.03!3d30.32!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDE5JzEyLjAiTiA3OMKwMDEnNDguMCJF!5e0!3m2!1sen!2sin!4v1"}'::jsonb, 'Contact Information'),
  ('committee_members', '[{"name": "Sardar Arvinder Singh", "role": "President"}, {"name": "Harpreet Kaur", "role": "Vice President"}, {"name": "Baljeet Singh", "role": "Secretary"}, {"name": "Gurdeep Ahluwalia", "role": "Treasurer"}, {"name": "Jasmer Singh", "role": "Member"}]'::jsonb, 'Committee Members'),
  ('testimonials', '[{"name": "Rajinder Kaur", "text": "The medical camp organized by Gurudwara Sadh Sangat Sahib saved my father''s life. Free checkups and medicines were provided with love and care.", "rating": 5}, {"name": "Mohit Sharma", "text": "My daughter received educational support for her engineering studies. The committee is truly dedicated to helping the community.", "rating": 5}, {"name": "Gurpreet Singh", "text": "The marriage hall and support services made our family function memorable. Everything was organized beautifully.", "rating": 5}]'::jsonb, 'Testimonials'),
  ('gurudwara_name', '"Gurudwara Sadh Sangat Sahib"'::jsonb, 'Gurudwara Name'),
  ('footer_text', '"Dedicated to serving humanity through selfless service, spiritual guidance, and charitable initiatives."'::jsonb, 'Footer Description')
ON CONFLICT DO NOTHING;
