import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, ImageOff, MapPin } from "lucide-react";
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
    <Link to={`/vehicles/${vehicle.id}`} className="block group outline-none">
      <Card className="overflow-hidden h-[380px] flex flex-col border-border/60 hover:border-primary/40 hover:shadow-lg transition-all duration-300 rounded-2xl bg-card">
        {/* ── Image Section ── fixed height: 200px */}
        <div className="relative h-[200px] shrink-0 bg-muted overflow-hidden">
          {images.length > 0 ? (
            <img
              src={images[activeIndex]}
              alt={vehicle.model}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <ImageOff className="w-8 h-8 opacity-40" />
              <span className="text-xs">No image available</span>
            </div>
          )}

          {/* Gradient overlay for bottom badges */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

          {/* Prev / Next arrows */}
          {hasMultiple && (
            <>
              <Button
                size="icon"
                variant="ghost"
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-background/70 backdrop-blur-md border border-border/50 text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background shadow-sm"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-background/70 backdrop-blur-md border border-border/50 text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background shadow-sm"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </>
          )}

          {/* Image count — top left */}
          {hasMultiple && (
            <div className="absolute top-2.5 left-2.5">
              <span className="bg-background/75 backdrop-blur-sm text-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full border border-border/40 tabular-nums">
                {activeIndex + 1} / {images.length}
              </span>
            </div>
          )}

          {/* Condition badge — top right */}
          <div className="absolute top-2.5 right-2.5">
            <Badge
              variant={vehicle.condition === "new" ? "default" : "secondary"}
              className="capitalize text-[10px] font-semibold tracking-wide shadow-sm"
            >
              {vehicle.condition}
            </Badge>
          </div>

          {/* Dot indicators */}
          {hasMultiple && (
            <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-auto">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveIndex(i);
                  }}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "bg-white w-4"
                      : "bg-white/50 w-1.5 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Type pill — bottom left */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-background/75 backdrop-blur-sm text-foreground text-[11px] font-medium px-2.5 py-1 rounded-full capitalize border border-border/40">
              {vehicle.type}
            </span>
          </div>
        </div>

        {/* ── Content Section ── fills remaining height */}
        <CardContent className="flex flex-col flex-1 p-4 gap-2 min-h-0">
          {/* Title */}
          <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors truncate">
            {vehicle.model}
          </h3>

          {/* Description — clamped to 2 lines */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1 min-h-0">
            {vehicle.description ?? "No description provided."}
          </p>

          <Separator className="my-1" />

          {/* Footer: price + contact */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-base font-extrabold text-primary tracking-tight">
              Rs.&nbsp;{Number(vehicle.price).toLocaleString()}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground min-w-0">
              <MapPin className="h-3 w-3 shrink-0 opacity-60" />
              <span className="truncate max-w-[110px]">{vehicle.contact}</span>
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default VehicleCard;
