import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import EventCard from "@/components/EventCard";
import EventFilters from "@/components/EventFilters";
import { EventAudience, EventCategory } from "@/types/event";
import { mockEvents } from "@/data/mockEvents";
import { format, parseISO, isThisWeek, isThisMonth, addMonths, isSameMonth } from "date-fns";

const Index = () => {
  const [selectedAudience, setSelectedAudience] = useState<EventAudience | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | "all">("all");
  const [selectedCost, setSelectedCost] = useState<"all" | "free" | "paid">("all");
  const [selectedDate, setSelectedDate] = useState<"all" | "this-week" | "this-month" | "next-month">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = useMemo(() => {
    return mockEvents.filter(event => {
      // Filter by audience
      if (selectedAudience !== "all" && event.audience !== selectedAudience) {
        return false;
      }

      // Filter by category
      if (selectedCategory !== "all" && event.category !== selectedCategory) {
        return false;
      }

      // Filter by cost
      if (selectedCost === "free" && event.cost > 0) {
        return false;
      }
      if (selectedCost === "paid" && event.cost === 0) {
        return false;
      }

      // Filter by date
      const eventDate = parseISO(event.date);
      if (selectedDate === "this-week" && !isThisWeek(eventDate)) {
        return false;
      }
      if (selectedDate === "this-month" && !isThisMonth(eventDate)) {
        return false;
      }
      if (selectedDate === "next-month" && !isSameMonth(eventDate, addMonths(new Date(), 1))) {
        return false;
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchableText = [
          event.title,
          event.description,
          event.shortDescription,
          event.organizer,
          event.location,
          ...(event.tags || [])
        ].join(" ").toLowerCase();
        
        if (!searchableText.includes(query)) {
          return false;
        }
      }

      // Only show approved events
      return event.approvalStatus === "approved";
    });
  }, [selectedAudience, selectedCategory, selectedCost, selectedDate, searchQuery]);

  const hasActiveFilters = selectedAudience !== "all" || 
    selectedCategory !== "all" || 
    selectedCost !== "all" || 
    selectedDate !== "all" || 
    searchQuery !== "";

  const clearFilters = () => {
    setSelectedAudience("all");
    setSelectedCategory("all");
    setSelectedCost("all");
    setSelectedDate("all");
    setSearchQuery("");
  };

  return (
    <div>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
              Portal de Eventos USM
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Descubre y participa en todas las actividades culturales, académicas y recreativas de la universidad
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b bg-card/30">
        <div className="container mx-auto px-4">
          <EventFilters 
            selectedAudience={selectedAudience}
            selectedCategory={selectedCategory}
            selectedCost={selectedCost}
            selectedDate={selectedDate}
            searchQuery={searchQuery}
            onAudienceChange={setSelectedAudience}
            onCategoryChange={setSelectedCategory}
            onCostChange={setSelectedCost}
            onDateChange={setSelectedDate}
            onSearchChange={setSearchQuery}
            onClearFilters={clearFilters}
          />
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">
              Eventos Disponibles
            </h2>
            <p className="text-muted-foreground">
              {filteredEvents.length} {filteredEvents.length === 1 ? "evento encontrado" : "eventos encontrados"}
              {hasActiveFilters && " con los filtros aplicados"}
            </p>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                No hay eventos disponibles con el filtro seleccionado
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
