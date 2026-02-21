import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Car, ImageOff, Plus, Pencil, Trash2 } from "lucide-react";
import type { Vehicle } from "@/types/vehicle.types";
import { vehicleApi } from "@/api/vehicle.api";

export default function MyVehicles() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await vehicleApi.getMine();
        setVehicles(data);
      } catch {
        setError("Failed to load your vehicles.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this listing?")) return;
    setDeletingId(id);
    try {
      await vehicleApi.delete(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    } catch {
      alert("Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex-1 overflow-hidden bg-background flex flex-col">
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 flex flex-col flex-1 min-h-0 py-8">
        {/* ── Header ── fixed, never scrolls */}
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              My Vehicles
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage your active listings
              {vehicles.length > 0 && (
                <span className="ml-2 text-xs font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                  {vehicles.length}
                </span>
              )}
            </p>
          </div>
          <Button
            onClick={() => navigate("/add-vehicle")}
            size="sm"
            className="gap-1.5"
          >
            <Plus size={14} />
            Add Vehicle
          </Button>
        </div>

        <Separator className="shrink-0 mb-4" />

        {/* ── Loading skeletons ── */}
        {isLoading && (
          <div className="space-y-3 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-2xl p-4 flex gap-4 animate-pulse"
              >
                <div className="w-28 h-20 bg-muted rounded-xl shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* ── Empty state ── */}
        {!isLoading && !error && vehicles.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
              <Car size={24} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                No listings yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Add your first vehicle to get started.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => navigate("/add-vehicle")}
              className="gap-1.5"
            >
              <Plus size={14} />
              Add Vehicle
            </Button>
          </div>
        )}

        {/* ── Vehicle list — scrolls internally ── */}
        {!isLoading && !error && vehicles.length > 0 && (
          <ScrollArea className="flex-1 min-h-0 -mr-2 pr-2">
            <div className="space-y-3 pb-4">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-card border border-border rounded-2xl p-4 flex gap-4 hover:border-primary/30 hover:shadow-sm transition-all duration-200"
                >
                  {/* Thumbnail */}
                  <div className="w-28 h-20 rounded-xl overflow-hidden bg-muted shrink-0">
                    {vehicle.images && vehicle.images.length > 0 ? (
                      <img
                        src={vehicle.images[0]}
                        alt={vehicle.model}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-muted-foreground">
                        <ImageOff size={16} className="opacity-40" />
                        <span className="text-[10px]">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <Link
                          to={`/vehicles/${vehicle.id}`}
                          className="text-sm font-bold text-foreground hover:text-primary transition-colors"
                        >
                          {vehicle.model}
                        </Link>
                        <p className="text-xs text-muted-foreground capitalize mt-0.5">
                          {vehicle.type}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          variant={
                            vehicle.condition === "new"
                              ? "default"
                              : "secondary"
                          }
                          className="capitalize text-[11px]"
                        >
                          {vehicle.condition}
                        </Badge>
                        <span className="text-sm font-extrabold text-primary">
                          Rs. {Number(vehicle.price).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {vehicle.description && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                        {vehicle.description}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1.5"
                        onClick={() => navigate(`/vehicles/${vehicle.id}/edit`)}
                      >
                        <Pencil size={11} />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={deletingId === vehicle.id}
                        onClick={() => handleDelete(vehicle.id)}
                      >
                        <Trash2 size={11} />
                        {deletingId === vehicle.id ? "Deleting…" : "Delete"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
