import axios from "axios";

// Adjust if your backend runs on another port or domain
const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Define the payload structure for waste submission
export interface WasteSubmissionPayload {
  user: number;
  waste_type: string;
  weight_kg: number;
  submission_date: string; // format: YYYY-MM-DD
}

// ✅ Add a waste submission
export const submitWaste = async (payload: WasteSubmissionPayload) => {
  const response = await API.post("/submissions/", payload);
  return response.data;
};

// ✅ Get user dashboard stats (points, weight, progress)
export const getUserStats = async (userId: number) => {
  const response = await API.get(`/dashboard/${userId}/`);
  return response.data;
};

// ✅ Get leaderboard
export const getLeaderboard = async () => {
  const response = await API.get("/leaderboard/");
  return response.data;
};
