import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CheckCircle, XCircle, AlertCircle, Clock, X } from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  eventId?: string;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "success",
      title: "Evento Aprobado",
      message: "Tu evento 'Conferencia Internacional de IA' ha sido aprobado y publicado.",
      timestamp: "2025-01-20T10:30:00Z",
      read: false,
      eventId: "7",
    },
    {
      id: "2",
      type: "warning",
      title: "Cambios Requeridos",
      message: "Tu evento 'Exposición de Arte' requiere algunos ajustes. Revisa los comentarios del administrador.",
      timestamp: "2025-01-19T15:45:00Z",
      read: false,
      eventId: "8",
    },
    {
      id: "3",
      type: "error",
      title: "Evento Rechazado",
      message: "Tu evento 'Workshop de Python' ha sido rechazado. Revisa la razón del rechazo.",
      timestamp: "2025-01-18T09:20:00Z",
      read: true,
      eventId: "9",
    },
    {
      id: "4",
      type: "info",
      title: "Nuevo Evento Disponible",
      message: "Se ha publicado un nuevo evento que podría interesarte: 'Feria de Innovación Tecnológica 2025'.",
      timestamp: "2025-01-17T14:15:00Z",
      read: true,
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationBadgeVariant = (type: string) => {
    switch (type) {
      case "success":
        return "default";
      case "error":
        return "destructive";
      case "warning":
        return "secondary";
      default:
        return "outline";
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative gap-2"
      >
        <Bell className="h-4 w-4" />
        Notificaciones
        {unreadCount > 0 && (
          <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
            {unreadCount}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Notification Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-96 max-h-96 overflow-hidden z-50"
            >
              <Card className="shadow-lg border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Notificaciones</CardTitle>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs"
                      >
                        Marcar todas como leídas
                      </Button>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="p-0">
                  <Tabs defaultValue="unread" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mx-4 mb-4">
                      <TabsTrigger value="unread" className="gap-2">
                        <Clock className="h-4 w-4" />
                        No leídas ({unreadCount})
                      </TabsTrigger>
                      <TabsTrigger value="read" className="gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Leídas ({readNotifications.length})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="unread" className="space-y-2 px-4 pb-4">
                      {unreadNotifications.length > 0 ? (
                        unreadNotifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="relative"
                          >
                            <Card className={`cursor-pointer hover:bg-muted/50 transition-colors ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  {getNotificationIcon(notification.type)}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <h4 className="font-medium text-sm line-clamp-1">
                                        {notification.title}
                                      </h4>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteNotification(notification.id);
                                        }}
                                        className="h-6 w-6 p-0 shrink-0"
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                      {format(parseISO(notification.timestamp), "d 'de' MMM, HH:mm", { locale: es })}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">No hay notificaciones nuevas</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="read" className="space-y-2 px-4 pb-4">
                      {readNotifications.length > 0 ? (
                        readNotifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="relative"
                          >
                            <Card className="cursor-pointer hover:bg-muted/50 transition-colors opacity-75">
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  {getNotificationIcon(notification.type)}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <h4 className="font-medium text-sm line-clamp-1">
                                        {notification.title}
                                      </h4>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteNotification(notification.id);
                                        }}
                                        className="h-6 w-6 p-0 shrink-0"
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                      {format(parseISO(notification.timestamp), "d 'de' MMM, HH:mm", { locale: es })}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <CheckCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">No hay notificaciones leídas</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
