import { useState, useRef } from "react";

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

interface Props {
  images: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

interface Preview {
  id: number;
  localUrl: string;
  status: "uploading" | "done" | "error";
  url?: string;
}

let uid = 0; // simple unique id for each preview

export default function ImageUploader({ onChange, max = 5 }: Props) {
  const [previews, setPreviews] = useState<Preview[]>([]);
  const uploadedUrls = useRef<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadOne = async (file: File, id: number) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error?.message || "Upload failed");

      const url = data.secure_url as string;

      // ✅ Update this specific preview by id
      setPreviews((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "done", url } : p)),
      );

      // ✅ Accumulate URL and notify parent
      uploadedUrls.current.push(url);
      onChange([...uploadedUrls.current]);
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      setPreviews((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "error" } : p)),
      );
    }
  };

  const handleFiles = (files: FileList) => {
    const incoming = Array.from(files).slice(0, max - previews.length);
    if (!incoming.length) return;

    // Create previews first
    const newPreviews: Preview[] = incoming.map((file) => ({
      id: ++uid,
      localUrl: URL.createObjectURL(file),
      status: "uploading",
    }));

    setPreviews((prev) => [...prev, ...newPreviews]);

    // Upload each independently
    incoming.forEach((file, i) => uploadOne(file, newPreviews[i].id));
  };

  const handleRemove = (id: number) => {
    setPreviews((prev) => {
      const removed = prev.find((p) => p.id === id);
      if (removed?.url) {
        uploadedUrls.current = uploadedUrls.current.filter(
          (u) => u !== removed.url,
        );
        onChange([...uploadedUrls.current]);
      }
      URL.revokeObjectURL(removed?.localUrl ?? "");
      return prev.filter((p) => p.id !== id);
    });
  };

  const canAdd = previews.length < max;

  return (
    <div className="space-y-3">
      {canAdd && (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={(e) => {
            e.preventDefault();
            e.dataTransfer.files && handleFiles(e.dataTransfer.files);
          }}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-8 text-center cursor-pointer transition-colors bg-muted/30 hover:bg-muted/50"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <p className="text-sm font-medium text-foreground">
            Drop images here or{" "}
            <span className="text-primary underline underline-offset-2">
              browse
            </span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PNG, JPG, WEBP · {previews.length}/{max} uploaded
          </p>
        </div>
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {previews.map((preview) => (
            <div
              key={preview.id}
              className="relative group aspect-square rounded-xl overflow-hidden bg-muted border border-border"
            >
              <img
                src={preview.localUrl}
                alt=""
                className="w-full h-full object-cover"
              />

              {preview.status === "uploading" && (
                <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {preview.status === "error" && (
                <div className="absolute inset-0 bg-destructive/60 flex flex-col items-center justify-center gap-1">
                  <p className="text-white text-[10px] font-semibold">Failed</p>
                </div>
              )}

              {preview.status === "done" && (
                <div className="absolute top-1.5 left-1.5">
                  <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    ✓
                  </span>
                </div>
              )}

              {preview.status !== "uploading" && (
                <button
                  type="button"
                  onClick={() => handleRemove(preview.id)}
                  className="absolute top-1.5 right-1.5 w-5 h-5 bg-background/80 hover:bg-destructive hover:text-white text-foreground rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
