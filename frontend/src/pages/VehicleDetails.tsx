import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import type { Vehicle } from "@/types/vehicle.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { vehicleApi } from "@/api/vehicle.api";

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await vehicleApi.getById(Number(id));
        setVehicle(data);
      } catch {
        setError("Vehicle not found.");
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [id]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, activeImage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 w-full max-w-5xl px-6">
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 h-80 bg-muted rounded-2xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-40 bg-muted rounded-2xl animate-pulse" />
              <div className="h-40 bg-muted rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-sm">{error}</p>
        <Button variant="outline" onClick={() => navigate("/")}>
          Back to listings
        </Button>
      </div>
    );
  }

  const isOwner = user?.id === String(vehicle.user_id);
  const images = vehicle.images ?? [];

  const prev = () =>
    setActiveImage((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () =>
    setActiveImage((i) => (i === images.length - 1 ? 0 : i + 1));

  const specs = [
    { label: "Type", value: vehicle.type },
    { label: "Condition", value: vehicle.condition },
    { label: "Contact", value: vehicle.contact },
    {
      label: "Listed",
      value: new Date(vehicle.created_at).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ── Lightbox ─────────────────────────────────── */}
      {lightbox && images.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          {/* Image */}
          <img
            src={images[activeImage]}
            alt=""
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Close */}
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg transition-colors"
          >
            ×
          </button>

          {/* Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition-colors"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition-colors"
              >
                ›
              </button>
            </>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-xs">
            {activeImage + 1} / {images.length}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 px-4 overflow-x-auto max-w-[90vw]">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImage(i);
                  }}
                  className={`shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                    activeImage === i ? "border-white" : "border-white/20"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 flex items-center gap-1.5"
        >
          ← Back to listings
        </button>

        {/* Title Row */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                {vehicle.model}
              </h1>
              <p className="text-muted-foreground text-sm mt-1 capitalize">
                {vehicle.type}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-extrabold text-primary">
                Rs. {Number(vehicle.price).toLocaleString()}
              </p>
              <Badge
                variant={vehicle.condition === "new" ? "default" : "secondary"}
                className="mt-1 capitalize"
              >
                {vehicle.condition}
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-3">
            {/* Hero Image */}
            <div
              className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-muted group cursor-zoom-in"
              onClick={() => images.length > 0 && setLightbox(true)}
            >
              {images.length > 0 ? (
                <>
                  <img
                    src={images[activeImage]}
                    alt={vehicle.model}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Arrows on hero */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prev();
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border text-foreground flex items-center justify-center text-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                      >
                        ‹
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          next();
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border text-foreground flex items-center justify-center text-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                      >
                        ›
                      </button>
                    </>
                  )}

                  {/* Counter top-right */}
                  {images.length > 1 && (
                    <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm border border-border text-foreground text-xs font-medium px-2.5 py-1 rounded-full">
                      {activeImage + 1} / {images.length}
                    </div>
                  )}

                  {/* Expand hint */}
                  <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm border border-border text-foreground text-[11px] font-medium px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to expand
                  </div>

                  {/* Dot indicators */}
                  {images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImage(i);
                          }}
                          className={`h-1.5 rounded-full transition-all duration-200 ${
                            i === activeImage
                              ? "w-4 bg-white"
                              : "w-1.5 bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">
                    No images available
                  </p>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                      activeImage === i
                        ? "border-primary"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Description */}
            {vehicle.description && (
              <div className="bg-card border border-border rounded-2xl p-5">
                <p className="text-sm font-semibold text-foreground mb-2">
                  About this vehicle
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {vehicle.description}
                </p>
              </div>
            )}
          </div>

          {/* ── Right ────────────────────────────────── */}
          <div className="space-y-4">
            {/* Specs */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <p className="text-sm font-semibold text-foreground mb-4">
                Vehicle Details
              </p>
              <div className="grid grid-cols-2 gap-4">
                {specs.map(({ label, value }) => (
                  <div key={label} className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium text-foreground capitalize">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <p className="text-sm font-semibold text-foreground mb-1">
                Seller Contact
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Reach out directly to arrange a viewing
              </p>
              <Separator className="mb-4" />
              <a href={`tel:${vehicle.contact}`} className="block w-full">
                <Button className="w-full" size="sm">
                  Call {vehicle.contact}
                </Button>
              </a>
            </div>

            {/* Owner Actions */}
            {isOwner && (
              <div className="bg-card border border-border rounded-2xl p-5">
                <p className="text-sm font-semibold text-foreground mb-4">
                  Manage Listing
                </p>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/vehicles/${vehicle.id}/edit`)}
                  >
                    Edit Listing
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={async () => {
                      if (!confirm("Delete this vehicle?")) return;
                      await api.delete(`/vehicles/${vehicle.id}`);
                      navigate("/");
                    }}
                  >
                    Delete Listing
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;
