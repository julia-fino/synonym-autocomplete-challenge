import { TrashIcon } from "lucide-react";
import { Equation } from "@/lib/types/equation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EquationEnvironment } from "@/lib/types/identifiers";
import { isDuplicateIdentifier } from "@/lib/utils";
import Autocomplete from "./autocomplete";

interface EquationRowProps {
  environment: EquationEnvironment;
  equation: Equation;
  onEquationChanged: (lhs: string, rhs: string) => void;
  onRemoveEquation: () => void;
}

const EquationRow = (props: EquationRowProps) => {
  const { equation, onEquationChanged, onRemoveEquation, environment } = props;

  // The currently active input (for determining where to show the autocomplete)
  const [activeInput, setActiveInput] = useState<'lhs' | 'rhs'>('lhs');

  const [lhs, setLhs] = useState<string>(props.equation.lhs);
  const [rhs, setRhs] = useState<string>(props.equation.rhs);

  const handleChange = useCallback(() => {
    if (lhs !== equation.lhs || rhs !== equation.rhs) {
      onEquationChanged(lhs, rhs)
    }
  }, [lhs, rhs, equation, onEquationChanged]);

  // Trigger the onEquationChanged callback when lhs or rhs changes
  useEffect(() => {
    handleChange();
  }, [lhs, rhs, handleChange]);

  const isDuplicate = useMemo(() => isDuplicateIdentifier(environment, lhs, equation.id), [environment, lhs, equation.id]);

  const [showAutocomplete, setShowAutocomplete] = useState<boolean>(false);
  const [coords, setCoords] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const lhsRef = useRef<HTMLInputElement>(null);
  const rhsRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  // Get cursor position for autocomplete
  useEffect(() => {
    const inputRef = activeInput === 'lhs' ? lhsRef : rhsRef;
    if (!inputRef.current || !textRef.current) return;

    const textWidth = textRef.current.getBoundingClientRect().width;
    const rect = inputRef.current.getBoundingClientRect();

    // Position is the right edge of the input + the width of the text
    setCoords({ x: rect.x + textWidth, y: rect.y + rect.height });
  }, [rhs, lhs, activeInput]);

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex flex-row items-center gap-4 w-full">
        <Input
          ref={lhsRef}
          onBlur={() => {
            setShowAutocomplete(false);
          }}
          onFocus={() => {
            setActiveInput('lhs');
          }}
          className={`max-w-[300px] min-w-12 font-mono focus:outline-none ${isDuplicate ? 'text-red-600' : ''}`}
          value={lhs}
          onChange={(e) => {
            setShowAutocomplete(e.target.value.length > 0);
            setLhs(e.target.value)
          }}
        />
        {/* Invisible text for cursor position calc */}
        {activeInput && 'lhs' && <span ref={textRef} className="absolute invisible px-2">{rhs}</span>}
        <span className="text-lg text-gray-500">=</span>
        <div className="w-full">
          <Input
            onFocus={() => {
              setActiveInput('rhs');
            }}
            ref={rhsRef}
            onBlur={() => {
              setShowAutocomplete(false);
            }}
            className="min-w-12 font-mono focus:outline-none"
            value={rhs}
            onChange={(e) => {
              setShowAutocomplete(e.target.value.length > 0);
              setRhs(e.target.value)
            }} />
          {/* Invisible text for cursor position calc */}
          {activeInput && 'rhs' && <span ref={textRef} className="absolute invisible px-2">{rhs}</span>}
        </div>
        <Button variant="secondary" size="sm" className="ml-auto" onClick={onRemoveEquation}>
          <TrashIcon className="w-4 h-4" />
        </Button>
        {showAutocomplete &&
          <Autocomplete
            x={coords.x}
            y={coords.y}
            // Only filter on the current input on the left input
            equationId={activeInput === 'lhs' ? equation.id : undefined}
            environment={environment}
            input={activeInput === 'lhs' ? lhs : rhs}
            onOptionSelected={(option) => {
              if (activeInput === 'lhs') {
                setLhs(option);
              } else {
                setRhs(option);
              }
              setShowAutocomplete(false);
            }}
            numSuggestions={10} />}
      </div>
      {isDuplicate && <span className="text-red-600 text-sm">Duplicate identifier</span>}
    </div>
  )
}

export default EquationRow;