import { AxiosInstance } from "axios";
import { API_BASE_URL } from "@/config";

export interface WasteSubmissionPayload {
  waste_type: string;
  weight_kg: number;
}

// ✅ All requests now use relative paths (authAxios already has baseURL)
// Submit waste
export const submitWaste = async (
  payload: WasteSubmissionPayload,
  authAxios: AxiosInstance
) => {
  const response = await authAxios.post("/submissions/", payload);
  return response.data;
};

// ✅ Fetch user stats
export const getUserStats = async (userId: number, authAxios: AxiosInstance) => {
  const response = await authAxios.get(`/dashboard/${userId}/`);
  return response.data; // { totalPoints, totalWeight, progress, ... }
};

// ✅ Fetch leaderboard
export const getLeaderboard = async (authAxios: AxiosInstance) => {
  const response = await authAxios.get("/leaderboard/");
  return response.data; // [{ userId, name, totalPoints, totalWeight, rank }]
};
