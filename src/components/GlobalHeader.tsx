
import { Bell, Grid, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export const GlobalHeader = () => {
  return (
    <header className="border-b h-16 bg-white">
      <div className="h-full flex items-center justify-between px-6">
        <div className="flex items-center space-x-8">
          <span className="text-xl font-semibold">Aerchain</span>
          <nav className="flex items-center space-x-6">
            <Button variant="ghost" className="text-gray-600">
              <Grid className="h-4 w-4 mr-2" />
              Module
            </Button>
            <Button variant="ghost" className="text-gray-600">Purchase order</Button>
            <Button variant="ghost" className="text-gray-600">Invoices</Button>
            <Button variant="ghost" className="text-gray-600">Budgets</Button>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </header>
  );
};
