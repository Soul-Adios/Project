import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Recycle, Scale, Calendar } from "lucide-react";
import { submitWaste } from "@/services/api";

type WasteType = "plastic" | "organic" | "textile" | "ewaste" | "other";

const wasteTypes: { value: WasteType; label: string; icon: string }[] = [
  { value: "plastic", label: "Plastic", icon: "♻️" },
  { value: "organic", label: "Organic", icon: "🍃" },
  { value: "textile", label: "Textile", icon: "👕" },
  { value: "ewaste", label: "E-Waste", icon: "📱" },
  { value: "other", label: "Other", icon: "📦" },
];

export const SubmitWaste: React.FC = () => {
  const [wasteType, setWasteType] = useState<WasteType | "">("");
  const [weight, setWeight] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, authAxios } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !wasteType || !weight) return;

    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid weight",
        description: "Please enter a valid weight greater than 0.",
      });
      return;
    }

    setIsLoading(true);

    try {
      await submitWaste(
        {
          waste_type: wasteType,
          weight_kg: weightNum,
        },
        authAxios
      );

      toast({
        title: "Waste submitted successfully! 🎉",
        description: `You earned ${weightNum} points for ${weightNum}kg of ${
          wasteTypes.find((t) => t.value === wasteType)?.label
        }.`,
      });

      navigate("/dashboard");
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Submit Waste
            </h1>
            <p className="text-muted-foreground">
              Log your recyclable materials and earn points for your
              environmental impact
            </p>
          </div>

          <Card className="shadow-lg border-0">
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
                  <Select
                    onValueChange={(value) => setWasteType(value as WasteType)}
                  >
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
                </div>

                {/* Date (read-only display only) */}
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-primary-glow"
                  disabled={isLoading || !wasteType || !weight}
                >
                  {isLoading ? "Submitting..." : "Submit Waste"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
