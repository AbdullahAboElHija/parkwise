import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  DollarSign,
  Star,
  Calendar,
  PlusCircle,
  MapPin,
  Edit,
  Trash2,
  Eye,
  Loader2,
} from "lucide-react";
import coveredParking from "@/assets/parking-covered.jpg";

// --- Interface for fetched data (Updated for 'isActive' and 'photos') ---
interface Listing {
  _id: string;
  name: string;
  address: { city: string; street: string };
  prices: { hourly: number; daily?: number; monthly?: number };
  isActive: boolean; // <-- Updated based on the schema
  photos: string[]; // <-- Updated based on the schema (was 'images')
  averageRating?: number; 
  totalBookings?: number; 
}

// --- Local Listing interface for rendering ---
interface RenderListing {
    id: string;
    title: string;
    location: string;
    image: string;
    price: number;
    status: 'active' | 'inactive'; // For rendering purposes, map isActive to a status string
    bookings: number;
    rating: number;
}


const Dashboard: React.FC = () => {
  const [myListings, setMyListings] = useState<RenderListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchMyListings = async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    if (!token) {
        toast({
            variant: "destructive",
            title: "Authentication Required",
            description: "Please log in to view your dashboard.",
        });
        navigate("/login");
        return;
    }

    try {
      const response = await fetch("/api/v1/parkings/my-listings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch listings.");
      }

      // --- MAPPING API DATA TO RENDER DATA ---
      const mappedListings: RenderListing[] = data.data.map((p: Listing) => ({
        id: p._id,
        title: p.name,
        location: `${p.address.city}, ${p.address.street}`,
        image: p.photos && p.photos.length > 0 ? p.photos[0] : coveredParking, // <-- Uses 'photos'
        price: p.prices.daily || p.prices.hourly * 24,
        status: p.isActive ? 'active' : 'inactive', // <-- Logic updated here
        bookings: p.totalBookings || 0,
        rating: p.averageRating || 0,
      }));

      setMyListings(mappedListings);

    } catch (err: any) {
      console.error("Error fetching listings:", err);
      setError(err.message || "Could not load your listings.");
      toast({
        variant: "destructive",
        title: "Data Fetch Error",
        description: err.message || "Could not load your listings.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);


  // --- CONSTANTS ---
  const stats = [
    { label: "Total Earnings", value: "₪4,250", icon: DollarSign, color: "text-success" },
    { 
      label: "Active Listings", 
      value: myListings.filter(l => l.status === 'active').length.toString(), // <-- Filtering using mapped status
      icon: MapPin, 
      color: "text-primary" 
    },
    { label: "Total Bookings", value: myListings.reduce((sum, listing) => sum + listing.bookings, 0).toString(), icon: Calendar, color: "text-accent" },
    { label: "Average Rating", value: "TODO", icon: Star, color: "text-warning" },
  ];

  //   TODO Fetching
  const pendingBookings = [
    {
      id: "1",
      renter: "Sarah Cohen",
      parking: "Private Covered Parking Near Azrieli",
      date: "Dec 15, 2025",
      duration: "3 days",
      amount: "₪135",
    },
    {
      id: "2",
      renter: "David Levi",
      parking: "Downtown Parking - Rothschild Blvd",
      date: "Dec 18, 2025",
      duration: "1 week",
      amount: "₪350",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Owner Dashboard</h1>
            <p className="text-muted-foreground">Manage your parking listings and bookings</p>
          </div>
          <Button size="lg" asChild>
            <Link to="/dashboard/add-listing">
              <PlusCircle className="h-5 w-5 mr-2" />
              Add New Listing
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-full bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Listings */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">My Listings ({myListings.length})</h2>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>

              {/* --- Conditional Rendering for Loading/Error States --- */}
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                  <span className="text-lg text-muted-foreground">Loading listings...</span>
                </div>
              ) : error ? (
                <div className="text-center p-8 text-red-500 border border-red-300 rounded-lg">
                  <p className="font-semibold">Error Loading Listings</p>
                  <p className="text-sm">{error}</p>
                </div>
              ) : myListings.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground border border-dashed rounded-lg">
                    <p className="font-semibold mb-2">No Listings Found</p>
                    <p className="text-sm">Time to monetize your space! <Link to="/dashboard/add-listing" className="text-primary hover:underline">Create your first listing.</Link></p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="flex gap-4 p-4 border border-border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground">{listing.title}</h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{listing.location}</span>
                            </div>
                          </div>
                          <Badge variant={listing.status === "active" ? "success" : "secondary"}>
                            {listing.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex gap-4 text-sm">
                            <span className="text-muted-foreground">
                              ₪{listing.price}/day
                            </span>
                            <span className="text-muted-foreground">
                              {listing.bookings} bookings
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-warning text-warning" />
                              <span>{listing.rating}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" asChild>
                              <Link to={`/parking/${listing.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Pending Bookings (Unchanged) */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6 text-foreground">
                Pending Requests
              </h2>
              <div className="space-y-4">
                {pendingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 border border-border rounded-lg space-y-3"
                  >
                    <div>
                      <p className="font-medium text-foreground">{booking.renter}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {booking.parking}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{booking.date}</span>
                      </div>
                      <div>Duration: {booking.duration}</div>
                      <div className="font-semibold text-foreground">
                        {booking.amount}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1" variant="success">
                        Approve
                      </Button>
                      <Button size="sm" className="flex-1" variant="outline">
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;