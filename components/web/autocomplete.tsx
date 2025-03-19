import { useCallback, useEffect, useMemo } from "react";
import { EquationEnvironment } from "@/lib/types/identifiers";

interface AutocompleteProps {
  x: number;
  y: number;
  equationId?: string;
  environment: EquationEnvironment;
  input: string;
  numSuggestions?: number;
  onOptionSelected: (option: string) => void;
}

/**
 * Component to display an autocomplete dropdown based on the user's input and equation environment
 */
const Autocomplete = (props: AutocompleteProps) => {
  const { x, y, environment, input, equationId, onOptionSelected, numSuggestions } = props;

  // Filter identifiers based on the current input
  const filteredIdentifiers = useMemo(() => {
    const startsWith = input.split(' ').at(-1)?.trim()

    if (!startsWith) return []

    return Array.from(new Set([
      ...environment.variables,
      ...environment.functions,
      ...environment.constants
    ].filter(identifier => identifier.code
      .toLowerCase()
      // Don't include the current identifier that we're typing
      .startsWith(startsWith.toLowerCase()) && (equationId ? identifier.equationId !== equationId : true))
      .map(identifier => {
        const code = identifier.code.trim();

        // Handle dot notation (only show the next part of the identifier)
        if (code.includes('.')) {
          const parts = code.split('.');
          const startsWithParts = startsWith.split('.');

          let partsIndex = 0;
          for (let i = 0; i < startsWithParts.length; i++) {
            // Whether to move to the next part of the identifier
            if (parts[i] && parts[i] === startsWithParts[i]) {
              partsIndex++;
            }
          }

          if (partsIndex >= startsWithParts.length) {
            partsIndex--; // Adjust for empty part after the last dot
          }

          return parts.at(partsIndex) ? parts.at(partsIndex)! : (parts.at(-1) ?? '');
        }
        return code;
      })
      .slice(0, numSuggestions || 10))); // Limit to 10 suggestions by default
  }, [environment.constants, environment.functions, environment.variables, equationId, input, numSuggestions])

  const handleOptionSelected = useCallback((option: string) => {
    const parts = input.split(' ');

    // This is what we're replacing
    const toReplace = parts.pop() || '';

    let start = parts.join(' ');

    if (start.length > 0 && !start.endsWith('.')) {
      start += ' ';
    }

    // Account for dots (keep what we have so far before the last dot)
    const dotAdjustment = toReplace.includes('.') ? toReplace.split('.').slice(0, -1).join('.') + '.' : '';

    onOptionSelected(`${start}${dotAdjustment}${option}`);
  }, [input, onOptionSelected]);

  // Listen for tab key to select the first suggestion
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && filteredIdentifiers.length > 0) {
        event.preventDefault();
        handleOptionSelected(filteredIdentifiers[0]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [filteredIdentifiers, handleOptionSelected]);

  return (
    <div style={{ left: x, top: y }} className="fixed z-100 bg-white border border-gray-300 rounded shadow-lg mt-2">
      {filteredIdentifiers.map((identifier) => (
        <div
          key={identifier}
          className="p-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            handleOptionSelected(identifier)
          }}
          onMouseDown={e => e.preventDefault()} // Prevent dropdown hiding on click
        >
          {identifier}
        </div>
      ))}
    </div>
  )
}

export default Autocomplete;