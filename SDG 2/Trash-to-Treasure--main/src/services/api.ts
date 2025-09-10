import { AxiosInstance } from "axios";

export interface WasteSubmissionPayload {
  waste_type: string;
  weight_kg: number;
}

// ✅ Accept `authAxios` from AuthContext instead of plain axios
export const submitWaste = async (payload: WasteSubmissionPayload, authAxios: AxiosInstance) => {
  const response = await authAxios.post("/submissions/", payload);
  return response.data;
};

export const getUserStats = async (userId: number, authAxios: AxiosInstance) => {
  const response = await authAxios.get(`/dashboard/${userId}/`);
  return response.data; // { totalPoints, totalWeight, progress, ... }
};

export const getLeaderboard = async (authAxios: AxiosInstance) => {
  const response = await authAxios.get("/leaderboard/");
  return response.data; // [{ userId, name, totalPoints, totalWeight, rank }]
};
