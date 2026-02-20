// Matches PostgreSQL enum: vehicle_type
export type VehicleType = "car" | "motorcycle" | "scooter";

// Matches PostgreSQL enum: vehicle_condition
export type VehicleCondition = "new" | "used";

export interface Vehicle {
  id: number;
  user_id: number;
  type: VehicleType;
  model: string;
  price: string; // ⚠ numeric from PG comes as string
  description?: string;
  condition: VehicleCondition;
  contact: string;
  images?: string[];
  created_at: string;
}

export interface CreateVehicleDTO {
  type: VehicleType;
  model: string;
  price: number;
  description?: string;
  condition: VehicleCondition;
  contact: string;
  images?: string[];
}
