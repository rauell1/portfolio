import { useState, useRef, useCallback } from "react";
import { Upload, Copy, ImageIcon, Check, X, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
  created_at: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminMedia() {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const configured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

  const uploadFile = useCallback(async (file: File) => {
    if (!configured) return;
    const ACCEPTED_TYPES = [
      "image/jpeg", "image/jpg", "image/png", "image/webp",
      "image/gif", "image/svg+xml", "image/avif", "image/heic",
      "image/heif", "image/tiff", "image/bmp",
    ];
    const isImage = file.type.startsWith("image/") || ACCEPTED_TYPES.includes(file.type)
      || /\.(heic|heif)$/i.test(file.name);

    if (!isImage) {
      toast({ title: "Unsupported format", description: `${file.name} is not a supported image format.`, variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 10 MB per image.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("upload_preset", UPLOAD_PRESET);
      body.append("folder", "portfolio");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body }
      );

      if (!res.ok) throw new Error("Upload failed");
      const data: CloudinaryImage = await res.json();
      setImages((prev) => [data, ...prev]);
      toast({ title: "Uploaded", description: file.name });
    } catch {
      toast({ title: "Upload failed", description: "Check your Cloudinary config.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  }, [configured, toast]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(uploadFile);
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const removeLocal = (publicId: string) => {
    setImages((prev) => prev.filter((img) => img.public_id !== publicId));
  };

  if (!configured) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-muted/40 flex items-center justify-center mx-auto">
          <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
        </div>
        <div>
          <h2 className="text-xl font-display font-bold mb-2">Cloudinary not configured</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Add your Cloudinary credentials to <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-xs">.env.local</code> to enable the media library.
          </p>
        </div>
        <div className="glass-card rounded-2xl p-6 text-left space-y-3">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest font-bold mb-4">Setup steps</p>
          {[
            "Create a free account at cloudinary.com",
            "Go to Settings → Upload → Add upload preset (set Signing Mode to Unsigned)",
            "Copy your Cloud Name from the Dashboard",
            "Add the two env vars below to .env.local and to Vercel",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
              <span className="text-muted-foreground">{step}</span>
            </div>
          ))}
          <div className="mt-4 p-3 bg-muted/40 rounded-xl font-mono text-xs space-y-1 text-muted-foreground">
            <p>VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name</p>
            <p>VITE_CLOUDINARY_UPLOAD_PRESET=your_preset_name</p>
          </div>
        </div>
        <a
          href="https://cloudinary.com/users/register/free"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
        >
          Create Cloudinary account <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-display font-bold">Media Library</h2>
          <p className="text-sm text-muted-foreground">{images.length} image{images.length !== 1 ? "s" : ""} this session</p>
        </div>
        <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} size="sm" className="gap-2">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          Upload
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml,image/avif,image/heic,image/heif,image/tiff,image/bmp,.heic,.heif,.jpg,.jpeg,.png,.webp,.gif,.svg,.avif,.tiff,.bmp"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
          dragOver ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/40 hover:bg-muted/20"
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="w-8 h-8 text-muted-foreground/40" />
            <p className="text-sm font-medium">Drop images here or click to upload</p>
            <p className="text-xs text-muted-foreground">JPG, PNG, WebP, GIF, SVG, AVIF, HEIC, TIFF · Max 10 MB</p>
          </div>
        )}
      </div>

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.public_id} className="group relative glass-card rounded-xl overflow-hidden border border-border/60">
              <div className="aspect-square bg-muted/20">
                <img
                  src={img.secure_url}
                  alt={img.public_id}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-2.5">
                <p className="text-[10px] text-muted-foreground truncate font-mono">
                  {img.public_id.split("/").pop()}
                </p>
                <p className="text-[10px] text-muted-foreground/60">{formatBytes(img.bytes)} · {img.format.toUpperCase()}</p>
              </div>
              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => copyUrl(img.secure_url, img.public_id)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  title="Copy URL"
                >
                  {copiedId === img.public_id
                    ? <Check className="w-4 h-4 text-green-400" />
                    : <Copy className="w-4 h-4 text-white" />}
                </button>
                <a
                  href={img.secure_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  title="Open original"
                >
                  <ExternalLink className="w-4 h-4 text-white" />
                </a>
                <button
                  onClick={() => removeLocal(img.public_id)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-red-500/60 transition-colors"
                  title="Remove from list"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && !uploading && (
        <p className="text-center text-sm text-muted-foreground py-4">
          Uploaded images appear here. URLs are copied directly to your clipboard for use in blog posts and case studies.
        </p>
      )}
    </div>
  );
}
