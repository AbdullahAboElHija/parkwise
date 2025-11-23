import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Star, Calendar, CreditCard } from "lucide-react";
import coveredParking from "@/assets/parking-covered.jpg";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "050-123-4567",
  });

  const upcomingBookings = [
    {
      id: "1",
      title: "Private Covered Parking Near Azrieli",
      location: "Tel Aviv Center",
      image: coveredParking,
      date: "Dec 20, 2024",
      duration: "2 days",
      amount: "₪90",
    },
  ];

  const pastBookings = [
    {
      id: "1",
      title: "Downtown Parking - Rothschild Blvd",
      location: "Tel Aviv",
      image: coveredParking,
      date: "Nov 15, 2024",
      duration: "3 days",
      amount: "₪150",
      rated: true,
    },
    {
      id: "2",
      title: "EV Charging Garage - Carmel Center",
      location: "Haifa",
      image: coveredParking,
      date: "Oct 28, 2024",
      duration: "1 week",
      amount: "₪385",
      rated: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 mb-8">
            <div className="flex items-center gap-6 mb-6">
              <Avatar className="h-24 w-24 bg-primary/10 flex items-center justify-center">
                <User className="h-12 w-12 text-primary" />
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-1">
                  {profileData.name}
                </h1>
                <p className="text-muted-foreground mb-2">{profileData.email}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="font-medium">4.8</span>
                    <span className="text-muted-foreground">(12 reviews)</span>
                  </div>
                  <Badge variant="secondary">Verified</Badge>
                </div>
              </div>
              <Button variant="outline">Edit Profile</Button>
            </div>
          </Card>

          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6 text-foreground">
                  Upcoming Bookings
                </h2>
                {upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex gap-4 p-4 border border-border rounded-lg"
                      >
                        <img
                          src={booking.image}
                          alt={booking.title}
                          className="w-32 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {booking.title}
                          </h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4" />
                            <span>{booking.location}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{booking.date}</span>
                            </div>
                            <span className="text-muted-foreground">
                              {booking.duration}
                            </span>
                            <span className="font-semibold text-foreground">
                              {booking.amount}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm">View Details</Button>
                          <Button size="sm" variant="outline">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No upcoming bookings
                  </p>
                )}
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6 text-foreground">
                  Past Bookings
                </h2>
                <div className="space-y-4">
                  {pastBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex gap-4 p-4 border border-border rounded-lg"
                    >
                      <img
                        src={booking.image}
                        alt={booking.title}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {booking.title}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                          <MapPin className="h-4 w-4" />
                          <span>{booking.location}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.date}</span>
                          </div>
                          <span className="text-muted-foreground">
                            {booking.duration}
                          </span>
                          <span className="font-semibold text-foreground">
                            {booking.amount}
                          </span>
                        </div>
                      </div>
                      {!booking.rated && (
                        <Button size="sm" variant="outline">
                          Rate & Review
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="account">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6 text-foreground">
                  Account Settings
                </h2>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({ ...profileData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({ ...profileData, phone: e.target.value })
                      }
                    />
                  </div>
                  <Button type="submit">Save Changes</Button>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="payment">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6 text-foreground">
                  Payment Methods
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          •••• •••• •••• 4242
                        </p>
                        <p className="text-sm text-muted-foreground">Expires 12/25</p>
                      </div>
                    </div>
                    <Badge variant="success">Default</Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    Add Payment Method
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
