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
  const [currentNodeId, setCurrentNodeId] = useState(null);
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
    let currentState = nodes.find(node => node.data.isStartState)?.id;

    for (const char of inputString) {
      setCurrentNodeId(currentState);
      const edge = edges.find(e => e.source === currentState && e.label === char);

      if (edge) {
        currentState = edge.target;
      } else {
        setCurrentNodeId(null);
        return false;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const finalState = nodes.find(node => node.id === currentState);
    setCurrentNodeId(finalState?.data.isAcceptState ? currentState : null);
    return finalState?.data.isAcceptState == undefined ? false : finalState.data.isAcceptState;
  };

  const handleValidateInput = async () => {
    const isValid: boolean = await validateString(input);
    setValidationResult(isValid ? "Accepted" : "Rejected");
  }

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-full w-full flex flex-col bg-black text-white relative overflow-hidden">
      {/* Desktop/Tablet Floating Sidebar - Hidden on mobile */}
      <div
        className={`hidden md:block fixed left-0 top-[3rem] bg-gray-900 transition-all duration-300 ease-in-out shadow-xl ${
          isOpen ? 'w-64 lg:w-80' : 'w-8'
        }`}
        style={{
          height: 'calc(100vh - 3rem)',
          zIndex: 30,
          pointerEvents: isOpen ? 'auto' : 'none'
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div 
          className={`h-full overflow-y-auto p-4 ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
        >
          <h2 className="text-base font-semibold mb-2 text-white">Add State</h2>
          <NodeCreatorButton onAddNode={addNode} />

          <h2 className="text-base font-semibold mt-4 mb-2 text-white">Add Edge</h2>

          <div className="space-y-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Start State</label>
              <select
                value={startState}
                onChange={(e) => setStartState(e.target.value)}
                className="w-full p-2 text-sm border border-gray-600 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Select start</option>
                {nodes.map(node => (
                  <option key={node.id} value={node.id}>
                    {node.data.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">End State</label>
              <select
                value={endState}
                onChange={(e) => setEndState(e.target.value)}
                className="w-full p-2 text-sm border border-gray-600 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Select end</option>
                {nodes.map(node => (
                  <option key={node.id} value={node.id}>
                    {node.data.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Symbol</label>
              <input
                type="text"
                value={transitionSymbol}
                onChange={(e) => setTransitionSymbol(e.target.value)}
                placeholder="Enter symbol"
                className="w-full p-2 text-sm border border-gray-600 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              onClick={handleAddEdge}
              className="w-full p-2 text-sm bg-blue-600 rounded text-white hover:bg-blue-500 transition-colors"
            >
              Add Edge
            </button>
            <button
              onClick={handleDeleteElements}
              className="w-full p-2 text-sm bg-red-600 rounded text-white hover:bg-red-500 transition-colors"
            >
              Delete
            </button>
          </div>

          <h2 className="text-base font-semibold mt-4 mb-2 text-white">Validate</h2>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter string"
            className="w-full p-2 text-sm border border-gray-600 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleValidateInput}
            className="mt-2 w-full p-2 text-sm bg-green-600 rounded text-white hover:bg-green-500 transition-colors"
          >
            Validate
          </button>

          {validationResult !== null && (
            <div className={`mt-3 text-center text-base font-semibold ${validationResult === "Accepted" ? "text-green-400" : "text-red-400"}`}>
              {validationResult}
            </div>
          )}
        </div>
      </div>

      {/* Main Canvas Container - Flexbox fills available space */}
      <div className="flex-1 w-full relative" style={{ zIndex: 10 }}>
        {/* Mobile: Account for bottom bar, Desktop: Full height */}
        <div className="w-full h-full pb-[280px] md:pb-0">
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
            <MiniMap className="!bottom-[290px] md:!bottom-4 !right-4" />
            <Controls className="!bottom-[290px] md:!bottom-4 !left-4" />
          </ReactFlow>
        </div>
      </div>

      {/* Mobile Bottom Control Bar - Fixed 280px height */}
      <div 
        className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t-2 border-gray-700 overflow-y-auto"
        style={{ 
          height: '280px',
          zIndex: 40
        }}
      >
        <div className="p-3 space-y-2">
          {/* Add State */}
          <div>
            <h3 className="text-xs font-semibold mb-1 text-gray-300">Add State</h3>
            <NodeCreatorButton onAddNode={addNode} />
          </div>

          {/* Add Edge */}
          <div>
            <h3 className="text-xs font-semibold mb-1 text-gray-300">Add Edge</h3>
            <div className="grid grid-cols-2 gap-1.5">
              <select
                value={startState}
                onChange={(e) => setStartState(e.target.value)}
                className="text-xs p-1.5 border border-gray-600 rounded bg-gray-800 text-white focus:outline-none"
              >
                <option value="" disabled>Start</option>
                {nodes.map(node => (
                  <option key={node.id} value={node.id}>{node.data.label}</option>
                ))}
              </select>

              <select
                value={endState}
                onChange={(e) => setEndState(e.target.value)}
                className="text-xs p-1.5 border border-gray-600 rounded bg-gray-800 text-white focus:outline-none"
              >
                <option value="" disabled>End</option>
                {nodes.map(node => (
                  <option key={node.id} value={node.id}>{node.data.label}</option>
                ))}
              </select>
            </div>

            <input
              type="text"
              value={transitionSymbol}
              onChange={(e) => setTransitionSymbol(e.target.value)}
              placeholder="Symbol"
              className="mt-1.5 w-full text-xs p-1.5 border border-gray-600 rounded bg-gray-800 text-white focus:outline-none"
            />

            <div className="grid grid-cols-2 gap-1.5 mt-1.5">
              <button
                onClick={handleAddEdge}
                className="text-xs p-1.5 bg-blue-600 rounded text-white hover:bg-blue-500"
              >
                Add Edge
              </button>
              <button
                onClick={handleDeleteElements}
                className="text-xs p-1.5 bg-red-600 rounded text-white hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Validate */}
          <div>
            <h3 className="text-xs font-semibold mb-1 text-gray-300">Validate</h3>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="String"
                className="flex-1 text-xs p-1.5 border border-gray-600 rounded bg-gray-800 text-white focus:outline-none"
              />
              <button
                onClick={handleValidateInput}
                className="text-xs px-3 bg-green-600 rounded text-white hover:bg-green-500"
              >
                Test
              </button>
            </div>
            {validationResult && (
              <div className={`mt-1 text-center text-xs font-semibold ${validationResult === "Accepted" ? "text-green-400" : "text-red-400"}`}>
                {validationResult}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}