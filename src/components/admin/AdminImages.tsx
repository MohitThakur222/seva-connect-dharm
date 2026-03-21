import { useState, useRef } from 'react';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SiteImage {
  id: string;
  image_key: string;
  image_url: string;
  label: string;
}

interface AdminImagesProps {
  images: SiteImage[];
  fetchData: () => void;
}

const AdminImages = ({ images, fetchData }: AdminImagesProps) => {
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const uploadImage = async (imageKey: string, file: File) => {
    setUploading(imageKey);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${imageKey}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('site-images').getPublicUrl(filePath);
      const publicUrl = urlData.publicUrl;

      const { error: dbError } = await supabase
        .from('site_images')
        .update({ image_url: publicUrl })
        .eq('image_key', imageKey);

      if (dbError) throw dbError;

      toast.success('Image updated successfully!');
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(null);
    }
  };

  const removeImage = async (imageKey: string) => {
    const { error } = await supabase
      .from('site_images')
      .update({ image_url: '' })
      .eq('image_key', imageKey);

    if (error) toast.error('Failed to remove image');
    else { toast.success('Image removed'); fetchData(); }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground font-body">
        Upload images to change the website's hero background and about section images. Recommended size: 1920x1080 for hero, 800x600 for about.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((img) => (
          <div key={img.id} className="bg-card rounded-lg border border-border p-4 shadow-service space-y-3">
            <h3 className="font-semibold text-navy font-body flex items-center gap-2">
              <ImageIcon size={16} className="text-primary" />
              {img.label || img.image_key}
            </h3>

            {img.image_url ? (
              <div className="relative rounded-lg overflow-hidden border border-border">
                <img src={img.image_url} alt={img.label} className="w-full h-40 object-cover" />
                <button
                  onClick={() => removeImage(img.image_key)}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1.5 rounded-full hover:opacity-90 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ) : (
              <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                <p className="text-sm text-muted-foreground font-body">No image set (using default)</p>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              ref={(el) => { fileInputRefs.current[img.image_key] = el; }}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadImage(img.image_key, file);
              }}
            />

            <button
              onClick={() => fileInputRefs.current[img.image_key]?.click()}
              disabled={uploading === img.image_key}
              className="w-full bg-navy text-secondary-foreground py-2.5 rounded-lg font-semibold font-body text-sm flex items-center justify-center gap-2 hover:bg-navy-light transition-colors disabled:opacity-50"
            >
              <Upload size={16} />
              {uploading === img.image_key ? 'Uploading...' : 'Upload New Image'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminImages;
