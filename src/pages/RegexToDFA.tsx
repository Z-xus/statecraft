"use client";

import { useToast } from "../hooks/use-toast";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SendHorizontal, Check, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import Symbols from "../utility/Symbols";
import TransitionsTable from "../utility/Transitions";
import { StatesTablemDFA, StatesTableuDFA } from "../utility/States";

import { useState, useRef, useEffect } from "react";

//import html2canvas from "html2canvas";

import Cytoscape from "cytoscape";
import CytoscapeComponent from "react-cytoscapejs";
import dagre from "cytoscape-dagre";
import {
  mDFA,
  uDFA,
  NFA,
  cytoscape_styles,
  cytoscape_layout,
} from "@davnpsh/automata";
import { runSimulation } from "../utility/utility";

Cytoscape.use(dagre);

export default function Home() {
  const cyRef = useRef<Cytoscape.Core | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [regex, setRegex] = useState("");
  const [selectValue, setSelectValue] = useState("nfa");
  const [automata, setAutomata] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [testString, setTestString] = useState("");
  const [stringAccepted, setStringAccepted] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Handle
  useEffect(() => {
    if (stringAccepted === null && cyRef.current) {
      cyRef.current.elements().removeStyle();
    }
  }, [stringAccepted]);

  // Handle automaton generaton on Select change
  useEffect(() => {
    if (!regex) return;
    handleRegex();
  }, [selectValue]);

  const handleRegex = () => {
    setStringAccepted(null);
    setIsLoading(true);
    // API call
    setTimeout(() => {
      try {
        switch (selectValue) {
          case "nfa":
            setAutomata(new NFA(regex));
            break;
          case "udfa":
            setAutomata(new uDFA(regex));
            break;
          case "mdfa":
            setAutomata(new mDFA(regex));
            break;
        }
      } catch (e) {
        setAutomata(null);
        toast({
          variant: "destructive",
          title: "Error on user input:",
          description: e.message,
        });
      } finally {
        setIsLoading(false);
      }
    }, 1000); // Just to show loading animation
  };

  const handleTest = () => {
    if (!automata) return;
    setStringAccepted(null);

    let result;
    try {
      result = automata.test(testString);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error on user input:",
        description: e.message,
      });
      return;
    }

    // Start animation process
    setAnimating(true);
    // Timeout to fix weird bug
    setTimeout(() => {
      runSimulation(cyRef.current, result).then(() => {
        setAnimating(false);
        setStringAccepted(result.accept);
      });
    }, 100);
  };


  return (
    <div className="h-[calc(100vh-4rem)] w-screen bg-white text-black">
      <div className="flex flex-col h-full">
        {/* Main content */}
        <div className="flex flex-1 p-4 gap-4">
          {/* Left panel */}
          <div className="w-1/3 flex flex-col gap-4 overflow-hidden">
            {automata ? (
              <>
                <Symbols automata={automata} className="text-black border border-gray-300 shadow-md p-2 rounded-md flex-1" />
                <TransitionsTable automata={automata} className="text-black border border-gray-300 shadow-md p-2 rounded-md flex-1" />
                <StatesTableuDFA automata={automata} className="text-black border border-gray-300 shadow-md p-2 rounded-md flex-1" />
                <StatesTablemDFA automata={automata} className="text-black border border-gray-300 shadow-md p-2 rounded-md flex-1" />
              </>
            ) : (
              // Skeleton Loader
              <div className="flex flex-col gap-4 animate-pulse">
                {/* Symbols box */}
                <div className="border border-gray-300 shadow-md rounded-md p-4">
                  <div className="h-6 w-24 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>

                {/* Transitions table */}
                <div className="border border-gray-300 shadow-md rounded-md p-4">
                  <div className="h-6 w-28 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="h-4 w-10 bg-gray-200 rounded"></div>
                        <div className="h-4 w-10 bg-gray-200 rounded"></div>
                        <div className="h-4 w-10 bg-gray-200 rounded"></div>
                        <div className="h-4 w-10 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="w-2/3 flex flex-col">
            <div className="flex items-center gap-x-5 mb-2">
              <div className="flex gap-x-4 max-w-md w-full">
                <Input
                  placeholder="Enter regular expression..."
                  className="flex-1 text-black border-black"
                  value={regex}
                  onChange={(e) => setRegex(e.target.value)}
                  disabled={isLoading || animating}
                />
                <Button
                  className="text-white"
                  onClick={handleRegex}
                  disabled={isLoading || animating || !regex.trim()}
                >
                  <SendHorizontal className="h-6 w-6" />
                </Button>
              </div>
              <Select value={selectValue} onValueChange={setSelectValue}>
                <SelectTrigger className="text-black border border-gray-300 shadow-md p-2 rounded-md flex-1">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent className="text-black border border-gray-300 shadow-md rounded-md">
                  <SelectItem value="nfa">Nondeterministic Finite Automaton (NFA)</SelectItem>
                  <SelectItem value="udfa">Unoptimized DFA (uDFA)</SelectItem>
                  <SelectItem value="mdfa">Minimized DFA (mDFA)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Graph */}
            <div className="flex-1 bg-white rounded-lg shadow-lg border border-gray-300 p-4 relative">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                </div>
              ) : automata ? (
                <>
                  <CytoscapeComponent
                    id="automaton"
                    elements={automata.cytograph()}
                    style={{ width: "100%", height: "90%" }}
                    stylesheet={cytoscape_styles}
                    layout={cytoscape_layout}
                    cy={(cy: Cytoscape.Core) => (cyRef.current = cy)}
                    boxSelectionEnabled={false}
                    minZoom={1}
                    maxZoom={4}
                    wheelSensitivity={0.1}
                  />
                  <p className="absolute bottom-2 left-2 text-xs text-gray-500 select-none">
                    Drag nodes to resolve overlapping edges
                  </p>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 select-none">
                  Enter a regular expression above
                </div>
              )}
            </div>

            {/* Testing area */}
            <div className="flex gap-2 mt-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Enter a string to test..."
                  value={testString}
                  onChange={(e) => {
                    setTestString(e.target.value);
                    setStringAccepted(null);
                  }}
                  disabled={isLoading || animating}
                  className={`text-black border shadow-md rounded-md p-2 ${stringAccepted === true
                      ? "border-green-500 border-4"
                      : stringAccepted === false
                        ? "border-red-500 border-4"
                        : "border-gray-300"
                    }`}
                />
                {stringAccepted === true ? (
                  <Check className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-green-500" />
                ) : stringAccepted === false ? (
                  <X className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-red-500" />
                ) : null}
              </div>
              <Button
                onClick={handleTest}
                disabled={isLoading || animating || !testString.trim()}
                className="text-white bg-primary shadow-lg border border-primary hover:bg-primary-dark rounded-md"
              >
                Test String
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}
