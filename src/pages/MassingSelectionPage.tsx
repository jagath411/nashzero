import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TbCube3dSphere, TbSparkles, TbArrowRight } from "react-icons/tb";

export default function MassingSelectionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Nash Massing</h1>
        <p className="text-muted-foreground">Compare, evaluate and select optimal building forms</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nash Explore */}
        <Card className="p-8 space-y-6 hover:border-primary/50 transition-colors group cursor-pointer">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <TbSparkles className="text-primary" size={32} />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-foreground">NASH Explore</h2>
            <p className="text-sm text-muted-foreground">
              Auto Generated Massing — Let the system generate and evaluate optimal building forms based on site constraints.
            </p>
          </div>
          <Button className="w-full gap-2 group-hover:bg-primary" onClick={() => navigate(`/project/${id}/studio`)}>
            Start Exploring <TbArrowRight size={16} />
          </Button>
        </Card>

        {/* Nash Studio */}
        <Card className="p-8 space-y-6 hover:border-accent/50 transition-colors group cursor-pointer">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto">
            <TbCube3dSphere className="text-accent" size={32} />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-foreground">Nash Studio</h2>
            <p className="text-sm text-muted-foreground">
              User-Created Massing — Draw, extrude and manipulate building forms using interactive 3D tools.
            </p>
          </div>
          <Button variant="outline" className="w-full gap-2 group-hover:border-accent" onClick={() => navigate(`/project/${id}/studio`)}>
            Start Modeling <TbArrowRight size={16} />
          </Button>
        </Card>
      </div>
    </div>
  );
}
