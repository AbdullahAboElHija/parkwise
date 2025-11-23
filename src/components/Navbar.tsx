import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, UserCircle, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-xl font-bold text-foreground">ParkSpot</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/search" className="text-foreground hover:text-primary transition-colors">
              Find Parking
            </Link>
            <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">
              List Your Spot
            </Link>
            <Link to="/profile" className="text-foreground hover:text-primary transition-colors">
              Profile
            </Link>
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost">
                <Link to="/login">
                  <UserCircle className="h-5 w-5" />
                  Login
                </Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-border">
            <Link
              to="/search"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Find Parking
            </Link>
            <Link
              to="/dashboard"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              List Your Spot
            </Link>
            <Link
              to="/profile"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            <div className="flex flex-col gap-2 px-4 pt-2">
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <UserCircle className="h-5 w-5" />
                  Login
                </Link>
              </Button>
              <Button asChild className="w-full">
                <Link to="/signup" onClick={() => setIsOpen(false)}>
                  Sign Up
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
