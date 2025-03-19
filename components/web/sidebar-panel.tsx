import { EquationEnvironment, Identifier } from "@/lib/types/identifiers";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { useMemo } from "react";

interface SidebarPanelProps {
  environment: EquationEnvironment;
}

// Sort alphabetically and remove duplicates w/Set
const getDisplayString = (identifiers: Identifier[]) => {
  return Array.from(new Set(identifiers.map(i => i.code))).sort((a, b) => a.toLowerCase().charCodeAt(0) - b.toLowerCase().charCodeAt(0)).join("\n");
}

const SidebarPanel = (props: SidebarPanelProps) => {
  const { environment } = props;

  const functions = useMemo(() => getDisplayString(environment.functions), [environment.functions]);
  const variables = useMemo(() => getDisplayString(environment.variables), [environment.variables]);
  const constants = useMemo(() => getDisplayString(environment.constants), [environment.constants]);

  return (
    <div className="h-full w-full p-4 flex flex-col gap-4">
      <h1 className="text-lg font-medium">Identifiers</h1>
      <ScrollArea className="h-full w-full">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-wider">Functions</p>
          <pre className="text-xs text-purple-500">
            {functions}
          </pre>
          <Separator className="my-2" />
          <p className="text-xs font-medium uppercase tracking-wider">Variables</p>
          <pre className="text-xs text-indigo-500">
            {variables}
          </pre>
          <Separator className="my-2" />
          <p className="text-xs font-medium uppercase tracking-wider">Constants</p>
          <pre className="text-xs text-orange-500">
            {constants}
          </pre>
        </div>
      </ScrollArea>
    </div>
  )
}

export default SidebarPanel;