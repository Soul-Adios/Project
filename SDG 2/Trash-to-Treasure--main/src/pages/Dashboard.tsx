import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useWaste } from "@/contexts/WasteContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress-ring";
import { useNavigate } from "react-router-dom";
import { Trophy, Scale, TrendingUp, Plus, Award, Calendar } from "lucide-react";
import { format } from "date-fns";

export const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { leaderboard, fetchUserStats, loading: wasteLoading } = useWaste();
  const navigate = useNavigate();
  const [userRank, setUserRank] = useState<number | null>(null);

  // Fetch user stats on mount or when user changes
  useEffect(() => {
    if (user?.id) fetchUserStats();
  }, [user?.id, fetchUserStats]);

  // Calculate user rank whenever leaderboard updates
  useEffect(() => {
    if (user && leaderboard.length > 0) {
      const rankIndex = leaderboard.findIndex((entry) => entry.userId === user.id);
      setUserRank(rankIndex >= 0 ? rankIndex + 1 : null);
    }
  }, [user, leaderboard]);

  // Show spinner while auth or waste data is loading
  if (authLoading || wasteLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

  const totalPoints = user.totalPoints || 0;
  const totalWeight = user.totalWeight || 0;
  const joinDate = user.dateJoined ? new Date(user.dateJoined) : null;
  const progressToGoal = Math.min((totalPoints / 100) * 100, 100);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome, {user.username}! 🌱
          </h1>
          <p className="text-muted-foreground">
            Keep up the great work making our planet cleaner!
          </p>
        </div>

        {/* Progress + Quick Stats */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-1 shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-4">Goal Progress</h3>
              <ProgressRing progress={progressToGoal} size={140}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{totalPoints}</div>
                  <div className="text-sm text-muted-foreground">/ 100 pts</div>
                </div>
              </ProgressRing>
              <p className="text-sm text-muted-foreground mt-4">
                {100 - totalPoints > 0
                  ? `${100 - totalPoints} points to reach your goal!`
                  : "🎉 Goal achieved! Keep going!"}
              </p>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            {[
              { label: "Total Weight", value: `${totalWeight.toFixed(1)} kg`, Icon: Scale },
              { label: "Your Rank", value: `#${userRank || "N/A"}`, Icon: Trophy },
              { label: "Member Since", value: joinDate ? format(joinDate, "MMM yyyy") : "N/A", Icon: Calendar },
              { label: "Total Points", value: totalPoints, Icon: Award },
            ].map((stat, i) => (
              <Card key={i} className="shadow-lg border-0">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  </div>
                  <stat.Icon className="h-8 w-8 text-primary/60" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-primary" />
                <span>Submit New Waste</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Log your recyclables and earn points!
              </p>
              <Button
                onClick={() => navigate("/submit")}
                className="w-full bg-gradient-to-r from-primary to-primary-glow"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Submission
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>View Leaderboard</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                See how you rank in the community!
              </p>
              <Button
                onClick={() => navigate("/leaderboard")}
                variant="outline"
                className="w-full border-primary text-primary"
              >
                <Trophy className="h-4 w-4 mr-2" />
                View Rankings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Achievement Section */}
        {totalPoints >= 100 && (
          <Card className="shadow-lg border-0 bg-gradient-to-r from-primary/10 to-primary-glow/10">
            <CardContent className="p-6 text-center">
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">🎉 Achievement Unlocked!</h3>
              <p className="text-muted-foreground">
                Congratulations! You've reached your 100-point goal. Keep going!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
