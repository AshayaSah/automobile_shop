import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function AddVehicle() {
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
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await vehicleApi.create({
        ...form,
        price: Number(form.price),
        images, // ✅ array of cloudinary URLs
      });
      navigate("/my-vehicles");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create listing.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-hidden  bg-background">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 flex items-center gap-1.5"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            List a Vehicle
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Fill in the details below to publish your listing.
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
                    required
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
                    required
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
                <span className="text-xs text-muted-foreground">
                  optional · max 5
                </span>
              </div>
              <ImageUploader images={images} onChange={setImages} max={5} />
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
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Publishing..." : "Publish Listing"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
