import api from "./axios";
import type { Vehicle, CreateVehicleDTO } from "@/types/vehicle.types";

export const vehicleApi = {
  create: (data: CreateVehicleDTO) => api.post<Vehicle>("/vehicles", data),

  getAll: () => api.get<Vehicle[]>("/vehicles"),

  getMine: () => api.get<Vehicle[]>("/vehicles/my"),

  getById: (id: number) => api.get<Vehicle>(`/vehicles/${id}`),

  update: (id: number, data: Partial<CreateVehicleDTO>) =>
    api.put<Vehicle>(`/vehicles/${id}`, data),

  delete: (id: number) => api.delete(`/vehicles/${id}`),
};
