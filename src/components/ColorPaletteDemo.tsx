import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ColorPaletteDemo = () => {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Nueva Paleta de Colores</h2>
        <p className="text-muted-foreground">
          La aplicación ahora utiliza una paleta de colores personalizada basada en tonos naturales.
        </p>
      </div>

      {/* Colores principales */}
      <Card>
        <CardHeader>
          <CardTitle>Colores Principales</CardTitle>
          <CardDescription>
            Los colores principales utilizados en la interfaz
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Dark Green */}
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-dark-green flex items-center justify-center">
                <span className="text-white font-mono text-sm">#053225</span>
              </div>
              <div className="text-center">
                <p className="font-medium">Dark Green</p>
                <p className="text-sm text-muted-foreground">Color primario</p>
              </div>
            </div>

            {/* Cerise */}
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-cerise flex items-center justify-center">
                <span className="text-white font-mono text-sm">#E34A6F</span>
              </div>
              <div className="text-center">
                <p className="font-medium">Cerise</p>
                <p className="text-sm text-muted-foreground">Color de acento</p>
              </div>
            </div>

            {/* Cherry Blossom */}
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-cherry-blossom flex items-center justify-center">
                <span className="text-gray-800 font-mono text-sm">#F7B2BD</span>
              </div>
              <div className="text-center">
                <p className="font-medium">Cherry Blossom</p>
                <p className="text-sm text-muted-foreground">Color suave</p>
              </div>
            </div>

            {/* Khaki */}
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-khaki flex items-center justify-center">
                <span className="text-gray-800 font-mono text-sm">#B2A198</span>
              </div>
              <div className="text-center">
                <p className="font-medium">Khaki</p>
                <p className="text-sm text-muted-foreground">Color de advertencia</p>
              </div>
            </div>

            {/* Asparagus */}
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-asparagus flex items-center justify-center">
                <span className="text-white font-mono text-sm">#60A561</span>
              </div>
              <div className="text-center">
                <p className="font-medium">Asparagus</p>
                <p className="text-sm text-muted-foreground">Color de éxito</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ejemplos de uso */}
      <Card>
        <CardHeader>
          <CardTitle>Ejemplos de Uso</CardTitle>
          <CardDescription>
            Cómo se ven los colores en diferentes componentes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Botones */}
          <div className="space-y-3">
            <h4 className="font-medium">Botones</h4>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-dark-green hover:bg-dark-green/90">
                Botón Primario
              </Button>
              <Button variant="outline" className="border-cerise text-cerise hover:bg-cerise hover:text-white">
                Botón Secundario
              </Button>
              <Button variant="secondary" className="bg-cherry-blossom hover:bg-cherry-blossom/90 text-gray-800">
                Botón Suave
              </Button>
            </div>
          </div>

          {/* Badges */}
          <div className="space-y-3">
            <h4 className="font-medium">Badges</h4>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-dark-green">Evento Aprobado</Badge>
              <Badge variant="secondary" className="bg-cerise text-white">Evento Pendiente</Badge>
              <Badge variant="outline" className="border-asparagus text-asparagus">Evento Gratuito</Badge>
              <Badge variant="outline" className="border-khaki text-khaki">Evento con Costo</Badge>
            </div>
          </div>

          {/* Cards con colores */}
          <div className="space-y-3">
            <h4 className="font-medium">Cards con Colores</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-l-4 border-l-dark-green">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Evento Tecnológico</CardTitle>
                  <CardDescription>
                    Conferencia sobre inteligencia artificial
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge className="bg-dark-green">Tecnología</Badge>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-cerise">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Evento Cultural</CardTitle>
                  <CardDescription>
                    Concierto de música clásica
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge className="bg-cerise text-white">Cultura</Badge>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Gradientes */}
          <div className="space-y-3">
            <h4 className="font-medium">Gradientes</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-20 rounded-lg bg-gradient-to-r from-dark-green to-asparagus flex items-center justify-center">
                <span className="text-white font-medium">Gradiente Verde</span>
              </div>
              <div className="h-20 rounded-lg bg-gradient-to-r from-cerise to-cherry-blossom flex items-center justify-center">
                <span className="text-white font-medium">Gradiente Rosa</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorPaletteDemo;
