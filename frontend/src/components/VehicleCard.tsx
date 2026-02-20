import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import type { Vehicle } from "@/types/vehicle.types";

const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = vehicle.images ?? [];
  const hasMultiple = images.length > 1;

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <Link to={`/vehicles/${vehicle.id}`} className="block group">
      <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md hover:border-primary/30 transition-all duration-300">
        {/* Image */}
        <div className="relative h-44 bg-muted overflow-hidden">
          {images.length > 0 ? (
            <img
              src={images[activeIndex]}
              alt={vehicle.model}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-xs text-muted-foreground">No image</p>
            </div>
          )}

          {/* Prev / Next arrows — show on hover only if multiple images */}
          {hasMultiple && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-foreground text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
              >
                ‹
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-foreground text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
              >
                ›
              </button>
            </>
          )}

          {/* Dot indicators */}
          {hasMultiple && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveIndex(i);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === activeIndex ? "bg-white w-3" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Condition badge */}
          <div className="absolute top-3 right-3">
            <Badge
              variant={vehicle.condition === "new" ? "default" : "secondary"}
              className="capitalize text-[11px]"
            >
              {vehicle.condition}
            </Badge>
          </div>

          {/* Type pill */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-background/80 backdrop-blur-sm text-foreground text-[11px] font-medium px-2.5 py-1 rounded-full capitalize border border-border/50">
              {vehicle.type}
            </span>
          </div>

          {/* Image count badge top-left */}
          {hasMultiple && (
            <div className="absolute top-3 left-3">
              <span className="bg-background/80 backdrop-blur-sm text-foreground text-[10px] font-medium px-2 py-0.5 rounded-full border border-border/50">
                {activeIndex + 1}/{images.length}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-sm font-bold text-foreground leading-tight group-hover:text-primary transition-colors truncate mb-1">
            {vehicle.model}
          </h3>

          {vehicle.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
              {vehicle.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
            <span className="text-base font-extrabold text-primary">
              Rs. {Number(vehicle.price).toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground truncate max-w-[100px]">
              {vehicle.contact}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VehicleCard;
