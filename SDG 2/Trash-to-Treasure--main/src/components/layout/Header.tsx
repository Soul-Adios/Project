import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Leaf, LogOut, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user || location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold text-foreground">Trash to Treasure</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Button
            variant={location.pathname === '/dashboard' ? 'default' : 'ghost'}
            onClick={() => navigate('/dashboard')}
            size="sm"
          >
            Dashboard
          </Button>
          <Button
            variant={location.pathname === '/submit' ? 'default' : 'ghost'}
            onClick={() => navigate('/submit')}
            size="sm"
          >
            Submit Waste
          </Button>
          <Button
            variant={location.pathname === '/leaderboard' ? 'default' : 'ghost'}
            onClick={() => navigate('/leaderboard')}
            size="sm"
          >
            Leaderboard
          </Button>
        </nav>

        <div className="flex items-center space-x-2">
          <div className="hidden sm:flex items-center space-x-2 text-sm">
            <User className="h-4 w-4" />
            <span className="text-muted-foreground">{user.name}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:ml-2 sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};