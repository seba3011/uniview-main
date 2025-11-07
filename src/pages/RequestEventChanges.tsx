import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Clock, 
  Building2, 
  ArrowLeft, 
  Send,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { mockEvents } from "@/data/mockEvents";
import { Event } from "@/types/event";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

// Schema de validación para solicitud de cambios
const changeRequestSchema = z.object({
  requesterName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  requesterEmail: z.string().email("Debes proporcionar un email válido"),
  requesterPhone: z.string().optional(),
  changeType: z.string().min(1, "Debes seleccionar el tipo de cambio"),
  currentValue: z.string().min(1, "Debes proporcionar el valor actual"),
  requestedValue: z.string().min(1, "Debes proporcionar el valor solicitado"),
  reason: z.string().min(10, "Debes explicar la razón del cambio (mínimo 10 caracteres)"),
  additionalInfo: z.string().optional(),
});

type ChangeRequestForm = z.infer<typeof changeRequestSchema>;

const RequestEventChanges = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ChangeRequestForm>({
    resolver: zodResolver(changeRequestSchema),
  });

  const watchedChangeType = watch("changeType");

  useEffect(() => {
    const foundEvent = mockEvents.find(e => e.id === id);
    if (foundEvent) {
      setEvent(foundEvent);
    }
  }, [id]);

  const onSubmit = async (data: ChangeRequestForm) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "¡Solicitud enviada con éxito!",
      description: "Tu solicitud de cambios será revisada por un administrador. Te notificaremos cuando sea procesada.",
    });

    setIsSubmitting(false);
    navigate(`/event/${id}`);
  };

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Evento no encontrado</h1>
        <Button onClick={() => navigate("/")}>Volver a eventos</Button>
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

  const getCurrentValueForChangeType = (changeType: string) => {
    switch (changeType) {
      case "title":
        return event.title;
      case "description":
        return event.description;
      case "date":
        return format(parseISO(event.date), "yyyy-MM-dd");
      case "time":
        return event.time;
      case "location":
        return event.location;
      case "cost":
        return event.cost.toString();
      case "capacity":
        return event.capacity?.toString() || "";
      case "audience":
        return getAudienceLabel();
      case "registrationUrl":
        return event.registrationUrl || "";
      default:
        return "";
    }
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(`/event/${id}`)}
              className="mb-4 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al evento
            </Button>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Solicitar Cambios al Evento</h1>
            <p className="text-muted-foreground">
              Solicita modificaciones a la información del evento "{event.title}"
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Event Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información Actual del Evento</CardTitle>
                  <CardDescription>
                    Revisa los datos actuales antes de solicitar cambios
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <Badge variant="outline">{event.category}</Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(parseISO(event.date), "d 'de' MMMM, yyyy", { locale: es })} - {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{getAudienceLabel()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>{event.cost === 0 ? "Gratuito" : `$${event.cost.toLocaleString()}`}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{event.organizer}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Descripción</Label>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                      {event.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Change Request Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Solicitud de Cambios</CardTitle>
                  <CardDescription>
                    Completa el formulario para solicitar modificaciones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Requester Info */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Información del Solicitante</h4>
                      
                      <div className="space-y-2">
                        <Label htmlFor="requesterName">Nombre Completo *</Label>
                        <Input
                          id="requesterName"
                          placeholder="Tu nombre completo"
                          {...register("requesterName")}
                          className={`placeholder:text-red-500 ${errors.requesterName ? "border-destructive" : ""}`}
                        />
                        {errors.requesterName && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.requesterName.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="requesterEmail">Email *</Label>
                          <Input
                            id="requesterEmail"
                            type="email"
                            placeholder="tu@email.com"
                            {...register("requesterEmail")}
                            className={`placeholder:text-red-500 ${errors.requesterEmail ? "border-destructive" : ""}`}
                          />
                          {errors.requesterEmail && (
                            <p className="text-sm text-destructive flex items-center gap-1">
                              <AlertCircle className="h-4 w-4" />
                              {errors.requesterEmail.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="requesterPhone">Teléfono (opcional)</Label>
                          <Input
                            id="requesterPhone"
                            placeholder="+56 9 1234 5678"
                            {...register("requesterPhone")}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Change Details */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Detalles del Cambio</h4>
                      
                      <div className="space-y-2">
                        <Label htmlFor="changeType">Tipo de Cambio *</Label>
                        <select
                          id="changeType"
                          {...register("changeType")}
                          className={`w-full px-3 py-2 border rounded-md ${errors.changeType ? "border-destructive" : "border-input"}`}
                        >
                          <option value="">Selecciona el tipo de cambio</option>
                          <option value="title">Título del evento</option>
                          <option value="description">Descripción</option>
                          <option value="date">Fecha</option>
                          <option value="time">Horario</option>
                          <option value="location">Ubicación</option>
                          <option value="cost">Costo</option>
                          <option value="capacity">Capacidad</option>
                          <option value="audience">Tipo de público</option>
                          <option value="registrationUrl">URL de inscripción</option>
                          <option value="other">Otro</option>
                        </select>
                        {errors.changeType && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.changeType.message}
                          </p>
                        )}
                      </div>

                      {watchedChangeType && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="currentValue">Valor Actual *</Label>
                            <Input
                              id="currentValue"
                              value={getCurrentValueForChangeType(watchedChangeType)}
                              readOnly
                              className="bg-muted"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="requestedValue">Valor Solicitado *</Label>
                            {watchedChangeType === "description" ? (
                              <Textarea
                                id="requestedValue"
                                placeholder="Nueva descripción..."
                                rows={4}
                                {...register("requestedValue")}
                                className={`placeholder:text-red-500 ${errors.requestedValue ? "border-destructive" : ""}`}
                              />
                            ) : watchedChangeType === "date" ? (
                              <Input
                                id="requestedValue"
                                type="date"
                                {...register("requestedValue")}
                                className={errors.requestedValue ? "border-destructive" : ""}
                              />
                            ) : (
                              <Input
                                id="requestedValue"
                                placeholder="Nuevo valor..."
                                {...register("requestedValue")}
                                className={`placeholder:text-red-500 ${errors.requestedValue ? "border-destructive" : ""}`}
                              />
                            )}
                            {errors.requestedValue && (
                              <p className="text-sm text-destructive flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {errors.requestedValue.message}
                              </p>
                            )}
                          </div>
                        </>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="reason">Razón del Cambio *</Label>
                        <Textarea
                          id="reason"
                          placeholder="Explica por qué necesitas este cambio..."
                          rows={3}
                          {...register("reason")}
                          className={`placeholder:text-red-500 ${errors.reason ? "border-destructive" : ""}`}
                        />
                        {errors.reason && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.reason.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="additionalInfo">Información Adicional</Label>
                        <Textarea
                          id="additionalInfo"
                          placeholder="Cualquier información adicional que pueda ser útil..."
                          rows={2}
                          {...register("additionalInfo")}
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate(`/event/${id}`)}
                        disabled={isSubmitting}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 gap-2"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "Enviando..."
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Enviar Solicitud
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium mb-1">Proceso de Revisión</p>
                      <p className="text-xs text-muted-foreground">
                        Tu solicitud será revisada por un administrador. Te notificaremos por correo electrónico 
                        cuando sea procesada. Los cambios se aplicarán solo después de la aprobación.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RequestEventChanges;
