import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Users, TrendingUp, Crown } from "lucide-react";
import { getLeaderboard, getUserStats } from "@/services/api";

type LeaderboardEntry = {
  userId: number;
  name: string;
  totalPoints: number;
  totalWeight: number;
  rank: number;
};

export const Leaderboard: React.FC = () => {
  const { user, authAxios } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [userStats, setUserStats] = useState<{
    totalPoints: number;
    totalWeight: number;
    progress: number;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLeaderboard(authAxios);
        setLeaderboard(data);

        if (user) {
          const userEntry = data.find((entry) => entry.userId === user.id);
          setUserRank(userEntry?.rank || null);

          const stats = await getUserStats(user.id, authAxios);
          setUserStats({
            totalPoints: stats.totalPoints,
            totalWeight: stats.totalWeight,
             progress: stats.progress,
          });
        }
      } catch (error) {
        console.error("Failed to load leaderboard", error);
      }
    };

    fetchData();
  }, [user?.id]); // ✅ only depends on user ID, avoids infinite loop

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return (
          <span className="text-sm font-bold text-muted-foreground">
            #{rank}
          </span>
        );
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500";
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">
            See how you stack up against other eco-warriors!
          </p>
        </div>

        {/* ✅ User Rank */}
        {user && userRank && userStats && (
          <Card className="mb-6 shadow-lg border-0 bg-gradient-to-r from-primary/10 to-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    {getRankIcon(userRank)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary">
                      Your Current Rank
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      You're #{userRank} with {userStats.totalPoints} points
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-primary/20 text-primary"
                >
                  {userStats.totalWeight.toFixed(1)} kg recycled
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ✅ Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{leaderboard.length}</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {leaderboard
                  .reduce((sum, u) => sum + u.totalWeight, 0)
                  .toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">
                Total KG Recycled
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {leaderboard
                  .reduce((sum, u) => sum + u.totalPoints, 0)
                  .toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </CardContent>
          </Card>
        </div>

        {/* ✅ Leaderboard list can go here */}
        {/* Example:
        <div className="space-y-3">
          {leaderboard.map((entry) => (
            <Card key={entry.userId} className={getRankColor(entry.rank)}>
              <CardContent className="flex justify-between p-4">
                <div className="flex items-center space-x-3">
                  {getRankIcon(entry.rank)}
                  <span>{entry.name}</span>
                </div>
                <span>{entry.totalPoints} pts</span>
              </CardContent>
            </Card>
          ))}
        </div>
        */}
      </div>
    </div>
  );
};
