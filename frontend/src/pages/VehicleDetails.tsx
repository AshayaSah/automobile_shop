import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import type { Vehicle } from "@/types/vehicle.types";

const typeIcons: Record<string, string> = {
  car: "🚗",
  motorcycle: "🏍️",
  scooter: "🛵",
};

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const { data } = await api.get<Vehicle>(`/vehicles/${id}`);
        setVehicle(data);
      } catch {
        setError("Vehicle not found.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-sm">
          Loading vehicle...
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
        <p className="text-4xl">🚫</p>
        <p className="text-gray-500 text-sm">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 text-sm hover:underline"
        >
          Back to listings
        </button>
      </div>
    );
  }

  const isOwner = user?.id === String(vehicle.user_id);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:text-gray-800 mb-6 flex items-center gap-1 transition-colors"
        >
          ← Back to listings
        </button>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Images */}
          <div className="relative">
            {vehicle.images && vehicle.images.length > 0 ? (
              <>
                <img
                  src={vehicle.images[activeImage]}
                  alt={vehicle.model}
                  className="w-full h-80 object-cover"
                />
                {/* Thumbnails */}
                {vehicle.images.length > 1 && (
                  <div className="flex gap-2 p-4 bg-gray-50 border-t border-gray-100 overflow-x-auto">
                    {vehicle.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          activeImage === i
                            ? "border-blue-500"
                            : "border-transparent"
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
              </>
            ) : (
              <div className="w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <span className="text-8xl opacity-30">
                  {typeIcons[vehicle.type]}
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {vehicle.model}
                </h1>
                <p className="text-sm text-gray-400 capitalize mt-1">
                  {typeIcons[vehicle.type]} {vehicle.type}
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-extrabold text-blue-600">
                  Rs. {Number(vehicle.price).toLocaleString()}
                </p>
                <span
                  className={`inline-block text-xs font-semibold px-2 py-1 rounded-full capitalize mt-1 ${
                    vehicle.condition === "new"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {vehicle.condition}
                </span>
              </div>
            </div>

            {/* Description */}
            {vehicle.description && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-700 mb-1">
                  Description
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {vehicle.description}
                </p>
              </div>
            )}

            {/* Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-t border-gray-100 mb-6">
              <div>
                <p className="text-xs text-gray-400">Type</p>
                <p className="text-sm font-medium capitalize">{vehicle.type}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Condition</p>
                <p className="text-sm font-medium capitalize">
                  {vehicle.condition}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Listed</p>
                <p className="text-sm font-medium">
                  {new Date(vehicle.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Contact + Owner Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
              <a
                href={`tel:${vehicle.contact}`}
                className="flex-1 text-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
              >
                📞 {vehicle.contact}
              </a>

              {isOwner && (
                <>
                  <button
                    onClick={() => navigate(`/vehicles/${vehicle.id}/edit`)}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm("Delete this vehicle?")) return;
                      await api.delete(`/vehicles/${vehicle.id}`);
                      navigate("/");
                    }}
                    className="px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;
