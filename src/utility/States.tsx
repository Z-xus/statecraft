import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface State {
  label: string;
  states: State[];
}

//interface IdentifiableState {
//  [label: string]: string[];
//}

interface Automaton {
  NFA?: boolean;
  uDFA?: boolean;
  states: {
    table: State[];
  };
  equivalent_states: {
    table: State[];
  };
  identifiables: {
    table: Map<string, string[]>;
  };
}

interface StatesTableProps {
  automata: Automaton;
  className?: string;
}

export function StatesTableuDFA({ automata }: StatesTableProps) {
  // If the automaton is NOT an NFA
  if (!automata.NFA) return <></>;

  // If the automaton is NOT a uDFA
  if (automata.uDFA) return <></>;

  return (
    <div className="flex-none">
      <h2 className="font-bold text-center text-xl">States</h2>
      <Table className="select-none">
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-center text-lg">State</TableHead>
            <TableHead className="font-bold text-center text-lg">NFA equivalent states</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(automata.states.table) && automata.states.table.length > 0 ? (
            automata.states.table.map((state, index) => (
              <TableRow key={index}>
                <TableCell className="text-md text-center">{state.label}</TableCell>
                <TableCell className="text-md text-center">
                  {"{"}
                  {state.states.map((innerState) => innerState.label).join(", ")}
                  {"}"}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="text-md text-center" colSpan={2}>
                No states available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export function StatesTablemDFA({ automata }: StatesTableProps) {
  // If the automaton is NOT a mDFA
  if (!automata.uDFA) return <></>;

  return (
    <div className="flex-none">
      <h2 className="font-bold text-center text-xl">States</h2>
      <Table className="select-none">
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-center text-lg">State</TableHead>
            <TableHead className="font-bold text-center text-lg">NFA significant states</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(automata.equivalent_states.table) && automata.equivalent_states.table.length > 0 ? (
            automata.equivalent_states.table.map((state, index) => (
              <TableRow key={index}>
                <TableCell className="text-md text-center">Significants({state.label})</TableCell>
                <TableCell className="text-md text-center">
                  {"{"}
                  {state.states.map((innerState) => innerState.label).join(", ")}
                  {"}"}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="text-md text-center" colSpan={2}>
                No equivalent states available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="h-2/4 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#a0aec0 transparent' }}>
        <ul className="list-disc pl-10 space-y-2 mt-5 ">
          {automata.identifiables.table && Array.from(automata.identifiables.table.entries()).map(
            ([label, identicals]) => (
              <li key={label} className="text-md">
                <span className="font-bold">{label}</span> is identical to{" "}
                {Array.isArray(identicals) ? (
                  identicals.map((identical, index, array) => (
                    <React.Fragment key={index}>
                      <span className="font-bold">{identical}</span>
                      {index < array.length - 2 && ", "}
                      {index === array.length - 2 && " and "}
                    </React.Fragment>
                  ))
                ) : (
                  <span className="font-bold">N/A</span> // or any other placeholder you'd like
                )}
                .
              </li>
            ),
          )}
        </ul>
      </div>
    </div>
  );
}
