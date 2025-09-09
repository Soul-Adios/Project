import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Leaf, Recycle, TrendingUp, Trophy, Users, Target } from 'lucide-react';
import heroImage from '@/assets/hero-recycling.jpg';
import { useAuth } from '@/contexts/AuthContext';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
        
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-2 mb-6">
              <Leaf className="h-8 w-8 text-primary-foreground" />
              <h2 className="text-2xl font-bold text-primary-foreground">Trash to Treasure</h2>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              Turn Your Waste Into 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-green-300">
                Rewards
              </span>
            </h1>
            
            <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
              Join our community of eco-warriors! Track your waste, earn points, and make a positive impact on the environment while competing with friends.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                // ✅ Logged-in users
                <Button 
                  size="lg" 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Go to Dashboard
                </Button>
              ) : (
                // ✅ Logged-out users
                <>
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/signup')}
                    className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Start Your Journey
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => navigate('/login')}
                    className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold py-3 px-8"
                  >
                    Login
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple steps to start earning rewards for your environmental impact
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-colors duration-300 shadow-lg hover:shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Recycle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Submit Waste</h3>
                <p className="text-muted-foreground">
                  Log your recyclable materials by type and weight. Every submission counts towards a cleaner planet.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors duration-300 shadow-lg hover:shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Earn Points</h3>
                <p className="text-muted-foreground">
                  Get 1 point per kilogram recycled. Watch your impact grow and reach your 300-point goal!
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors duration-300 shadow-lg hover:shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Compete & Win</h3>
                <p className="text-muted-foreground">
                  Climb the leaderboard, compete with friends, and earn rewards for your environmental dedication.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Users className="h-12 w-12 mx-auto mb-4 opacity-90" />
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <div className="text-primary-foreground/80">Active Users</div>
            </div>
            <div>
              <Target className="h-12 w-12 mx-auto mb-4 opacity-90" />
              <div className="text-3xl font-bold mb-2">50,000</div>
              <div className="text-primary-foreground/80">KG Recycled</div>
            </div>
            <div>
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-90" />
              <div className="text-3xl font-bold mb-2">500,000</div>
              <div className="text-primary-foreground/80">Points Earned</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
