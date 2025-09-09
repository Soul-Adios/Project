import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Recycle, Scale, Calendar, Award } from 'lucide-react';
import { submitWaste } from '@/services/api';   // ✅ Django API

type WasteType = 'plastic' | 'organic' | 'textile' | 'e-waste' | 'other';

const wasteTypes: { value: WasteType; label: string; icon: string }[] = [
  { value: 'plastic', label: 'Plastic', icon: '♻️' },
  { value: 'organic', label: 'Organic', icon: '🍃' },
  { value: 'textile', label: 'Textile', icon: '👕' },
  { value: 'e-waste', label: 'E-Waste', icon: '📱' },
  { value: 'other', label: 'Other', icon: '📦' },
];

export const SubmitWaste: React.FC = () => {
  const [wasteType, setWasteType] = useState<WasteType | ''>('');
  const [weight, setWeight] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // ✅ Default submission date = today
  const submissionDate = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !wasteType || !weight) return;

    setIsLoading(true);

    try {
      const weightNum = parseFloat(weight);
      if (weightNum <= 0) {
        toast({
          variant: "destructive",
          title: "Invalid weight",
          description: "Please enter a weight greater than 0.",
        });
        return;
      }

      // ✅ Call Django backend with submission_date
      await submitWaste({
        user: user.id,   
        waste_type: wasteType,
        weight_kg: weightNum,
        submission_date: submissionDate,
      });

      const pointsEarned = Math.round(weightNum * 10) / 10;

      toast({
        title: "Waste submitted successfully! 🎉",
        description: `You earned ${pointsEarned} points for ${weightNum}kg of ${wasteTypes.find(t => t.value === wasteType)?.label}!`,
      });

      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePoints = (weightValue: string) => {
    const num = parseFloat(weightValue);
    return isNaN(num) ? 0 : Math.round(num * 10) / 10;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Submit Waste</h1>
            <p className="text-muted-foreground">
              Log your recyclable materials and earn points for your environmental impact
            </p>
          </div>

          <Card className="shadow-lg border-0" style={{ boxShadow: 'var(--card-shadow)' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Recycle className="h-5 w-5 text-primary" />
                <span>New Waste Submission</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Waste Type */}
                <div className="space-y-2">
                  <Label htmlFor="wasteType">Waste Type</Label>
                  <Select onValueChange={(value) => setWasteType(value as WasteType)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select waste type" />
                    </SelectTrigger>
                    <SelectContent>
                      {wasteTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            <span>{type.icon}</span>
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <div className="relative">
                    <Scale className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      min="0.1"
                      placeholder="Enter weight in kg"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="pl-9"
                      required
                    />
                  </div>
                  {weight && (
                    <p className="text-sm text-muted-foreground">
                      This will earn you <strong className="text-primary">{calculatePoints(weight)} points</strong>
                    </p>
                  )}
                </div>

                {/* Submission Date */}
                <div className="space-y-2">
                  <Label>Submission Date</Label>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Points Preview */}
                {weight && wasteType && (
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Award className="h-4 w-4 text-primary" />
                        <span className="font-medium text-primary">Points Preview</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Submitting <strong>{weight}kg</strong> of{' '}
                        <strong>{wasteTypes.find(t => t.value === wasteType)?.label}</strong>{' '}
                        will earn you <strong className="text-primary">{calculatePoints(weight)} points</strong>
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90" 
                  disabled={isLoading || !wasteType || !weight}
                  style={{ boxShadow: 'var(--achievement-glow)' }}
                >
                  {isLoading ? 'Submitting...' : 'Submit Waste'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Extra Info */}
          <div className="mt-8 p-4 bg-accent/50 rounded-lg">
            <h3 className="font-medium text-accent-foreground mb-2">💡 Did you know?</h3>
            <p className="text-sm text-muted-foreground">
              For every kilogram you recycle, you earn 1 point. Your goal is to reach 300 points - 
              that's equivalent to recycling 300kg of waste and making a real environmental impact!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
