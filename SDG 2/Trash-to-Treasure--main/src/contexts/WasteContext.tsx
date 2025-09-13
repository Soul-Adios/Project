import { API_BASE_URL } from "@/config";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
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
  waste_type: "plastic" | "organic" | "textile" | "ewaste" | "other";
  weight_kg: number;
  date: string;
}

interface LeaderboardEntry {
  userId: number;
  name: string;
  totalPoints: number;
  totalWeight: number;
  rank: number;
}

interface WasteContextType {
  submissions: WasteSubmission[];
  addSubmission: (wasteType: WasteSubmission["waste_type"], weight: number) => Promise<void>;
  fetchUserStats: () => Promise<void>;
  leaderboard: LeaderboardEntry[];
}

const WasteContext = createContext<WasteContextType | undefined>(undefined);

export const useWaste = (): WasteContextType => {
  const context = useContext(WasteContext);
  if (!context) {
    throw new Error("useWaste must be used within a WasteProvider");
  }
  return context;
};

export const WasteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [submissions, setSubmissions] = useState<WasteSubmission[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const { user, updateUser, authAxios } = useAuth();

  // Fetch user stats
  const fetchUserStats = useCallback(async () => {
    if (!user?.id) return;
    try {
      const stats = await getUserStats(user.id, authAxios);
      updateUser({
        totalPoints: stats.totalPoints,
        totalWeight: stats.totalWeight,
        progress: stats.progress,
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  }, [user?.id, authAxios, updateUser]);

  // Add a new submission
  const addSubmission = async (wasteType: WasteSubmission["waste_type"], weight: number) => {
    if (!user) return;
    try {
      const payload: WasteSubmissionPayload = { waste_type: wasteType, weight_kg: weight };
      const newSubmission = await submitWaste(payload, authAxios);
      setSubmissions(prev => [newSubmission, ...prev]);
      await fetchUserStats();
    } catch (error) {
      console.error("Error adding submission:", error);
    }
  };

  // Fetch leaderboard
  const fetchLeaderboard = useCallback(async () => {
    try {
      const data = await getLeaderboard(authAxios);
      setLeaderboard(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  }, [authAxios]);

  // Initial fetch
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

  return <WasteContext.Provider value={value}>{children}</WasteContext.Provider>;
};
