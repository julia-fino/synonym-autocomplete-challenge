import { PlusIcon, CircleXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Equation } from "@/lib/types/equation";
import { EquationEnvironment } from "@/lib/types/identifiers";
import EquationRow from "./equation-row";
import { ScrollArea } from "../ui/scroll-area";

interface EditorPanelProps {
  equations: Equation[];
  clearEquations: () => void;
  addEquation: () => void;
  removeEquation: (id: string) => void;
  onEquationChanged: (id: string, lhs: string, rhs: string) => void;
  environment: EquationEnvironment;
}

const EditorPanel = (props: EditorPanelProps) => {
  const { equations, addEquation, environment, removeEquation, onEquationChanged, clearEquations } = props;

  return (
    <div className="h-full w-full p-4 flex flex-col gap-4">
      <div className="flex flex-row items-center gap-4 justify-between">
        <h1 className="text-lg font-medium">Equations</h1>
        <div className="flex flex-row gap-2">
          <Button variant="secondary" size="sm" className="ml-auto" onClick={clearEquations}>
            <CircleXIcon className="w-4 h-4" />
            Clear All
          </Button>
          <Button variant="secondary" size="sm" className="ml-auto" onClick={addEquation}>
            <PlusIcon className="w-4 h-4" />
            Add Equation
          </Button>
        </div>
      </div>
      <ScrollArea>
        <div className="flex flex-col gap-4">
          {equations.map((equation, index) => (
            <EquationRow
              key={index}
              equation={equation}
              environment={environment}
              onRemoveEquation={(() => removeEquation(equation.id))}
              onEquationChanged={(lhs, rhs) => onEquationChanged(equation.id, lhs, rhs)} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export default EditorPanel;

