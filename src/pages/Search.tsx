import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { ParkingCard } from "@/components/ParkingCard";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { SlidersHorizontal, Map } from "lucide-react";
import coveredParking from "@/assets/parking-covered.jpg";
import outdoorParking from "@/assets/parking-outdoor.jpg";
import evParking from "@/assets/parking-ev.jpg";

const Search = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100]);

  const searchResults = [
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
    {
      id: "4",
      title: "Downtown Parking - Rothschild Blvd",
      location: "Tel Aviv",
      image: coveredParking,
      price: 50,
      rating: 4.7,
      reviews: 95,
      features: ["Central Location", "Secure", "Monthly"],
      covered: true,
      evCharger: false,
    },
    {
      id: "5",
      title: "Beach Area Parking",
      location: "Tel Aviv",
      image: outdoorParking,
      price: 40,
      rating: 4.5,
      reviews: 68,
      features: ["Near Beach", "Open Air", "Daily"],
      covered: false,
      evCharger: false,
    },
    {
      id: "6",
      title: "Shopping Mall Underground",
      location: "Haifa",
      image: evParking,
      price: 48,
      rating: 4.8,
      reviews: 142,
      features: ["Mall Access", "EV Ready", "Covered"],
      covered: true,
      evCharger: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <SearchBar />
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-80 flex-shrink-0`}>
            <Card className="p-6 space-y-6 sticky top-24">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Filters</h2>
                <Button variant="ghost" size="sm" className="text-primary">
                  Clear All
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Price Range (₪/day)</h3>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>₪{priceRange[0]}</span>
                  <span>₪{priceRange[1]}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Parking Type</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="covered" />
                    <Label htmlFor="covered">Covered</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="outdoor" />
                    <Label htmlFor="outdoor">Outdoor</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="private" />
                    <Label htmlFor="private">Private</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="shared" />
                    <Label htmlFor="shared">Shared</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="ev-charger" />
                    <Label htmlFor="ev-charger">EV Charger</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="accessible" />
                    <Label htmlFor="accessible">Accessible</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="security" />
                    <Label htmlFor="security">Security Camera</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="instant" />
                    <Label htmlFor="instant">Instant Booking</Label>
                  </div>
                </div>
              </div>
            </Card>
          </aside>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {searchResults.length} Parking Spots Found
                </h1>
                <p className="text-muted-foreground">in Tel Aviv and nearby</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
                <Button variant="outline" size="sm">
                  <Map className="h-4 w-4" />
                  Map View
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {searchResults.map((parking) => (
                <ParkingCard key={parking.id} {...parking} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
