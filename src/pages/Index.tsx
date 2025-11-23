import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { ParkingCard } from "@/components/ParkingCard";
import { Button } from "@/components/ui/button";
import { MapPin, Shield, Zap, Clock } from "lucide-react";
import heroImage from "@/assets/hero-parking.jpg";
import coveredParking from "@/assets/parking-covered.jpg";
import outdoorParking from "@/assets/parking-outdoor.jpg";
import evParking from "@/assets/parking-ev.jpg";

const Index = () => {
  const popularCities = [
    { name: "Tel Aviv", count: 1250 },
    { name: "Jerusalem", count: 890 },
    { name: "Haifa", count: 645 },
    { name: "Nazareth", count: 420 },
  ];

  const featuredParkings = [
    {
      id: "1",
      title: "Private Covered Parking Near Azrieli",
      location: "Tel Aviv Center",
      image: coveredParking,
      price: 45,
      rating: 4.8,
      reviews: 127,
      features: ["24/7 Access", "Security Camera", "Gate Code"],
      covered: true,
      evCharger: false,
    },
    {
      id: "2",
      title: "Secure Outdoor Parking - Old City",
      location: "Jerusalem",
      image: outdoorParking,
      price: 35,
      rating: 4.6,
      reviews: 84,
      features: ["Well-Lit", "Paved", "Accessible"],
      covered: false,
      evCharger: false,
    },
    {
      id: "3",
      title: "EV Charging Garage - Carmel Center",
      location: "Haifa",
      image: evParking,
      price: 55,
      rating: 4.9,
      reviews: 156,
      features: ["Fast Charging", "Covered", "24/7"],
      covered: true,
      evCharger: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Parking in Israel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground animate-fade-in">
            Find Your Perfect
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Parking Spot
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover and rent parking spaces across Israel. Simple, secure, and affordable.
          </p>
          <SearchBar className="mx-auto" />
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Popular Areas in Israel
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularCities.map((city) => (
              <Button
                key={city.name}
                variant="outline"
                size="lg"
                className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              >
                <MapPin className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-semibold">{city.name}</div>
                  <div className="text-xs opacity-80">{city.count} spots</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Parking Spots */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-foreground">Featured Parking Spots</h2>
            <Button variant="ghost" className="text-primary">
              View All →
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredParkings.map((parking) => (
              <ParkingCard key={parking.id} {...parking} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Why Choose ParkSpot?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Secure & Safe</h3>
              <p className="text-muted-foreground">
                All parking spots are verified and monitored for your peace of mind
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Instant Booking</h3>
              <p className="text-muted-foreground">
                Book your parking spot instantly with just a few clicks
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 text-success">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">24/7 Access</h3>
              <p className="text-muted-foreground">
                Access your parking spot any time with flexible booking options
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Have a Parking Spot to Rent?
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Join thousands of parking owners earning extra income by renting out their spaces
          </p>
          <Button size="xl" variant="secondary" className="shadow-xl">
            List Your Spot
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-foreground">ParkSpot</h3>
              <p className="text-sm text-muted-foreground">
                The easiest way to find and rent parking spots across Israel
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Safety</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2024 ParkSpot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
