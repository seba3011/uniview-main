import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users, DollarSign, Clock, Building2, ExternalLink, ArrowLeft, AlertCircle, Edit } from "lucide-react";
import { mockEvents } from "@/data/mockEvents";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import EventRegistrationModal from "@/components/EventRegistrationModal";

const EventDetail = () => {
  const { id } = useParams();
  const event = mockEvents.find(e => e.id === id);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  if (!event) {
    return (
      <div>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Evento no encontrado</h1>
          <Link to="/">
            <Button>Volver a eventos</Button>
          </Link>
        </div>
      </div>
    );
  }

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
    <div>
      <div className="container mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a eventos
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Image */}
              <div className="aspect-video overflow-hidden rounded-lg bg-muted mb-6">
                {event.images && event.images.length > 0 ? (
                  <img
                    src={event.images[0]}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-hero">
                    <Calendar className="h-24 w-24 text-primary-foreground opacity-50" />
                  </div>
                )}
              </div>

              {/* Title and Audience Badge */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl md:text-4xl font-bold">{event.title}</h1>
                <Badge 
                  variant={getAudienceBadgeVariant()} 
                  className={`shrink-0 ${getAudienceBadgeColor()}`}
                >
                  <Users className="h-4 w-4 mr-1" />
                  {getAudienceLabel()}
                </Badge>
              </div>

              {/* Category */}
              <div className="flex items-center gap-2 mb-6">
                <Badge variant="outline">{event.category}</Badge>
              </div>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Descripción del Evento</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                </CardContent>
              </Card>

              {/* Organizer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Organizador
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{event.organizer}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="sticky top-20 space-y-6"
            >
              {/* Event Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Detalles del Evento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Fecha</p>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(event.date), "d 'de' MMMM, yyyy", { locale: es })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Horario</p>
                      <p className="text-sm text-muted-foreground">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Ubicación</p>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Costo</p>
                      <p className="text-sm text-muted-foreground">
                        {event.cost === 0 ? "Gratuito" : `$${event.cost.toLocaleString()} CLP`}
                      </p>
                    </div>
                  </div>

                  {event.capacity && (
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Capacidad</p>
                        <p className="text-sm text-muted-foreground">
                          {event.capacity} personas
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Registration Button */}
              <Button 
                className="w-full gap-2" 
                size="lg"
                onClick={() => setIsRegistrationModalOpen(true)}
              >
                Inscribirse al Evento
                <ExternalLink className="h-4 w-4" />
              </Button>

              {/* Request Changes Button */}
              <Link to={`/event/${event.id}/request-changes`}>
                <Button variant="outline" className="w-full gap-2" size="lg">
                  <Edit className="h-4 w-4" />
                  Solicitar Cambios
                </Button>
              </Link>

              {/* Last Updated Info */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium mb-1">Última actualización</p>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(event.lastUpdated), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        La información de este evento ha sido verificada y se mantiene actualizada.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <EventRegistrationModal
        event={event}
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
      />
    </div>
  );
};

export default EventDetail;
