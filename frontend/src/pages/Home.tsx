import { useEffect, useState } from "react";
import api from "@/api/axios";
import VehicleCard from "@/components/VehicleCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Vehicle,
  VehicleType,
  VehicleCondition,
} from "@/types/vehicle.types";

type SortOption = "newest" | "price_asc" | "price_desc";

const Home = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<VehicleType | "all">("all");
  const [condFilter, setCondFilter] = useState<VehicleCondition | "all">("all");
  const [sort, setSort] = useState<SortOption>("newest");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data } = await api.get<Vehicle[]>("/vehicles");
        setVehicles(data);
      } catch {
        setError("Failed to load vehicles. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const filtered = vehicles
    .filter((v) => {
      const matchSearch =
        v.model.toLowerCase().includes(search.toLowerCase()) ||
        v.description?.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "all" || v.type === typeFilter;
      const matchCond = condFilter === "all" || v.condition === condFilter;
      return matchSearch && matchType && matchCond;
    })
    .sort((a, b) => {
      if (sort === "price_asc") return Number(a.price) - Number(b.price);
      if (sort === "price_desc") return Number(b.price) - Number(a.price);
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

  return (
    <div className="flex-1 overflow-hidden bg-background">
      {/* ── Hero Banner ───────────────────────────────── */}
      <div className="relative bg-card border-b border-border overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-56 h-56 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 py-10">
          {/* Heading */}
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
              VehicleMart
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
              Find Your Next Ride
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              Browse{" "}
              {vehicles.length > 0 ? `${vehicles.length} listed` : "listed"}{" "}
              vehicles from sellers near you
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Input
              type="text"
              placeholder="Search by model or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-4 pr-4 h-11 rounded-xl bg-background border-border text-sm"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-3 mt-4">
            <Select
              value={typeFilter}
              onValueChange={(v) => setTypeFilter(v as VehicleType | "all")}
            >
              <SelectTrigger className="w-36 h-9 rounded-lg text-sm bg-background">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="motorcycle">Motorcycle</SelectItem>
                <SelectItem value="scooter">Scooter</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={condFilter}
              onValueChange={(v) =>
                setCondFilter(v as VehicleCondition | "all")
              }
            >
              <SelectTrigger className="w-36 h-9 rounded-lg text-sm bg-background">
                <SelectValue placeholder="All Conditions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="used">Used</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sort}
              onValueChange={(v) => setSort(v as SortOption)}
            >
              <SelectTrigger className="w-44 h-9 rounded-lg text-sm bg-background">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            {/* Active filter pills */}
            {(typeFilter !== "all" || condFilter !== "all" || search) && (
              <button
                onClick={() => {
                  setSearch("");
                  setTypeFilter("all");
                  setCondFilter("all");
                  setSort("newest");
                }}
                className="h-9 px-3 rounded-lg text-xs font-medium text-destructive border border-destructive/30 hover:bg-destructive/10 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Listings ──────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl overflow-hidden border border-border animate-pulse"
              >
                <div className="h-44 bg-muted" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <p className="text-muted-foreground text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-primary text-sm hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-1">
              <span className="text-2xl">🔍</span>
            </div>
            <p className="text-foreground font-semibold text-sm">
              No vehicles found
            </p>
            <p className="text-muted-foreground text-xs max-w-xs">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
          </div>
        )}

        {/* Results */}
        {!isLoading && !error && filtered.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {filtered.length}
                </span>{" "}
                vehicle{filtered.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
