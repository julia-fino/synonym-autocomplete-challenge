import { useEffect } from "react";
import { EquationEnvironment } from "@/lib/types/identifiers";

interface AutocompleteProps {
  x: number;
  y: number;
  environment: EquationEnvironment;
  input: string;
  numSuggestions?: number;
  onOptionSelected: (option: string) => void;
}

const Autocomplete = (props: AutocompleteProps) => {
  const { x, y, environment, input, onOptionSelected, numSuggestions } = props;

  // Filter identifiers based on the input
  const filteredIdentifiers = [
    ...environment.variables,
    ...environment.functions,
    ...environment.constants
  ].filter(identifier => identifier.code.toLowerCase().startsWith(input.toLowerCase())).slice(0, numSuggestions || 10); // Limit to 10 suggestions by default

  // Listen for tab key to select the first suggestion
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && filteredIdentifiers.length > 0) {
        event.preventDefault();
        onOptionSelected(filteredIdentifiers[0].code);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [filteredIdentifiers, onOptionSelected]);

  return (
    <div style={{ left: x, top: y }} className="fixed z-100 bg-white border border-gray-300 rounded shadow-lg mt-2">
      {filteredIdentifiers.map((identifier) => (
        <div
          key={identifier.code}
          className="p-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            onOptionSelected(identifier.code)
          }}
          onMouseDown={e => e.preventDefault()} // Prevent input blur on click
        >
          {identifier.code}
        </div>
      ))}
    </div>
  )
}

export default Autocomplete;