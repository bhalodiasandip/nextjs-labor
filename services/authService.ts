import axios from "axios";
import axiosInstance from "./axiosInstance";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Village {
  id: number;
  village_name: string;
}

export interface Area {
  id: number;
  area_name: string;
  village: number; // Ensure consistency with backend naming
}

export interface Skill {
  id: number;
  skill_name: string;
  skill_type: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role: string;
  village_id: number;
}

export interface RegisterFarmerRequest {
  full_name: string;
  phone_number: string;
  password: string;
  role: "farmer";
  village_ids: number[];
  area_ids: number[];
}

export interface RegisterLaborRequest {
  village_id: number;
  full_name: string;
  phone_number: string;
  password: string;
  role: "labor";
  area_id: number;
  gender: "male" | "female";
  hourly_rate: number;
}

export interface RegisterTractorRequest {
  full_name: string;
  phone_number: string;
  password: string;
  role: "tractor";
  village_ids: number[];
  skill_ids: number[];
}

export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("/api/token/", credentials);
    return response.data;
  } catch (error: any) {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      throw new Error("invalid_credentials");
    } else {
      throw new Error("unexpected_error");
    }
  }
};

export const logout = async (): Promise<void> => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");

    if (refreshToken) {
      await axiosInstance.post("/api/logout/", {
        refresh: refreshToken,
      });
    }
  } catch (error) {
    console.error("Error during logout:", error);
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
};

export const registerFarmer = async (
  data: RegisterFarmerRequest
): Promise<{ detail: string }> => {
  const response = await api.post("/api/register/", data);
  return response.data;
};

export const registerLabor = async (
  data: RegisterLaborRequest
): Promise<{ detail: string }> => {
  const response = await api.post("/api/register/", data);
  return response.data;
};

export const registerTractor = async (
  data: RegisterTractorRequest
): Promise<{ detail: string }> => {
  const response = await api.post("/api/register/", data);
  return response.data;
};

export const fetchVillages = async (): Promise<Village[]> => {
  const response = await api.get("/api/villages/");
  return response.data;
};

export const fetchAreasByVillage = async (
  villageId: number
): Promise<Area[]> => {
  const response = await api.get(`/api/areas/?village_id=${villageId}`);
  return response.data;
};

export const fetchSkills = async (
  type: "labor" | "tractor"
): Promise<Skill[]> => {
  const response = await api.get(`/api/skills/?skill_type=${type}`);
  return response.data;
};
