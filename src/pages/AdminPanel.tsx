import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Clock, 
  Building2, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  MessageSquare
} from "lucide-react";
import { mockEvents } from "@/data/mockEvents";
import { Event, EventApprovalStatus } from "@/types/event";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

const AdminPanel = () => {
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  // Separate events by approval status
  const pendingEvents = mockEvents.filter(event => event.approvalStatus === "pending");
  const needsChangesEvents = mockEvents.filter(event => event.approvalStatus === "needs-changes");
  const rejectedEvents = mockEvents.filter(event => event.approvalStatus === "rejected");
  const approvedEvents = mockEvents.filter(event => event.approvalStatus === "approved");

  const handleApprove = (event: Event) => {
    // In a real app, this would make an API call
    toast({
      title: "Evento aprobado",
      description: `El evento "${event.title}" ha sido aprobado y publicado.`,
    });
    setSelectedEvent(null);
  };

  const handleReject = (event: Event) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Debes proporcionar una razón para el rechazo.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would make an API call
    toast({
      title: "Evento rechazado",
      description: `El evento "${event.title}" ha sido rechazado.`,
      variant: "destructive",
    });
    setSelectedEvent(null);
    setRejectionReason("");
  };

  const handleRequestChanges = (event: Event) => {
    if (!adminNotes.trim()) {
      toast({
        title: "Error",
        description: "Debes proporcionar notas sobre los cambios requeridos.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would make an API call
    toast({
      title: "Cambios solicitados",
      description: `Se han solicitado cambios para el evento "${event.title}".`,
    });
    setSelectedEvent(null);
    setAdminNotes("");
  };

  const getAudienceLabel = (audience: string) => {
    switch (audience) {
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
        return "Departamento Específico";
    }
  };

  const getAudienceBadgeColor = (audience: string) => {
    switch (audience) {
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

  const getStatusBadge = (status: EventApprovalStatus) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" />Pendiente</Badge>;
      case "approved":
        return <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" />Aprobado</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Rechazado</Badge>;
      case "needs-changes":
        return <Badge variant="secondary" className="gap-1"><AlertCircle className="h-3 w-3" />Requiere Cambios</Badge>;
    }
  };

  const EventCard = ({ event }: { event: Event }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {event.shortDescription}
            </CardDescription>
          </div>
          {getStatusBadge(event.approvalStatus)}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(parseISO(event.date), "d MMM", { locale: es })}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <Badge 
              variant="outline" 
              className={getAudienceBadgeColor(event.audience)}
            >
              {getAudienceLabel(event.audience)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>{event.cost === 0 ? "Gratuito" : `$${event.cost.toLocaleString()}`}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4" />
          <span className="line-clamp-1">{event.organizer}</span>
        </div>

        {event.proposedBy && (
          <div className="text-xs text-muted-foreground">
            Propuesto por: {event.proposedBy}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={() => setSelectedEvent(event)}
          >
            <Eye className="h-4 w-4" />
            Revisar
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Panel de Administración</h1>
            <p className="text-muted-foreground">
              Gestiona las propuestas de eventos y mantén el portal actualizado
            </p>
          </div>

          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending" className="gap-2">
                <Clock className="h-4 w-4" />
                Pendientes ({pendingEvents.length})
              </TabsTrigger>
              <TabsTrigger value="changes" className="gap-2">
                <AlertCircle className="h-4 w-4" />
                Cambios ({needsChangesEvents.length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="gap-2">
                <XCircle className="h-4 w-4" />
                Rechazados ({rejectedEvents.length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Aprobados ({approvedEvents.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              {pendingEvents.length === 0 && (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No hay eventos pendientes de aprobación</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="changes" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {needsChangesEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              {needsChangesEvents.length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No hay eventos que requieran cambios</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rejectedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              {rejectedEvents.length === 0 && (
                <div className="text-center py-12">
                  <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No hay eventos rechazados</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              {approvedEvents.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No hay eventos aprobados</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Event Review Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedEvent.title}</h2>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedEvent.approvalStatus)}
                    <Badge variant="outline">{selectedEvent.category}</Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEvent(null)}
                >
                  ×
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Event Details */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Detalles del Evento</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Descripción</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedEvent.description}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <Label className="text-sm font-medium">Fecha</Label>
                          <p className="text-muted-foreground">
                            {format(parseISO(selectedEvent.date), "d 'de' MMMM, yyyy", { locale: es })}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Horario</Label>
                          <p className="text-muted-foreground">{selectedEvent.time}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Ubicación</Label>
                          <p className="text-muted-foreground">{selectedEvent.location}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Costo</Label>
                          <p className="text-muted-foreground">
                            {selectedEvent.cost === 0 ? "Gratuito" : `$${selectedEvent.cost.toLocaleString()}`}
                          </p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Organizador</Label>
                        <p className="text-muted-foreground">{selectedEvent.organizer}</p>
                        <p className="text-muted-foreground text-xs">{selectedEvent.organizerEmail}</p>
                      </div>

                      {selectedEvent.proposedBy && (
                        <div>
                          <Label className="text-sm font-medium">Propuesto por</Label>
                          <p className="text-muted-foreground">{selectedEvent.proposedBy}</p>
                          <p className="text-muted-foreground text-xs">
                            {selectedEvent.proposedAt && format(parseISO(selectedEvent.proposedAt), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Admin Actions */}
                <div className="space-y-4">
                  {selectedEvent.approvalStatus === "pending" && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Acciones de Administración</CardTitle>
                        <CardDescription>
                          Revisa el evento y decide si aprobarlo, rechazarlo o solicitar cambios
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleApprove(selectedEvent)}
                            className="flex-1 gap-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Aprobar
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleReject(selectedEvent)}
                            className="flex-1 gap-2"
                          >
                            <XCircle className="h-4 w-4" />
                            Rechazar
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="adminNotes">Notas para cambios (opcional)</Label>
                          <Textarea
                            id="adminNotes"
                            placeholder="Especifica qué cambios se requieren..."
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            rows={3}
                          />
                          <Button
                            variant="outline"
                            onClick={() => handleRequestChanges(selectedEvent)}
                            className="w-full gap-2"
                          >
                            <MessageSquare className="h-4 w-4" />
                            Solicitar Cambios
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {selectedEvent.approvalStatus === "rejected" && selectedEvent.rejectionReason && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Razón del Rechazo</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {selectedEvent.rejectionReason}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {selectedEvent.approvalStatus === "needs-changes" && selectedEvent.adminNotes && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Cambios Requeridos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {selectedEvent.adminNotes}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {selectedEvent.approvalStatus === "approved" && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Evento Aprobado</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Este evento ha sido aprobado y está visible en el portal público.
                        </p>
                        {selectedEvent.approvedBy && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Aprobado por: {selectedEvent.approvedBy}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
