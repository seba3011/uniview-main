import { useState } from "react";
import { EventAudience, EventCategory } from "@/types/event";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Filter, X, Search } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface EventFiltersProps {
  selectedAudience: EventAudience | "all";
  selectedCategory: EventCategory | "all";
  selectedCost: "all" | "free" | "paid";
  selectedDate: "all" | "this-week" | "this-month" | "next-month";
  searchQuery: string;
  onAudienceChange: (audience: EventAudience | "all") => void;
  onCategoryChange: (category: EventCategory | "all") => void;
  onCostChange: (cost: "all" | "free" | "paid") => void;
  onDateChange: (date: "all" | "this-week" | "this-month" | "next-month") => void;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
}

const EventFilters = ({
  selectedAudience,
  selectedCategory,
  selectedCost,
  selectedDate,
  searchQuery,
  onAudienceChange,
  onCategoryChange,
  onCostChange,
  onDateChange,
  onSearchChange,
  onClearFilters,
}: EventFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const audienceFilters = [
    { value: "all", label: "Todos los Eventos" },
    { value: "open", label: "Abiertos al Público" },
    { value: "university-only", label: "Solo Universidad" },
    { value: "students-only", label: "Solo Estudiantes" },
    { value: "faculty-only", label: "Solo Profesores" },
    { value: "staff-only", label: "Solo Funcionarios" },
    { value: "specific-department", label: "Departamento Específico" },
  ];

  const categoryFilters = [
    { value: "all", label: "Todas las Categorías" },
    { value: "tecnologia", label: "Tecnología" },
    { value: "cultura", label: "Cultura" },
    { value: "academico", label: "Académico" },
    { value: "deportes", label: "Deportes" },
    { value: "emprendimiento", label: "Emprendimiento" },
    { value: "talleres", label: "Talleres" },
    { value: "conferencias", label: "Conferencias" },
    { value: "seminarios", label: "Seminarios" },
    { value: "exposiciones", label: "Exposiciones" },
    { value: "otro", label: "Otro" },
  ];

  const costFilters = [
    { value: "all", label: "Todos los Costos" },
    { value: "free", label: "Gratuitos" },
    { value: "paid", label: "Con Costo" },
  ];

  const dateFilters = [
    { value: "all", label: "Todas las Fechas" },
    { value: "this-week", label: "Esta Semana" },
    { value: "this-month", label: "Este Mes" },
    { value: "next-month", label: "Próximo Mes" },
  ];

  const hasActiveFilters = selectedAudience !== "all" || 
    selectedCategory !== "all" || 
    selectedCost !== "all" || 
    selectedDate !== "all" || 
    searchQuery !== "";

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Búsqueda
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="space-y-2">
          <Label htmlFor="search">Buscar eventos</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Buscar por título, descripción, organizador..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Quick Filters */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {audienceFilters.slice(0, 4).map((filter) => (
          <Button
            key={filter.value}
                variant={selectedAudience === filter.value ? "default" : "outline"}
                size="sm"
                onClick={() => onAudienceChange(filter.value as EventAudience | "all")}
                className="text-xs"
              >
            {filter.label}
          </Button>
            ))}
          </div>
        </div>

        {/* Advanced Filters */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              Filtros Avanzados
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Audience Filter */}
              <div className="space-y-2">
                <Label>Tipo de Público</Label>
                <Select value={selectedAudience} onValueChange={onAudienceChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {audienceFilters.map((filter) => (
                      <SelectItem key={filter.value} value={filter.value}>
                        {filter.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select value={selectedCategory} onValueChange={onCategoryChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryFilters.map((filter) => (
                      <SelectItem key={filter.value} value={filter.value}>
                        {filter.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cost Filter */}
              <div className="space-y-2">
                <Label>Costo</Label>
                <Select value={selectedCost} onValueChange={onCostChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {costFilters.map((filter) => (
                      <SelectItem key={filter.value} value={filter.value}>
                        {filter.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Filter */}
              <div className="space-y-2">
                <Label>Fecha</Label>
                <Select value={selectedDate} onValueChange={onDateChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dateFilters.map((filter) => (
                      <SelectItem key={filter.value} value={filter.value}>
                        {filter.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Filtros activos:</span>
            {selectedAudience !== "all" && (
              <Badge variant="secondary">
                {audienceFilters.find(f => f.value === selectedAudience)?.label}
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="secondary">
                {categoryFilters.find(f => f.value === selectedCategory)?.label}
              </Badge>
            )}
            {selectedCost !== "all" && (
              <Badge variant="secondary">
                {costFilters.find(f => f.value === selectedCost)?.label}
              </Badge>
            )}
            {selectedDate !== "all" && (
              <Badge variant="secondary">
                {dateFilters.find(f => f.value === selectedDate)?.label}
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary">
                Búsqueda: "{searchQuery}"
              </Badge>
            )}
    </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventFilters;