import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, MapPin, Users } from "lucide-react";
import { Event } from "@/types/event";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const getAudienceBadgeVariant = () => {
    switch (event.audience) {
      case "open":
        return "default";
      case "university-only":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getAudienceLabel = () => {
    switch (event.audience) {
      case "open":
        return "Abierto al Público";
      case "university-only":
        return "Solo Universidad";
      case "students-only":
        return "Solo Estudiantes";
      case "faculty-only":
        return "Solo Profesores";
      case "staff-only":
        return "Solo Funcionarios";
      default:
        return event.audienceDetails || "Departamento Específico";
    }
  };

  const getAudienceBadgeColor = () => {
    switch (event.audience) {
      case "students-only":
        // Rojo para estudiantes de pregrado y postgrado
        return "border-transparent bg-red-500 text-white hover:bg-red-600";
      case "faculty-only":
      case "staff-only":
        // Azul para docentes y funcionarios
        return "border-transparent bg-blue-500 text-white hover:bg-blue-600";
      case "open":
        // Verde para externos
        return "border-transparent bg-green-500 text-white hover:bg-green-600";
      default:
        // Color por defecto para otros tipos
        return "";
    }
  };

  return (
    <Link to={`/event/${event.id}`}>
      <Card className="overflow-hidden hover:shadow-card-hover transition-smooth cursor-pointer group">
        <div className="aspect-video overflow-hidden bg-muted">
          {event.images && event.images.length > 0 ? (
            <img
              src={event.images[0]}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-hero">
              <Calendar className="h-16 w-16 text-primary-foreground opacity-50" />
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-smooth">
              {event.title}
            </h3>
            <Badge 
              variant={getAudienceBadgeVariant()} 
              className={`shrink-0 ${getAudienceBadgeColor()}`}
            >
              <Users className="h-3 w-3 mr-1" />
              {getAudienceLabel()}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {event.shortDescription}
          </p>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span>
                {format(parseISO(event.date), "d 'de' MMMM, yyyy", { locale: es })} - {event.time}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between">
          <span className="text-sm font-medium">
            {event.cost === 0 ? "Gratuito" : `$${event.cost.toLocaleString()}`}
          </span>
          <span className="text-xs text-muted-foreground">{event.category}</span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default EventCard;
