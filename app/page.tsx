"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useCallback, useEffect, useState } from "react";
import { Equation } from "@/lib/types/equation";
import Header from "@/components/web/header";
import SidebarPanel from "@/components/web/sidebar-panel";
import EditorPanel from "@/components/web/editor-panel";
import { generateUUID } from "@/lib/utils";
import { EquationEnvironment, Identifier } from "@/lib/types/identifiers";

// Feel free to change these! They're just for testing, and meant to mimic
// the IDE environment in which a user would be writing equations.
const initialIdentifiers = {
  variables: [
    "x",
    "y",
    "Foo",
    "Bar",
    "Baz",
    "UpperCamelCaseVariable",
    "lowerCamelCaseVariable",
    "snake_case_variable",
    "Inlet.mixture.T",
    "Inlet.mixture.P",
    "Inlet.mixture.rho_mass",
    "Inlet.mixture.h_mass",
    "Inlet.rate.m",
    "Inlet.rate.v",
    "Outlet.mixture.T",
    "Outlet.mixture.P",
    "Outlet.mixture.rho_mass",
    "Outlet.mixture.h_mass",
    "Outlet.rate.m",
    "Outlet.rate.v",
  ],
  functions: [
    "SQRT",
    "LOG",
    "EXP",
    "SIN",
    "COS",
    "TAN",
    "ROUND",
    "CEIL",
    "FLOOR",
    "ABS",
    "SIGN",
    "POW",
    "MOD",
  ],
  constants: [
    "pi",
    "e",
    "c",
    "MagicConstant",
    "T_STP",
    "P_STP",
  ],
}

const initialEnvironment: EquationEnvironment = {
  variables: initialIdentifiers.variables.map(v => ({ code: v, type: "variable" })),
  functions: initialIdentifiers.functions.map(f => ({ code: f, type: "function" })),
  constants: initialIdentifiers.constants.map(c => ({ code: c, type: "constant" })),
}

// Defines the width of each panel in %
const editorPanelWidth = 70;
const sidebarPanelWidth = 100 - editorPanelWidth;

export default function Home() {
  const [equations, setEquations] = useState<Equation[]>([]);
  const [environment, setEnvironment] = useState<EquationEnvironment>(initialEnvironment);

  const addEquation = useCallback(() => {
    setEquations(prev => [...prev, { id: generateUUID(), lhs: "", rhs: "" }]);
  }, []);

  const removeEquation = useCallback((id: string) => {
    setEquations(prev => {
      const oldIndex = prev.findIndex(e => e.id === id);

      if (oldIndex === -1) return prev;

      const newEquations = [...prev];
      newEquations.splice(oldIndex, 1);
      return newEquations;
    });
  }, []);

  const onEquationChanged = useCallback((id: string, lhs: string, rhs: string) => {
    setEquations(prev => {
      const existingIndex = prev.findIndex(e => e.id === id);

      if (existingIndex === -1) return prev;

      const existing = prev[existingIndex];
      if (existing && existing.lhs !== lhs || existing.rhs !== rhs) {
        const newEquations = [...prev];
        newEquations.splice(existingIndex, 1, { ...existing, lhs, rhs });
        return newEquations;
      }

      return prev
    });
  }, []);

  const clearEquations = useCallback(() => {
    setEquations([]);
  }, []);

  // Update environment when equations change (equation identifiers are variables)
  useEffect(() => {
    setEnvironment({
      ...initialEnvironment,
      variables: [
        ...initialEnvironment.variables,
        // Trim the input, and remove empty identifiers
        ...equations.map(e => ({ code: e.lhs.trim(), type: "variable", equationId: e.id } as Identifier)).filter(i => i.code.trim() !== ""),
      ]
    })
  }, [equations]);

  // Ensure that at least one equation row is always present
  useEffect(() => {
    if ((Object.keys(equations)).length === 0) {
      addEquation();
    }
  }, [equations, addEquation]);

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col h-screen">
        <Header />
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={editorPanelWidth}>
            <EditorPanel
              clearEquations={clearEquations}
              onEquationChanged={onEquationChanged}
              equations={equations}
              addEquation={addEquation}
              removeEquation={removeEquation}
              environment={environment} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={sidebarPanelWidth}>
            <SidebarPanel environment={environment} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}
