import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Leaf, Mail, Lock, User } from 'lucide-react';

export const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!username.trim() || !email.trim() || !password) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all fields.",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Weak password",
        description: "Password must be at least 6 characters long.",
      });
      return;
    }

    if (username.length < 3) {
      toast({
        variant: "destructive",
        title: "Username too short",
        description: "Username must be at least 3 characters long.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await signup(username, email, password);
      if (success) {
        toast({
          title: "Welcome to Trash to Treasure!",
          description: "Your account has been created successfully.",
        });
        navigate('/dashboard');
      } else {
        toast({
          variant: "destructive",
          title: "Signup failed",
          description: "This username or email is already taken.",
        });
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // More specific error handling
      if (error.message?.includes('Network Error') || error.message?.includes('Failed to fetch')) {
        toast({
          variant: "destructive",
          title: "Connection error",
          description: "Cannot connect to the server. Please check if the backend is running on http://127.0.0.1:8000",
        });
      } else if (error.status === 400) {
        // Handle Django validation errors
        const errorData = error.data;
        if (errorData.username) {
          toast({
            variant: "destructive",
            title: "Username error",
            description: Array.isArray(errorData.username) ? errorData.username[0] : errorData.username,
          });
        } else if (errorData.email) {
          toast({
            variant: "destructive",
            title: "Email error",
            description: Array.isArray(errorData.email) ? errorData.email[0] : errorData.email,
          });
        } else if (errorData.password) {
          toast({
            variant: "destructive",
            title: "Password error",
            description: Array.isArray(errorData.password) ? errorData.password[0] : errorData.password,
          });
        } else if (errorData.error) {
          toast({
            variant: "destructive",
            title: "Signup failed",
            description: errorData.error,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Signup failed",
            description: "Please check your information and try again.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-primary/10 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Trash to Treasure</h1>
          </div>
          <p className="text-muted-foreground">Start your journey to a cleaner planet</p>
        </div>

        <Card className="shadow-lg border-0" style={{ boxShadow: 'var(--card-shadow)' }}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username (min. 3 characters)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-9"
                    required
                    minLength={3}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password (min. 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90" 
                disabled={isLoading}
                style={{ boxShadow: 'var(--achievement-glow)' }}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-primary hover:text-primary-glow font-medium">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};