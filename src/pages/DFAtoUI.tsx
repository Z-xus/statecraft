import React, { useCallback, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { initialNodes, nodeTypes } from "../graphs/nodes";
import { initialEdges, edgeTypes } from "../graphs/edges";
import NodeCreatorButton from "../graphs/nodes/NodeCreatorButton";



export default function DFAtoUI() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
  const [input, setInput] = useState("");
  const [validationResult, setValidationResult] = useState<string | null>(null);
  const [startState, setStartState] = useState("");
  const [endState, setEndState] = useState("");
  const [transitionSymbol, setTransitionSymbol] = useState("");
  const [currentNodeId, setCurrentNodeId] = useState(null); // New state for current node
  const colorMode = "light";

  const onConnect = useCallback(
    (params) => {
      const label = prompt("Enter transition symbol:");
      if (label) {
        setEdges((eds) => addEdge({ ...params, label, animated: true }, eds));
      } else {
        alert("Transition symbol cannot be empty.");
      }
    },
    [setEdges]
  );

  const addNode = useCallback(
    (nodeData) => {
      const gridSize = 100;
      const newNode = {
        id: `node-${nodes.length + 1}`,
        type: "dfa",
        position: {
          x: (nodes.length % 5) * gridSize,
          y: Math.floor(nodes.length / 5) * gridSize,
        },
        data: {
          label: nodeData.label,
          isAcceptState: nodeData.isAcceptState,
          isStartState: nodes.length === 0,
        },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes]
  );

  const handleAddEdge = () => {
    if (startState && endState && transitionSymbol) {
      setEdges((eds) =>
        addEdge(
          {
            id: `edge-${edges.length + 1}`,
            source: startState,
            target: endState,
            label: transitionSymbol,
            animated: false,
          },
          eds
        )
      );
      // Resetting the states after adding an edge
      setStartState("");
      setEndState("");
      setTransitionSymbol("");
    } else {
      alert("Please select both states and enter a transition symbol.");
    }
  };

  const handleDeleteElements = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => !edge.selected));
  }, [setNodes, setEdges]);


  const validateString = async (inputString: string): Promise<boolean> => {
    let currentState = nodes.find(node => node.data.isStartState)?.id; // Start at the start state

    for (const char of inputString) {
      // Highlight the current node
      setCurrentNodeId(currentState);

      // Find the next state based on current state and transition symbol
      const edge = edges.find(e => e.source === currentState && e.label === char);

      //console.log(`Current state: ${currentState}, Input symbol: ${char}, Next state: ${edge?.target}`);

      if (edge) {
        currentState = edge.target; // Move to the next state
      } else {
        setCurrentNodeId(null);
        // If there is no valid transition, reject the string
        return false;
      }
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1000 ms delay
    }

    // Check if the current state is an accepting state
    const finalState = nodes.find(node => node.id === currentState);
    setCurrentNodeId(finalState?.data.isAcceptState ? currentState : null); // Highlight if accepting state
    return finalState?.data.isAcceptState == undefined ? false : finalState.data.isAcceptState;
  };

  const handleValidateInput = async () => {
    const isValid: boolean = await validateString(input);
    setValidationResult(isValid ? "Accepted" : "Rejected");
  }

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-[calc(100vh-3rem)] w-screen flex bg-black text-white">
      {/* Floating Sidebar */}
      <div
        className={`fixed left-0 top-[4rem] h-screen bg-gray-900 transition-all duration-300 ease-in-out z-10 ${isOpen ? 'w-64 md:w-1/4' : 'w-2 hover:w-64 md:hover:w-1/4'
          }`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className={`p-5 ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 overflow-y-auto h-full`}>
          <h2 className="text-lg font-semibold mb-2">Add a State:</h2>
          <NodeCreatorButton onAddNode={addNode} />

          <h2 className="text-lg font-semibold mt-3">Add an Edge:</h2>

          <div className="flex items-center justify-between gap-4 mt-4">
            <h2 className="text-lg font-semibold text-justify">Select Start State:</h2>
            <select
              value={startState}
              onChange={(e) => setStartState(e.target.value)}
              className="w-fit p-2 border border-gray-600 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Start state</option>
              {nodes.map(node => (
                <option key={node.id} value={node.id}>
                  {node.data.label} {node.data.isAcceptState ? "(Accept)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between gap-4 mt-4">
            <h2 className="text-lg font-semibold">Select End State:</h2>
            <select
              value={endState}
              onChange={(e) => setEndState(e.target.value)}
              className="w-fit p-2 border border-gray-600 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>End state</option>
              {nodes.map(node => (
                <option key={node.id} value={node.id}>
                  {node.data.label} {node.data.isAcceptState ? "(Accept)" : ""}
                </option>
              ))}
            </select>
          </div>

          <h2 className="text-lg font-semibold mt-4 mb-1.5">Enter Transition Symbol:</h2>
          <input
            type="text"
            value={transitionSymbol}
            onChange={(e) => setTransitionSymbol(e.target.value)}
            placeholder="Enter transition symbol"
            className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={() => handleAddEdge()}
              className="w-full p-2 bg-gray-600 rounded border-solid-white cursor-pointer text-white hover:bg-gray-500 transition-colors"
            >
              Add Edge
            </button>

            <button
              onClick={handleDeleteElements}
              className="w-full p-2 bg-gray-600 rounded border-solid-white cursor-pointer text-white hover:bg-gray-500 transition-colors"
            >
              Delete Elements
            </button>
          </div>

          <h2 className="text-lg font-semibold mt-4 mb-1.5">Validate String:</h2>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter string to validate"
            className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={() => handleValidateInput()}
            className="mt-4 w-full p-2 bg-gray-600 rounded cursor-pointer text-white hover:bg-gray-500 transition-colors"
          >
            Validate
          </button>

          {validationResult !== null && (
            <div className={`mt-4 text-lg font-semibold ${validationResult === "Accepted" ? "text-green-500" : "text-red-500"}`}>
              {validationResult}
            </div>
          )}
        </div>
      </div>

      {/* ReactFlow */}
      <div className="flex-1 mx-5 relative">
        <ReactFlow
          nodes={nodes.map(node => ({
            ...node,
            data: {
              ...node.data,
              isCurrentNode: node.id === currentNodeId,
            },
          }))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          colorMode={colorMode}
          proOptions={{
            hideAttribution: true
          }}
          fitView
        >
          <Background bgColor="white" />
          <MiniMap />
          <Controls style={{ gap: "0.3rem", color: "black" }} />
        </ReactFlow>
      </div>
    </div>
  );
};
