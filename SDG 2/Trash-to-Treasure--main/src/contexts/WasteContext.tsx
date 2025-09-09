import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import {
  submitWaste,
  getUserStats,
  getLeaderboard,
  WasteSubmissionPayload,
} from "@/services/api";

export interface WasteSubmission {
  id: string | number;
  user: number;
  waste_type: "plastic" | "organic" | "textile" | "e-waste" | "other";
  weight_kg: number;
  submission_date: string;
}

interface WasteContextType {
  submissions: WasteSubmission[];
  addSubmission: (
    wasteType: WasteSubmission["waste_type"],
    weight: number,
    submissionDate: string
  ) => Promise<void>;
  fetchUserStats: () => Promise<void>;
  leaderboard: Array<{ username: string; points: number }>;
}

const WasteContext = createContext<WasteContextType | undefined>(undefined);

export const useWaste = () => {
  const context = useContext(WasteContext);
  if (!context) {
    throw new Error("useWaste must be used within a WasteProvider");
  }
  return context;
};

export const WasteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [submissions, setSubmissions] = useState<WasteSubmission[]>([]);
  const [leaderboard, setLeaderboard] = useState<
    Array<{ username: string; points: number }>
  >([]);
  const { user, updateUser, authAxios } = useAuth();

  // 🔥 Fetch user stats (no unnecessary updateUser calls)
  const fetchUserStats = useCallback(async () => {
    if (!user?.id) return;
    try {
      const stats = await getUserStats(user.id, authAxios);

      // ✅ Only update if something actually changed
      updateUser((prev) => {
        if (
          prev.totalPoints !== stats.total_points ||
          prev.totalWeight !== stats.total_weight
        ) {
          return {
            totalPoints: stats.total_points,
            totalWeight: stats.total_weight,
            progress: stats.progress,
          };
        }
        return prev; // No update, avoid re-render
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  }, [user?.id, authAxios, updateUser]);

  // 🔥 Add new submission
  const addSubmission = async (
    wasteType: WasteSubmission["waste_type"],
    weight: number,
    submissionDate: string
  ) => {
    if (!user?.id) return;
    try {
      const payload: WasteSubmissionPayload = {
        user: user.id,
        waste_type: wasteType,
        weight_kg: weight,
        submission_date: submissionDate,
      };

      const newSubmission = await submitWaste(payload, authAxios);
      setSubmissions((prev) => [newSubmission, ...prev]);
      await fetchUserStats();
    } catch (error) {
      console.error("Error adding submission:", error);
    }
  };

  // 🔥 Fetch leaderboard (only once per mount)
  const fetchLeaderboard = useCallback(async () => {
    try {
      const data = await getLeaderboard(authAxios);
      setLeaderboard(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  }, [authAxios]);

  useEffect(() => {
    if (!user?.id) return;
    fetchUserStats();
    fetchLeaderboard();
  }, [user?.id, fetchUserStats, fetchLeaderboard]);

  const value: WasteContextType = {
    submissions,
    addSubmission,
    fetchUserStats,
    leaderboard,
  };

  return (
    <WasteContext.Provider value={value}>{children}</WasteContext.Provider>
  );
};
