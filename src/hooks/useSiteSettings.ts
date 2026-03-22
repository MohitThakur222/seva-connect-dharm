import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ContactInfo {
  whatsapp_number: string;
  call_number: string;
  upi_id: string;
  google_maps_url: string;
  address: string;
  maps_embed_url: string;
}

export interface CommitteeMember {
  name: string;
  role: string;
}

export interface Testimonial {
  name: string;
  text: string;
  rating: number;
}

const defaultContact: ContactInfo = {
  whatsapp_number: '918191011219',
  call_number: '8191011219',
  upi_id: 'mohitthakur222333@oksbi',
  google_maps_url: 'https://maps.app.goo.gl/8iMekJgNYfPgypan6',
  address: 'Saiyyad Mohalla, Dehradun, Uttarakhand',
  maps_embed_url: '',
};

export function useSiteSettings() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContact);
  const [committeeMembers, setCommitteeMembers] = useState<CommitteeMember[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [gurudwaraName, setGurudwaraName] = useState('Gurudwara Sadh Sangat Sahib');
  const [footerText, setFooterText] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('site_settings').select('setting_key, setting_value');
      if (data) {
        data.forEach((row: any) => {
          switch (row.setting_key) {
            case 'contact_info':
              setContactInfo({ ...defaultContact, ...row.setting_value });
              break;
            case 'committee_members':
              setCommitteeMembers(row.setting_value);
              break;
            case 'testimonials':
              setTestimonials(row.setting_value);
              break;
            case 'gurudwara_name':
              setGurudwaraName(row.setting_value);
              break;
            case 'footer_text':
              setFooterText(row.setting_value);
              break;
          }
        });
      }
      setLoaded(true);
    };
    fetch();
  }, []);

  return { contactInfo, committeeMembers, testimonials, gurudwaraName, footerText, loaded };
}
