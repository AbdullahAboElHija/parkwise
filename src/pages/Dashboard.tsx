import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  DollarSign,
  Star,
  Calendar,
  PlusCircle,
  MapPin,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import coveredParking from "@/assets/parking-covered.jpg";

const Dashboard = () => {
  const stats = [
    { label: "Total Earnings", value: "₪4,250", icon: DollarSign, color: "text-success" },
    { label: "Active Listings", value: "3", icon: MapPin, color: "text-primary" },
    { label: "Total Bookings", value: "47", icon: Calendar, color: "text-accent" },
    { label: "Average Rating", value: "4.8", icon: Star, color: "text-warning" },
  ];

  const myListings = [
    {
      id: "1",
      title: "Private Covered Parking Near Azrieli",
      location: "Tel Aviv Center",
      image: coveredParking,
      price: 45,
      status: "active",
      bookings: 12,
      rating: 4.8,
    },
    {
      id: "2",
      title: "Downtown Parking - Rothschild Blvd",
      location: "Tel Aviv",
      image: coveredParking,
      price: 50,
      status: "active",
      bookings: 8,
      rating: 4.7,
    },
  ];

  const pendingBookings = [
    {
      id: "1",
      renter: "Sarah Cohen",
      parking: "Private Covered Parking Near Azrieli",
      date: "Dec 15, 2024",
      duration: "3 days",
      amount: "₪135",
    },
    {
      id: "2",
      renter: "David Levi",
      parking: "Downtown Parking - Rothschild Blvd",
      date: "Dec 18, 2024",
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
                <h2 className="text-xl font-semibold text-foreground">My Listings</h2>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>

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
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
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
            </Card>
          </div>

          {/* Pending Bookings */}
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
