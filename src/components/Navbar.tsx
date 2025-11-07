import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, PlusCircle, Settings } from "lucide-react";
import NotificationCenter from "./NotificationCenter";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              EventosUSM
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button 
                variant={isActive("/") ? "default" : "ghost"}
                className="transition-smooth"
              >
                Eventos
              </Button>
            </Link>
            <Link to="/propose">
              <Button 
                variant={isActive("/propose") ? "default" : "ghost"}
                className="gap-2 transition-smooth"
              >
                <PlusCircle className="h-4 w-4" />
                Proponer Evento
              </Button>
            </Link>
            <NotificationCenter />
            <Link to="/admin">
              <Button 
                variant={isActive("/admin") ? "default" : "ghost"}
                className="gap-2 transition-smooth"
              >
                <Settings className="h-4 w-4" />
                Administración
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
