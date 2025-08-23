
import { Star, MapPin, Phone } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface WalkerData {
  walker_id: string;
  slug: string;
  phone?: string;
  location?: string;
  rating?: number;
  profiles: {
    name: string;
    email: string;
  };
}

interface WalkerInfoCardProps {
  walker: WalkerData;
}

export const WalkerInfoCard = ({ walker }: WalkerInfoCardProps) => {
  return (
    <Card className="mb-8 shadow-lg border-2 border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-white">
                {walker.profiles?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'DW'}
              </span>
            </div>
            <div>
              <CardTitle className="text-2xl text-blue-800">
                {walker.profiles?.name || 'Dog Walker'}
              </CardTitle>
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                  <span className="text-sm text-gray-600">{walker.rating || '5.0'}</span>
                </div>
                {walker.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">{walker.location}</span>
                  </div>
                )}
                {walker.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">{walker.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
