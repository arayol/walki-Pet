
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ClientsSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const ClientsSearch = ({ searchTerm, onSearchChange }: ClientsSearchProps) => {
  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
        <Input
          placeholder="Buscar clientes ou pets..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};
