import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export const SearchBar = ({ 
  placeholder = "Where do you want to park?", 
  onSearch,
  className = "" 
}: SearchBarProps) => {
  return (
    <div className={`flex w-full max-w-3xl gap-2 ${className}`}>
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          className="pl-10 h-14 text-base shadow-soft border-border/50 focus:border-primary"
        />
      </div>
      <Button size="lg" className="h-14 px-8">
        <Search className="h-5 w-5" />
        Search
      </Button>
    </div>
  );
};
