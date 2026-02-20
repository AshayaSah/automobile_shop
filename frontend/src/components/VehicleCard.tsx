import { Link } from "react-router-dom";
import type { Vehicle } from "@/types/vehicle.types";

const conditionStyles = {
  new: "bg-emerald-100 text-emerald-700",
  used: "bg-amber-100 text-amber-700",
};

const typeIcons: Record<string, string> = {
  car: "🚗",
  motorcycle: "🏍️",
  scooter: "🛵",
};

const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => {
  return (
    <Link to={`/vehicles/${vehicle.id}`} className="block group">
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
        {/* Image / Placeholder */}
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          {vehicle.images && vehicle.images.length > 0 ? (
            <img
              src={vehicle.images[0]}
              alt={vehicle.model}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="text-6xl opacity-40">
              {typeIcons[vehicle.type]}
            </span>
          )}

          {/* Condition Badge */}
          <span
            className={`absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full capitalize ${conditionStyles[vehicle.condition]}`}
          >
            {vehicle.condition}
          </span>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-base font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
              {vehicle.model}
            </h3>
            <span className="text-xs text-gray-400 capitalize shrink-0 mt-0.5">
              {typeIcons[vehicle.type]} {vehicle.type}
            </span>
          </div>

          {vehicle.description && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
              {vehicle.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-extrabold text-blue-600">
              Rs. {Number(vehicle.price).toLocaleString()}
            </span>
            <span className="text-xs text-gray-400">{vehicle.contact}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VehicleCard;
