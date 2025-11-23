import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Avatar } from "@/components/ui/avatar";
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
} from "lucide-react";
import coveredParking from "@/assets/parking-covered.jpg";

const ParkingDetails = () => {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const parkingData = {
    id: "1",
    title: "Private Covered Parking Near Azrieli",
    location: "Tel Aviv Center, Israel",
    images: [coveredParking, coveredParking, coveredParking],
    price: 45,
    priceHourly: 8,
    priceMonthly: 900,
    rating: 4.8,
    reviews: 127,
    description:
      "Secure covered parking spot in the heart of Tel Aviv, just 2 minutes walk from Azrieli Center. Perfect for daily commuters and visitors. The spot is spacious and easily accessible.",
    features: [
      { icon: Shield, label: "24/7 Security" },
      { icon: Camera, label: "CCTV" },
      { icon: Zap, label: "EV Ready" },
      { icon: Wifi, label: "Gate Code Access" },
    ],
    specifications: {
      covered: true,
      width: "2.5m",
      length: "5m",
      height: "2.1m",
      surface: "Paved",
      access: "24/7",
    },
    owner: {
      name: "David Cohen",
      joined: "2022",
      reviews: 45,
      rating: 4.9,
    },
  };

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
            <img
              src={parkingData.images[1]}
              alt="Parking view 2"
              className="w-full h-[196px] object-cover"
            />
            <img
              src={parkingData.images[2]}
              alt="Parking view 3"
              className="w-full h-[196px] object-cover"
            />
            <div className="col-span-2 relative">
              <img
                src={parkingData.images[0]}
                alt="Parking view 4"
                className="w-full h-[196px] object-cover"
              />
              <Button
                variant="secondary"
                className="absolute bottom-4 right-4"
                size="sm"
              >
                View All Photos
              </Button>
            </div>
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
                      <span className="font-medium text-foreground">{parkingData.rating}</span>
                      <span>({parkingData.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {parkingData.specifications.covered && (
                    <Badge variant="accent">Covered</Badge>
                  )}
                  <Badge variant="success">
                    <Zap className="h-3 w-3 mr-1" />
                    EV Ready
                  </Badge>
                </div>
              </div>

              <p className="text-muted-foreground">{parkingData.description}</p>
            </div>

            {/* Features */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {parkingData.features.map((feature, index) => (
                  <div key={index} className="flex flex-col items-center text-center gap-2">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature.label}</span>
                  </div>
                ))}
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
                  <span className="text-lg font-semibold">{parkingData.rating}</span>
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
                    ₪{parkingData.price}
                  </span>
                  <span className="text-muted-foreground">/day</span>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div>
                    <Clock className="h-4 w-4 inline mr-1" />
                    ₪{parkingData.priceHourly}/hour
                  </div>
                  <div>₪{parkingData.priceMonthly}/month</div>
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
                  <span className="text-muted-foreground">₪{parkingData.price} × 1 day</span>
                  <span className="text-foreground">₪{parkingData.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service fee</span>
                  <span className="text-foreground">₪5</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">₪{parkingData.price + 5}</span>
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
