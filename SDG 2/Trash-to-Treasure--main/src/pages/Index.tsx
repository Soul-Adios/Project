import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Recycle, Trophy, PlusCircle } from "lucide-react";
import { useRouter } from "next/router";

const Index = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-3xl w-full text-center space-y-8">
        {/* Header */}
        <div>
          <h1 className="mb-4 text-4xl font-bold text-foreground">
            ♻️ Trash to Treasure
          </h1>
          <p className="text-lg text-muted-foreground">
            Turn your waste into rewards while helping the planet.  
            Track your progress, earn points, and climb the leaderboard!
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card
            className="cursor-pointer hover:shadow-xl transition"
            onClick={() => router.push("/submit-waste")}
          >
            <CardHeader>
              <Recycle className="h-10 w-10 text-primary mx-auto mb-2" />
              <CardTitle>Submit Waste</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Log your recyclable waste and earn eco-points instantly.
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-xl transition"
            onClick={() => router.push("/leaderboard")}
          >
            <CardHeader>
              <Trophy className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
              <CardTitle>Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                See how you rank among other eco-warriors in the community.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="mt-6">
          <Button
            size="lg"
            className="flex items-center space-x-2"
            onClick={() => router.push("/submit-waste")}
          >
            <PlusCircle className="h-5 w-5" />
            <span>Start Recycling Now</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
