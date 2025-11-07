import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { X, User, Mail, Phone, Calendar, MapPin, Users, DollarSign, CheckCircle, AlertCircle } from "lucide-react";
import { Event } from "@/types/event";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

// Schema de validación para la inscripción
const registrationSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellidos: z.string().min(2, "Los apellidos deben tener al menos 2 caracteres"),
  edad: z.number().min(16, "Debes ser mayor de 16 años").max(100, "Edad no válida"),
  email: z.string().email("Debes proporcionar un email válido"),
  telefono: z.string().min(9, "El teléfono debe tener al menos 9 dígitos"),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

interface EventRegistrationModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

const EventRegistrationModal = ({ event, isOpen, onClose }: EventRegistrationModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: RegistrationForm) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSuccess(true);

    toast({
      title: "¡Inscripción exitosa!",
      description: `Te has inscrito correctamente al evento "${event.title}". Recibirás un email de confirmación.`,
    });

    // Reset form and close modal after 3 seconds
    setTimeout(() => {
      reset();
      setIsSuccess(false);
      onClose();
    }, 3000);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setIsSuccess(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Inscripción al Evento</h2>
                  <p className="text-muted-foreground">
                    Completa el formulario para inscribirte a este evento
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Event Info */}
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription>{event.shortDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(parseISO(event.date), "d 'de' MMMM, yyyy", { locale: es })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>{event.cost === 0 ? "Gratuito" : `$${event.cost.toLocaleString()}`}</span>
                    </div>
                  </div>
                  {event.capacity && (
                    <div className="flex items-center gap-2 mt-3 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Capacidad: {event.capacity} personas</span>
                      {event.currentAttendees && (
                        <span className="text-muted-foreground">
                          ({event.currentAttendees} inscritos)
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Success State */}
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">¡Inscripción Exitosa!</h3>
                  <p className="text-muted-foreground mb-4">
                    Te has inscrito correctamente al evento. Recibirás un email de confirmación en breve.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Esta ventana se cerrará automáticamente...
                  </p>
                </motion.div>
              ) : (
                /* Registration Form */
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nombre */}
                    <div className="space-y-2">
                      <Label htmlFor="nombre" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Nombre *
                      </Label>
                      <Input
                        id="nombre"
                        placeholder="Tu nombre"
                        {...register("nombre")}
                        className={`placeholder:text-red-500 ${errors.nombre ? "border-destructive" : ""}`}
                        disabled={isSubmitting}
                      />
                      {errors.nombre && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.nombre.message}
                        </p>
                      )}
                    </div>

                    {/* Apellidos */}
                    <div className="space-y-2">
                      <Label htmlFor="apellidos" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Apellidos *
                      </Label>
                      <Input
                        id="apellidos"
                        placeholder="Tus apellidos"
                        {...register("apellidos")}
                        className={`placeholder:text-red-500 ${errors.apellidos ? "border-destructive" : ""}`}
                        disabled={isSubmitting}
                      />
                      {errors.apellidos && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.apellidos.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Edad */}
                    <div className="space-y-2">
                      <Label htmlFor="edad" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Edad *
                      </Label>
                      <Input
                        id="edad"
                        type="number"
                        placeholder="Tu edad"
                        {...register("edad", { valueAsNumber: true })}
                        className={`placeholder:text-red-500 ${errors.edad ? "border-destructive" : ""}`}
                        disabled={isSubmitting}
                        min={16}
                        max={100}
                      />
                      {errors.edad && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.edad.message}
                        </p>
                      )}
                    </div>

                    {/* Teléfono */}
                    <div className="space-y-2">
                      <Label htmlFor="telefono" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Teléfono *
                      </Label>
                      <Input
                        id="telefono"
                        type="tel"
                        placeholder="+56 9 1234 5678"
                        {...register("telefono")}
                        className={`placeholder:text-red-500 ${errors.telefono ? "border-destructive" : ""}`}
                        disabled={isSubmitting}
                      />
                      {errors.telefono && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.telefono.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Correo Electrónico *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      {...register("email")}
                      className={`placeholder:text-red-500 ${errors.email ? "border-destructive" : ""}`}
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={handleClose}
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Inscribiendo..." : "Confirmar Inscripción"}
                    </Button>
                  </div>
                </form>
              )}

              {/* Additional Info */}
              <Card className="mt-6 bg-muted/50">
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Nota:</strong> Al inscribirte, aceptas recibir información relacionada con este evento. 
                    Tu información será utilizada únicamente para fines de organización y comunicación del evento.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EventRegistrationModal;
