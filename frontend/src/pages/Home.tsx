import { useEffect, useState } from "react";
import api from "@/api/axios";
import VehicleCard from "@/components/VehicleCard";
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

  // ── Derived filtered + sorted list ──────────────────────
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Available Vehicles
        </h1>

        {/* Search + Filters */}
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search by model or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value as VehicleType | "all")
            }
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="car">🚗 Car</option>
            <option value="motorcycle">🏍️ Motorcycle</option>
            <option value="scooter">🛵 Scooter</option>
          </select>

          <select
            value={condFilter}
            onChange={(e) =>
              setCondFilter(e.target.value as VehicleCondition | "all")
            }
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Conditions</option>
            <option value="new">New</option>
            <option value="used">Used</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse"
              >
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {!isLoading && !error && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm">No vehicles match your search.</p>
          </div>
        )}

        {!isLoading && !error && filtered.length > 0 && (
          <>
            <p className="text-sm text-gray-400 mb-4">
              {filtered.length} vehicle{filtered.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
