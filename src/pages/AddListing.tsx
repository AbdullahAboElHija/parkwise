import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- New Import
import { useToast } from '@/components/ui/use-toast'; // <-- New Import (assuming path)
import { MapPin, DollarSign, ParkingCircle } from 'lucide-react'; 

// Import UI components based on your directory structure
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

// ==========================================
// 1. TYPE DEFINITIONS (Unchanged)
// ==========================================

type ParkingType = 'Driveway' | 'Garage' | 'Street' | 'Lot' | 'Basement';

interface FormData {
  name: string;
  description: string;
  street: string;
  city: string;
  region: string;
  zip: string;
  parkingType: ParkingType;
  features: string[];
  tags: string; 
  hourlyPrice: number;
  dailyPrice: number | ''; 
  monthlyPrice: number | ''; 
  longitude: number | '';
  latitude: number | '';
}

// ==========================================
// 2. CONSTANTS (Unchanged)
// ==========================================
const PARKING_TYPES: ParkingType[] = ['Driveway', 'Garage', 'Street', 'Lot', 'Basement'];
const FEATURES_OPTIONS = ['CCTV', 'Covered', 'EV Charging', 'Gated', '24/7 Access', 'Handicap'];

// ==========================================
// 3. COMPONENT
// ==========================================
const AddListing: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    street: '',
    city: '',
    region: '',
    zip: '',
    parkingType: PARKING_TYPES[0],
    features: [],
    tags: '',
    hourlyPrice: 0,
    dailyPrice: '',
    monthlyPrice: '',
    longitude: '',
    latitude: '',
  });
  
  const [isLoading, setIsLoading] = useState(false); // <-- New state
  const navigate = useNavigate(); // <-- Hook call
  const { toast } = useToast(); // <-- Hook call

  // Input change handlers (handleInputChange, handleSelectChange, handleCheckboxChange) 
  // ... (These remain the same as the previous response) ...
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'number') {
            const numValue = value === '' ? '' : parseFloat(value);
            setFormData(prev => ({ ...prev, [name]: numValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
        
    const handleSelectChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            parkingType: value as ParkingType,
        }));
    };

    const handleCheckboxChange = (featureValue: string, isChecked: boolean) => {
        setFormData(prev => ({
            ...prev,
            features: isChecked
                ? [...prev.features, featureValue]
                : prev.features.filter(feature => feature !== featureValue),
        }));
    };


  // ==========================================
  // 4. CUSTOM SUBMIT HANDLER
  // ==========================================

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // --- 1. Data Cleaning and Validation ---
    
    // Check required coordinate fields
    if (formData.longitude === '' || formData.latitude === '') {
        toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Please provide both Longitude and Latitude.",
        });
        setIsLoading(false);
        return; 
    }

    // Prepare final data object for the API
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    const finalParkingData = {
        // NOTE: The 'owner' field will be set by the server using the token.
        name: formData.name,
        description: formData.description,
        address: { 
            street: formData.street, 
            city: formData.city, 
            region: formData.region, 
            zip: formData.zip 
        },
        location: {
            type: 'Point',
            coordinates: [formData.longitude as number, formData.latitude as number],
        },
        parkingType: formData.parkingType,
        features: formData.features,
        tags: tagsArray,
        prices: {
            hourly: formData.hourlyPrice,
            ...(formData.dailyPrice !== '' && { daily: formData.dailyPrice as number }),
            ...(formData.monthlyPrice !== '' && { monthly: formData.monthlyPrice as number }),
        },
        currency: 'ILS',
    };
    
    // Retrieve authentication token
    const token = localStorage.getItem("token");
    if (!token) {
         toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to create a listing.",
        });
        setIsLoading(false);
        // Navigate to login if no token is found
        navigate("/login"); 
        return;
    }


    // --- 2. API Request ---
    try {
        const response = await fetch("/api/v1/parkings", { // <-- Corrected Endpoint
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // <-- Crucial Authorization Header
            },
            body: JSON.stringify(finalParkingData),
        });

        const data = await response.json();

        if (!response.ok) {
            // Handle HTTP error status codes (4xx, 5xx)
            throw new Error(data.message || "Failed to create listing.");
        }

        // --- 3. Success Handling ---
        toast({
            title: "Listing Created! 🎉",
            description: `Your parking spot "${data.data.name}" is now live!`,
        });

        // Navigate to the newly created parking details page or the dashboard
        navigate(`/parking/${data.data._id}`);

    } catch (error: any) {
        // --- 4. Error Handling ---
        console.error("Listing submission error:", error);
        toast({
            variant: "destructive",
            title: "Submission Failed",
            description: error.message || "An unexpected error occurred. Please try again.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl text-blue-600">➕ Create New Parking Listing</CardTitle>
          <CardDescription>
            Enter the details for your available parking slot. Fields marked with <span className="text-red-500">*</span> are required.
          </CardDescription>
        </CardHeader>
        <Separator className="mb-6" />
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* ... (Form Fields: Listing Details, Location, Features, Pricing) ... */}
            
            {/* --- 1. Display Info --- */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-700">
                    <ParkingCircle className="w-5 h-5" /> Listing Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Listing Name <span className="text-red-500">*</span></Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Downtown Secure Garage Spot"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="parkingType">Parking Type <span className="text-red-500">*</span></Label>
                        <Select onValueChange={handleSelectChange} value={formData.parkingType} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a parking type" />
                            </SelectTrigger>
                            <SelectContent>
                                {PARKING_TYPES.map(type => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe access instructions, security, and vehicle size limits."
                    />
                </div>
            </div>

            <Separator />

            {/* --- 2. Location --- */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-700">
                    <MapPin className="w-5 h-5" /> Location & Coordinates
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="street">Street Address <span className="text-red-500">*</span></Label>
                        <Input id="street" name="street" value={formData.street} onChange={handleInputChange} required placeholder="123 Main St" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                        <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required placeholder="Tel Aviv" />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="region">Region/State</Label>
                        <Input id="region" name="region" value={formData.region} onChange={handleInputChange} placeholder="Central District" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="zip">ZIP/Postal Code <span className="text-red-500">*</span></Label>
                        <Input id="zip" name="zip" value={formData.zip} onChange={handleInputChange} required placeholder="61000" />
                    </div>
                </div>
                
                {/* Coordinates */}
                <h4 className="text-base font-medium mt-4 pt-2 border-t border-dashed">Coordinates for Map</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="longitude">Longitude <span className="text-red-500">*</span></Label>
                        <Input type="number" step="any" id="longitude" name="longitude" value={formData.longitude} onChange={handleInputChange} required placeholder="e.g., 34.7818" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="latitude">Latitude <span className="text-red-500">*</span></Label>
                        <Input type="number" step="any" id="latitude" name="latitude" value={formData.latitude} onChange={handleInputChange} required placeholder="e.g., 32.0853" />
                    </div>
                </div>
            </div>

            <Separator />

            {/* --- 3. Features & Tags --- */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700">Key Features & Tags</h3>
                
                <Label className="block mb-2">Features</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4">
                    {FEATURES_OPTIONS.map(feature => (
                        <div key={feature} className="flex items-center space-x-2">
                            <Checkbox 
                                id={`feature-${feature}`}
                                checked={formData.features.includes(feature)}
                                onCheckedChange={(checked) => handleCheckboxChange(feature, checked as boolean)}
                            />
                            <Label htmlFor={`feature-${feature}`} className="font-normal cursor-pointer">
                                {feature}
                            </Label>
                        </div>
                    ))}
                </div>

                <div className="space-y-2 pt-4">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        placeholder="e.g., cheap, near train station, instant book (separate with commas)"
                    />
                </div>
            </div>

            <Separator />

            {/* --- 4. Pricing --- */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-700">
                    <DollarSign className="w-5 h-5" /> Pricing (ILS)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="hourlyPrice">Hourly Price <span className="text-red-500">*</span></Label>
                        <Input type="number" id="hourlyPrice" name="hourlyPrice" value={formData.hourlyPrice} onChange={handleInputChange} required min="0" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dailyPrice">Daily Price (Optional)</Label>
                        <Input type="number" id="dailyPrice" name="dailyPrice" value={formData.dailyPrice} onChange={handleInputChange} min="0" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="monthlyPrice">Monthly Price (Optional)</Label>
                        <Input type="number" id="monthlyPrice" name="monthlyPrice" value={formData.monthlyPrice} onChange={handleInputChange} min="0" placeholder="0.00" />
                    </div>
                </div>
            </div>

            {/* --- Submit Button --- */}
            <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-6 text-lg font-bold"
                disabled={isLoading} // Disable button while loading
            >
              {isLoading ? 'Creating Listing...' : 'Publish Parking Listing'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddListing;