import { MapPin, Star, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface ParkingCardProps {
  id: string;
  title: string;
  location: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  features: string[];
  covered?: boolean;
  evCharger?: boolean;
}

export const ParkingCard = ({
  id,
  title,
  location,
  image,
  price,
  rating,
  reviews,
  features,
  covered,
  evCharger,
}: ParkingCardProps) => {
  return (
    <Link to={`/parking/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {covered && (
            <Badge variant="accent" className="absolute top-3 left-3">
              Covered
            </Badge>
          )}
          {evCharger && (
            <Badge variant="success" className="absolute top-3 right-3">
              <Zap className="h-3 w-3 mr-1" />
              EV
            </Badge>
          )}
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {title}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span>{rating}</span>
              <span className="text-muted-foreground">({reviews})</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
          <div className="pt-2 border-t border-border">
            <span className="text-xl font-bold text-primary">₪{price}</span>
            <span className="text-sm text-muted-foreground">/day</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};
