import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { vehicleApi } from "@/api/vehicle.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUploader from "@/components/ImageUploader";
import type { VehicleType, VehicleCondition } from "@/types/vehicle.types";

export default function EditVehicle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    model: "",
    price: "",
    description: "",
    contact: "",
    type: "" as VehicleType,
    condition: "" as VehicleCondition,
  });
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // ── Pre-fill form with existing vehicle data ──────────
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await vehicleApi.getById(Number(id));
        setForm({
          model: data.model,
          price: String(data.price),
          description: data.description ?? "",
          contact: data.contact,
          type: data.type,
          condition: data.condition,
        });
        setImages(data.images ?? []);
      } catch {
        setError("Failed to load vehicle.");
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [id]);

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      await vehicleApi.update(Number(id), {
        ...form,
        price: Number(form.price),
        images,
      });
      navigate(`/vehicles/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update listing.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-2xl px-6 space-y-4">
          <div className="h-8 w-40 bg-muted rounded animate-pulse" />
          <div className="bg-card border border-border rounded-2xl divide-y divide-border">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-6 space-y-3">
                <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                <div className="h-10 bg-muted rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 flex items-center gap-1.5"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Edit Listing
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update your vehicle details below.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-card border border-border rounded-2xl divide-y divide-border">
            {/* Basic Info */}
            <div className="p-6 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Basic Info
              </p>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Model
                </label>
                <Input
                  placeholder="e.g. Honda CB350"
                  value={form.model}
                  onChange={(e) => set("model", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Type
                  </label>
                  <Select
                    value={form.type}
                    onValueChange={(v) => set("type", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="motorcycle">Motorcycle</SelectItem>
                      <SelectItem value="scooter">Scooter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Condition
                  </label>
                  <Select
                    value={form.condition}
                    onValueChange={(v) => set("condition", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Pricing & Contact */}
            <div className="p-6 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Pricing & Contact
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Price (Rs.)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 250000"
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Contact
                  </label>
                  <Input
                    placeholder="e.g. 98XXXXXXXX"
                    value={form.contact}
                    onChange={(e) => set("contact", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-6 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Description
              </p>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  About the vehicle{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </label>
                <textarea
                  placeholder="Describe condition, features, history..."
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
            </div>

            {/* Images */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Images
                </p>
                <span className="text-xs text-muted-foreground">max 5</span>
              </div>

              {/* Existing images */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {images.map((url, i) => (
                    <div
                      key={i}
                      className="relative group aspect-square rounded-xl overflow-hidden border border-border bg-muted"
                    >
                      <img
                        src={url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setImages((prev) =>
                            prev.filter((_, idx) => idx !== i),
                          )
                        }
                        className="absolute top-1.5 right-1.5 w-5 h-5 bg-background/80 hover:bg-destructive hover:text-white text-foreground rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                      >
                        ×
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Upload new images */}
              {images.length < 5 && (
                <ImageUploader
                  images={images}
                  onChange={(newUrls) =>
                    setImages((prev) => [
                      ...prev,
                      ...newUrls.filter((u) => !prev.includes(u)),
                    ])
                  }
                  max={5 - images.length}
                />
              )}
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive mt-4 text-center">{error}</p>
          )}

          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
