import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import {
  MapPin,
  Star,
  Zap,
  Shield,
  Wifi,
  Camera,
  Clock,
  ArrowLeft,
  User,
  MessageCircle,
  Loader2,
} from "lucide-react";
import coveredParking from "@/assets/parking-covered.jpg";

// --- 1. Interface for FINAL CORRECT API Response Data ---
interface ApiParkingData {
    _id: string;
    owner: string; 
    name: string;
    description: string;
    photos: string[]; 
    address: { 
        street: string; 
        city: string; 
        region: string; // Corrected: Using 'region'
        zip: string;
    };
    prices: { 
        hourly: number; 
        daily?: number; 
        monthly?: number; 
    }; // Corrected: Nested prices object
    parkingType: string;
    features: string[]; 
    currency: string;
    averageRating: number;
    reviewCount: number;
    totalBookings: number;
    isActive: boolean;
}

// --- 2. Interface for Component Render Data (Matches UI structure) ---
interface RenderParkingData {
    id: string;
    title: string;
    location: string;
    images: string[];
    price: number; 
    priceHourly: number; 
    priceMonthly: number; 
    currency: string;
    rating: number;
    reviews: number;
    description: string;
    features: { icon: React.ElementType; label: string }[];
    specifications: {
        covered: boolean;
        width: string; 
        length: string; 
        height: string; 
        surface: string; 
        access: string; 
    };
    owner: {
        name: string; 
        joined: string; 
        reviews: number; 
        rating: number; 
    };
}

// Map feature strings from the API to displayable icons/labels
const featureIconMap: { [key: string]: { icon: React.ElementType; label: string } } = {
    "cctv": { icon: Camera, label: "CCTV" },
    "covered": { icon: Shield, label: "Covered" },
    "ev charging": { icon: Zap, label: "EV Ready" },
    "gated": { icon: Wifi, label: "Gated Access" }, 
    "24/7 access": { icon: Clock, label: "24/7 Access" },
    "driveway": { icon: MapPin, label: "Driveway Spot" } // Example: You might map parkingType too
};

// Default data structure to avoid errors before loading
const defaultParkingData: RenderParkingData = {
    id: "",
    title: "Loading Parking Spot...",
    location: "Unknown Location",
    images: [coveredParking, coveredParking, coveredParking, coveredParking],
    price: 0,
    priceHourly: 0,
    priceMonthly: 0,
    currency: "ILS",
    rating: 0,
    reviews: 0,
    description: "Loading description...",
    features: [],
    specifications: {
        covered: false,
        width: "N/A",
        length: "N/A",
        height: "N/A",
        surface: "N/A",
        access: "N/A",
    },
    owner: {
        name: "Host",
        joined: "N/A",
        reviews: 0,
        rating: 0,
    },
};

const ParkingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [parkingData, setParkingData] = useState<RenderParkingData>(defaultParkingData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const { toast } = useToast();

  // --- Data Fetching Logic ---
  useEffect(() => {
    if (!id) return;

    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/v1/parkings/${id}`);
        const result = await response.json();

        if (!response.ok || result.status !== 'success') {
          throw new Error(result.message || "Failed to fetch parking details.");
        }
        
        const apiData: ApiParkingData = result.data;

        // --- MAPPING API DATA TO RENDER DATA ---
        const isCovered = apiData.features.some(f => f.toLowerCase() === 'covered');
        
        const mappedData: RenderParkingData = {
            id: apiData._id,
            title: apiData.name,
            // Use City and Region for the display location
            location: `${apiData.address.city}, ${apiData.address.region}`,
            images: apiData.photos.length > 0 ? apiData.photos : defaultParkingData.images,
            
            // Prices are now correctly pulled from the nested object
            price: apiData.prices.daily || apiData.prices.hourly * 24, // Main display is daily
            priceHourly: apiData.prices.hourly,
            priceMonthly: apiData.prices.monthly || 0,
            currency: apiData.currency,

            rating: apiData.averageRating,
            reviews: apiData.reviewCount,
            description: apiData.description,
            
            // Map features
            features: apiData.features
                .map(f => featureIconMap[f.toLowerCase()])
                .filter((f): f is { icon: React.ElementType; label: string } => !!f),
            
            specifications: {
                covered: isCovered,
                // Specifications are hardcoded/placeholders until you add them to the schema/API
                width: "2.5m", 
                length: "5m",
                height: isCovered ? "2.1m" : "N/A", // Assume height is only relevant for covered spots
                surface: apiData.parkingType, // Reusing parkingType as surface
                access: apiData.features.includes("24/7 Access") ? "24/7" : "Limited", 
            },
            
            // Owner is still placeholder until you integrate the owner object population
            owner: {
                name: "David Cohen", 
                joined: "2022", 
                reviews: 45, 
                rating: 4.9, 
            },
        };

        setParkingData(mappedData);

      } catch (err: any) {
        console.error("Error fetching parking details:", err);
        setError(err.message || "Could not load parking spot details.");
        toast({
            variant: "destructive",
            title: "Data Error",
            description: err.message || "Failed to load parking spot.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id, toast]); 

  // --- Hardcoded Reviews List (Retained for UI display) ---
  // TODO Fetching
  const reviewsList = [
    {
      id: 1,
      author: "Sarah L.",
      rating: 5,
      date: "2 weeks ago",
      comment: "Perfect location, very secure and clean. Highly recommend!",
    },
    {
      id: 2,
      author: "Michael R.",
      rating: 5,
      date: "1 month ago",
      comment: "Great spot, easy access and the owner is very responsive.",
    },
    {
      id: 3,
      author: "Rachel K.",
      rating: 4,
      date: "2 months ago",
      comment: "Good parking spot, slightly tight for larger vehicles but overall excellent.",
    },
  ];
  
  // --- Conditional Rendering for Loading and Error States ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary mr-3" />
        <h1 className="text-xl text-foreground">Loading details...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-3xl font-bold text-red-500 mb-4">Error Loading Parking Spot</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Link to="/search">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Search
              </Button>
            </Link>
        </div>
      </div>
    );
  }

  // --- Main Render Content (Now uses fetched data) ---
  const serviceFee = 5;
  const totalCost = parkingData.price + serviceFee;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Link to="/search">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
        </Link>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 rounded-xl overflow-hidden">
          <div className="md:col-span-1">
            <img
              src={parkingData.images[0]}
              alt="Main parking view"
              className="w-full h-[400px] object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {parkingData.images.slice(1, 4).map((imgUrl, index) => (
                <div key={index} className={index === 2 ? "col-span-2 relative" : ""}>
                    <img
                        src={imgUrl}
                        alt={`Parking view ${index + 2}`}
                        className="w-full h-[196px] object-cover"
                    />
                    {index === 2 && ( 
                        <Button
                            variant="secondary"
                            className="absolute bottom-4 right-4"
                            size="sm"
                        >
                            View All Photos
                        </Button>
                    )}
                </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {parkingData.title}
                  </h1>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{parkingData.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <span className="font-medium text-foreground">{parkingData.rating.toFixed(1)}</span>
                      <span>({parkingData.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {parkingData.specifications.covered && (
                    <Badge variant="accent">Covered</Badge>
                  )}
                  {parkingData.features.some(f => f.label === 'EV Ready') && (
                    <Badge variant="success">
                      <Zap className="h-3 w-3 mr-1" />
                      EV Ready
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-muted-foreground">{parkingData.description || "No description provided."}</p>
            </div>

            {/* Features */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {parkingData.features.length > 0 ? (
                    parkingData.features.map((feature, index) => (
                      <div key={index} className="flex flex-col items-center text-center gap-2">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <feature.icon className="h-6 w-6" />
                        </div>
                        <span className="text-sm text-muted-foreground">{feature.label}</span>
                      </div>
                    ))
                ) : (
                    <p className="text-muted-foreground col-span-4">No special features listed.</p>
                )}
              </div>
            </Card>

            {/* Specifications */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Specifications</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <span className="ml-2 font-medium text-foreground">
                    {parkingData.specifications.covered ? "Covered" : "Outdoor"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Surface:</span>
                  <span className="ml-2 font-medium text-foreground">
                    {parkingData.specifications.surface}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Dimensions:</span>
                  <span className="ml-2 font-medium text-foreground">
                    {parkingData.specifications.width} × {parkingData.specifications.length}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Height:</span>
                  <span className="ml-2 font-medium text-foreground">
                    {parkingData.specifications.height}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Access:</span>
                  <span className="ml-2 font-medium text-foreground">
                    {parkingData.specifications.access}
                  </span>
                </div>
              </div>
            </Card>

            {/* Owner Info */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">
                Hosted by {parkingData.owner.name}
              </h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{parkingData.owner.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Joined {parkingData.owner.joined}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <span className="text-sm font-medium">{parkingData.owner.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({parkingData.owner.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
            </Card>

            {/* Reviews */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Reviews</h2>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-warning text-warning" />
                  <span className="text-lg font-semibold">{parkingData.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">
                    ({parkingData.reviews} reviews)
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                {reviewsList.map((review) => (
                  <div key={review.id} className="border-b border-border pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{review.author}</span>
                        <div className="flex">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-3 w-3 fill-warning text-warning"
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 space-y-6 shadow-xl">
              <div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-primary">
                    {parkingData.currency}{parkingData.price}
                  </span>
                  <span className="text-muted-foreground">/day</span>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div>
                    <Clock className="h-4 w-4 inline mr-1" />
                    {parkingData.currency}{parkingData.priceHourly}/hour
                  </div>
                  {parkingData.priceMonthly > 0 && <div>{parkingData.currency}{parkingData.priceMonthly}/month</div>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Select Date
                </label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-lg border border-border p-3"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{parkingData.currency}{parkingData.price} × 1 day</span>
                  <span className="text-foreground">{parkingData.currency}{parkingData.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service fee</span>
                  <span className="text-foreground">{parkingData.currency}{serviceFee}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">{parkingData.currency}{totalCost}</span>
                </div>
              </div>

              <Button className="w-full" size="lg">
                Book Now
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                You won't be charged yet
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingDetails;