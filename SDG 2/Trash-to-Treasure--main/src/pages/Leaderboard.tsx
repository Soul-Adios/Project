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
import { getLeaderboard } from "@/services/api";

type LeaderboardEntry = {
  userId: number;
  name: string;
  totalPoints: number;
  totalWeight: number;
  rank: number;
};

export const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);

  // ✅ Fetch leaderboard on mount (or set up polling if needed)
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const data = await getLeaderboard();
        setLeaderboard(data);

        if (user) {
          const userEntry = data.find(
            (entry: LeaderboardEntry) => entry.userId === user.id
          );
          setUserRank(userEntry?.rank || null);
        }
      } catch (error) {
        console.error("Failed to load leaderboard", error);
      }
    };

    fetchLeaderboardData();

    // Optional: enable live updates every 15s
    // const interval = setInterval(fetchLeaderboardData, 15000);
    // return () => clearInterval(interval);
  }, [user?.id]); // Only re-fetch if user ID changes

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
          <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Leaderboard
            </h1>
            <p className="text-muted-foreground">
              See how you stack up against other eco-warriors in the community!
            </p>
          </div>

          {/* User Rank */}
          {user && userRank && (
            <Card className="mb-6 shadow-lg border-0 bg-gradient-to-r from-primary/10 to-primary-glow/10">
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
                        You're #{userRank} with {user.totalPoints} points
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-primary/20 text-primary">
                    {user.totalWeight.toFixed(1)} kg recycled
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="shadow-lg border-0">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">
                  {leaderboard.length}
                </div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">
                  {leaderboard
                    .reduce((sum, u) => sum + u.totalWeight, 0)
                    .toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total KG Recycled
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">
                  {leaderboard
                    .reduce((sum, u) => sum + u.totalPoints, 0)
                    .toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Points Earned
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard List */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-primary" />
                <span>Top Contributors</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {leaderboard.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No submissions yet. Be the first to make an impact!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {leaderboard.map((entry) => (
                    <div
                      key={entry.userId}
                      className={`flex items-center justify-between p-4 ${
                        user?.id === entry.userId
                          ? "bg-primary/5"
                          : "hover:bg-muted/50"
                      } transition-colors duration-200`}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            entry.rank <= 3
                              ? getRankColor(entry.rank)
                              : "bg-muted"
                          }`}
                        >
                          {getRankIcon(entry.rank)}
                        </div>
                        <div>
                          <h3
                            className={`font-semibold ${
                              user?.id === entry.userId
                                ? "text-primary"
                                : "text-foreground"
                            }`}
                          >
                            {entry.name}
                            {user?.id === entry.userId && (
                              <Badge
                                variant="secondary"
                                className="ml-2 text-xs"
                              >
                                You
                              </Badge>
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {entry.totalWeight.toFixed(1)} kg recycled
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          {entry.totalPoints} pts
                        </div>
                        {entry.totalPoints >= 300 && (
                          <Badge
                            variant="outline"
                            className="text-xs border-primary text-primary"
                          >
                            Goal Achieved! 🎉
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Community Impact */}
          <div className="mt-8 p-4 bg-accent/50 rounded-lg text-center">
            <h3 className="font-medium text-accent-foreground mb-2">
              🌍 Community Impact
            </h3>
            <p className="text-sm text-muted-foreground">
              Together, we've recycled{" "}
              <strong className="text-primary">
                {leaderboard
                  .reduce((sum, u) => sum + u.totalWeight, 0)
                  .toFixed(1)}{" "}
                kg
              </strong>{" "}
              of waste and earned{" "}
              <strong className="text-primary">
                {leaderboard
                  .reduce((sum, u) => sum + u.totalPoints, 0)
                  .toFixed(1)}{" "}
                points
              </strong>
              ! Every contribution makes a difference. 🌱
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

