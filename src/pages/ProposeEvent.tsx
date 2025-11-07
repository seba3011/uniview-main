import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, MapPin, Users, DollarSign, Send, Mail, Phone, Image, Tag, AlertCircle } from "lucide-react";
import { EventCategory, EventAudience } from "@/types/event";

// Schema de validación
const eventProposalSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres").max(100, "El título no puede exceder 100 caracteres"),
  shortDescription: z.string().min(10, "La descripción corta debe tener al menos 10 caracteres").max(200, "La descripción corta no puede exceder 200 caracteres"),
  description: z.string().min(50, "La descripción debe tener al menos 50 caracteres").max(2000, "La descripción no puede exceder 2000 caracteres"),
  category: z.string().min(1, "Debes seleccionar una categoría"),
  organizer: z.string().min(2, "El nombre del organizador debe tener al menos 2 caracteres"),
  organizerEmail: z.string().email("Debes proporcionar un email válido"),
  organizerPhone: z.string().optional(),
  date: z.string().min(1, "Debes seleccionar una fecha"),
  time: z.string().min(1, "Debes proporcionar el horario"),
  location: z.string().min(5, "La ubicación debe tener al menos 5 caracteres"),
  audience: z.string().min(1, "Debes seleccionar el tipo de público"),
  audienceDetails: z.string().optional(),
  cost: z.number().min(0, "El costo no puede ser negativo"),
  capacity: z.number().min(1, "La capacidad debe ser al menos 1").optional(),
  registrationUrl: z.string().url("Debes proporcionar una URL válida").optional().or(z.literal("")),
  requirements: z.string().optional(),
  contactInfo: z.string().optional(),
  tags: z.string().optional(),
  hasReadTerms: z.boolean().refine(val => val === true, "Debes aceptar los términos y condiciones"),
});

type EventProposalForm = z.infer<typeof eventProposalSchema>;

const ProposeEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EventProposalForm>({
    resolver: zodResolver(eventProposalSchema),
    defaultValues: {
      cost: 0,
      hasReadTerms: false,
    },
  });

  const onSubmit = async (data: EventProposalForm) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "¡Evento propuesto con éxito!",
      description: "Tu propuesta de evento será revisada por un administrador. Te notificaremos cuando sea aprobada.",
    });

    setIsSubmitting(false);
    navigate("/");
  };

  const watchedAudience = watch("audience");

  return (
    <div>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Proponer Nuevo Evento</h1>
            <p className="text-muted-foreground">
              Completa el formulario para proponer un evento. Será revisado por un administrador antes de publicarse.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Información Básica */}
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
                <CardDescription>
                  Datos principales del evento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Título del Evento *</Label>
                  <Input
                    id="title"
                    placeholder="Ej: Charla de Inteligencia Artificial"
                    {...register("title")}
                    className={`placeholder:text-red-500 ${errors.title ? "border-destructive" : ""}`}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Short Description */}
                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Descripción Corta *</Label>
                  <Input
                    id="shortDescription"
                    placeholder="Breve descripción que aparecerá en la tarjeta del evento"
                    {...register("shortDescription")}
                    className={`placeholder:text-red-500 ${errors.shortDescription ? "border-destructive" : ""}`}
                  />
                  {errors.shortDescription && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.shortDescription.message}
                    </p>
                  )}
                </div>

                {/* Full Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción Completa *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe en detalle el evento, su objetivo, contenido, y cualquier información relevante..."
                    rows={6}
                    {...register("description")}
                    className={`placeholder:text-red-500 ${errors.description ? "border-destructive" : ""}`}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select onValueChange={(value) => setValue("category", value)}>
                    <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tecnologia">Tecnología</SelectItem>
                      <SelectItem value="cultura">Cultura</SelectItem>
                      <SelectItem value="academico">Académico</SelectItem>
                      <SelectItem value="deportes">Deportes</SelectItem>
                      <SelectItem value="emprendimiento">Emprendimiento</SelectItem>
                      <SelectItem value="talleres">Talleres</SelectItem>
                      <SelectItem value="conferencias">Conferencias</SelectItem>
                      <SelectItem value="seminarios">Seminarios</SelectItem>
                      <SelectItem value="exposiciones">Exposiciones</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.category.message}
                    </p>
                  )}
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags" className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Etiquetas
                  </Label>
                  <Input
                    id="tags"
                    placeholder="Ej: IA, programación, innovación (separadas por comas)"
                    {...register("tags")}
                  />
                  <p className="text-xs text-muted-foreground">
                    Etiquetas que ayuden a categorizar y encontrar tu evento
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Información del Organizador */}
            <Card>
              <CardHeader>
                <CardTitle>Información del Organizador</CardTitle>
                <CardDescription>
                  Datos de contacto del organizador
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Organizer */}
                <div className="space-y-2">
                  <Label htmlFor="organizer">Organizador *</Label>
                  <Input
                    id="organizer"
                    placeholder="Ej: Centro de Alumnos de Ingeniería"
                    {...register("organizer")}
                    className={`placeholder:text-red-500 ${errors.organizer ? "border-destructive" : ""}`}
                  />
                  {errors.organizer && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.organizer.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="organizerEmail" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email de Contacto *
                    </Label>
                    <Input
                      id="organizerEmail"
                      type="email"
                      placeholder="organizador@usm.cl"
                      {...register("organizerEmail")}
                      className={`placeholder:text-red-500 ${errors.organizerEmail ? "border-destructive" : ""}`}
                    />
                    {errors.organizerEmail && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.organizerEmail.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="organizerPhone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Teléfono (opcional)
                    </Label>
                    <Input
                      id="organizerPhone"
                      placeholder="+56 9 1234 5678"
                      {...register("organizerPhone")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detalles del Evento */}
            <Card>
              <CardHeader>
                <CardTitle>Detalles del Evento</CardTitle>
                <CardDescription>
                  Fecha, hora, ubicación y otros detalles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Fecha *
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      {...register("date")}
                      className={errors.date ? "border-destructive" : ""}
                    />
                    {errors.date && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.date.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Horario *
                    </Label>
                    <Input
                      id="time"
                      placeholder="Ej: 10:00 - 12:00"
                      {...register("time")}
                      className={`placeholder:text-red-500 ${errors.time ? "border-destructive" : ""}`}
                    />
                    {errors.time && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.time.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Ubicación *
                  </Label>
                  <Input
                    id="location"
                    placeholder="Ej: Auditorio Central, Campus San Joaquín"
                    {...register("location")}
                    className={`placeholder:text-red-500 ${errors.location ? "border-destructive" : ""}`}
                  />
                  {errors.location && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.location.message}
                    </p>
                  )}
                </div>

                {/* Audience */}
                <div className="space-y-2">
                  <Label htmlFor="audience" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Tipo de Público *
                  </Label>
                  <Select onValueChange={(value) => setValue("audience", value)}>
                    <SelectTrigger className={errors.audience ? "border-destructive" : ""}>
                      <SelectValue placeholder="Selecciona el tipo de público" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Abierto al Público</SelectItem>
                      <SelectItem value="university-only">Solo Universidad</SelectItem>
                      <SelectItem value="students-only">Solo Estudiantes</SelectItem>
                      <SelectItem value="faculty-only">Solo Profesores</SelectItem>
                      <SelectItem value="staff-only">Solo Funcionarios</SelectItem>
                      <SelectItem value="specific-department">Departamento Específico</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.audience && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.audience.message}
                    </p>
                  )}
                </div>

                {/* Audience Details */}
                {watchedAudience === "specific-department" && (
                  <div className="space-y-2">
                    <Label htmlFor="audienceDetails">Detalles del Público</Label>
                    <Input
                      id="audienceDetails"
                      placeholder="Ej: Estudiantes de Ingeniería Informática"
                      {...register("audienceDetails")}
                    />
                  </div>
                )}

                {/* Cost and Capacity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cost" className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Costo (CLP)
                    </Label>
                    <Input
                      id="cost"
                      type="number"
                      placeholder="0 para gratuito"
                      {...register("cost", { valueAsNumber: true })}
                      className={errors.cost ? "border-destructive" : ""}
                    />
                    {errors.cost && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.cost.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacidad</Label>
                    <Input
                      id="capacity"
                      type="number"
                      placeholder="Número máximo de asistentes"
                      {...register("capacity", { valueAsNumber: true })}
                      className={errors.capacity ? "border-destructive" : ""}
                    />
                    {errors.capacity && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.capacity.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Registration URL */}
                <div className="space-y-2">
                  <Label htmlFor="registrationUrl">URL de Inscripción</Label>
                  <Input
                    id="registrationUrl"
                    type="url"
                    placeholder="https://..."
                    {...register("registrationUrl")}
                    className={errors.registrationUrl ? "border-destructive" : ""}
                  />
                  {errors.registrationUrl && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.registrationUrl.message}
                    </p>
                  )}
                </div>

                {/* Requirements */}
                <div className="space-y-2">
                  <Label htmlFor="requirements">Requisitos</Label>
                  <Textarea
                    id="requirements"
                    placeholder="Ej: Traer laptop, conocimientos básicos en programación..."
                    rows={3}
                    {...register("requirements")}
                  />
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  <Label htmlFor="contactInfo">Información de Contacto Adicional</Label>
                  <Textarea
                    id="contactInfo"
                    placeholder="Información adicional de contacto o instrucciones especiales..."
                    rows={3}
                    {...register("contactInfo")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="hasReadTerms"
                    {...register("hasReadTerms")}
                    className={errors.hasReadTerms ? "border-destructive" : ""}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="hasReadTerms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Acepto los términos y condiciones *
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Confirmo que la información proporcionada es veraz y que entiendo que mi propuesta será revisada por un administrador antes de ser publicada.
                    </p>
                    {errors.hasReadTerms && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.hasReadTerms.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/")}
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
                    Enviar Propuesta
                  </>
                )}
              </Button>
            </div>
          </form>

          <Card className="mt-6 bg-muted/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                <strong>Nota:</strong> Tu propuesta será revisada por un administrador antes de ser publicada en el portal. 
                Esto asegura que toda la información sea precisa y apropiada. Te notificaremos por correo electrónico 
                cuando tu evento sea aprobado o si se requieren ajustes.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ProposeEvent;