import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import TopBar from "./TopBar";
import NodeLibrary from "./NodeLibrary";
import Workspace from "./Workspace";
import SearchModal from "./SearchModal";
import AgentModal from "./AgentModal";

export default function Warehouse() {
  const [agents, setAgents] = useState([
    {
      id: 1,
      name: "On Trigger",
      type: "on-trigger",
      status: "idle",
      progress: 0,
      task: "",
      memory: "Medium",
      rules: [],
      lastActivity: "2 min ago",
      performance: 85,
      is_active: true,
      created_at: "2024-01-15T10:00:00Z",
      position: { x: 100, y: 100 }
    },
    {
      id: 2,
      name: "Generate Text",
      type: "generate-text",
      status: "running",
      progress: 45,
      task: "Creating blog post",
      memory: "High",
      rules: [],
      lastActivity: "now",
      performance: 92,
      is_active: true,
      created_at: "2024-01-15T10:05:00Z",
      position: { x: 400, y: 100 }
    },
    {
      id: 3,
      name: "Send for Approval",
      type: "send-for-approval",
      status: "success",
      progress: 100,
      task: "Content approved",
      memory: "Low",
      rules: [],
      lastActivity: "1 min ago",
      performance: 78,
      is_active: true,
      created_at: "2024-01-15T10:10:00Z",
      position: { x: 700, y: 100 }
    }
  ]);
  
  const [tasks, setTasks] = useState({
    1: [
      { id: 1, name: "Trigger workflow", status: "success", last_run: "2024-01-15T10:00:00Z" }
    ],
    2: [
      { id: 2, name: "Generate blog content", status: "running", last_run: "2024-01-15T10:05:00Z" },
      { id: 3, name: "Format text", status: "queued", last_run: null }
    ],
    3: [
      { id: 4, name: "Send to reviewer", status: "success", last_run: "2024-01-15T10:08:00Z" },
      { id: 5, name: "Wait for approval", status: "success", last_run: "2024-01-15T10:09:00Z" }
    ]
  });
  
  const [connections, setConnections] = useState([
    { id: 1, source: 1, target: 2 },
    { id: 2, source: 2, target: 3 }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.8);
  const [isPanning, setIsPanning] = useState(false);
  const [searchModal, setSearchModal] = useState({ isOpen: false, position: { x: 0, y: 0 } });
  const [selectedAgent, setSelectedAgent] = useState(null);
  const workspaceRef = useRef(null);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setTasks(currentTasks => {
        const newTasks = JSON.parse(JSON.stringify(currentTasks));
        const agentIds = Object.keys(newTasks);
        
        if (agentIds.length === 0) return currentTasks;
        
        const randomAgentId = agentIds[Math.floor(Math.random() * agentIds.length)];
        const agentTasks = newTasks[randomAgentId];
        
        if (!agentTasks || agentTasks.length === 0) return currentTasks;
        
        const randomTaskIndex = Math.floor(Math.random() * agentTasks.length);
        const statuses = ["idle", "running", "success", "error", "queued"];
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        newTasks[randomAgentId][randomTaskIndex].status = newStatus;
        newTasks[randomAgentId][randomTaskIndex].last_run = new Date().toISOString();
        
        return newTasks;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleToggleAgentStatus = async (agentToToggle) => {
    setAgents(prevAgents => 
      prevAgents.map(agent => 
        agent.id === agentToToggle.id 
          ? { ...agent, is_active: !agent.is_active }
          : agent
      )
    );
  };

  const handleGenerateReport = async () => {
    console.log("Generating report...");
    alert("Report generated and saved!");
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const nodeType = event.dataTransfer.getData('application/node-type');
    const nodeName = event.dataTransfer.getData('application/node-name');

    if (nodeType) {
      // Create unique ID
      const newId = Date.now();
      // Position based on drop location
      const rect = workspaceRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left - pan.x) / zoom;
      const y = (event.clientY - rect.top - pan.y) / zoom;

      // Create new agent
      const newAgent = {
        id: newId,
        name: nodeName,
        type: nodeType,
        status: 'idle',
        progress: 0,
        task: '',
        memory: 'Medium',
        rules: [],
        lastActivity: 'now',
        performance: 80,
        is_active: true,
        created_at: new Date().toISOString(),
        position: { x, y }
      };

      setAgents(prev => [...prev, newAgent]);
      setTasks(prev => ({
        ...prev,
        [newId]: []
      }));
    }
  };

  const handleNodeMove = (nodeId, newPosition) => {
    setAgents(prev => 
      prev.map(agent => 
        agent.id === nodeId 
          ? { ...agent, position: newPosition }
          : agent
      )
    );
  };

  const handleNodeConnect = (sourceId, targetId) => {
    const newConnection = {
      id: Date.now(),
      source: sourceId,
      target: targetId
    };
    setConnections(prev => [...prev, newConnection]);
    console.log(`Connected node ${sourceId} to ${targetId}`);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    const rect = workspaceRef.current.getBoundingClientRect();
    setSearchModal({
      isOpen: true,
      position: { x: e.clientX - rect.left, y: e.clientY - rect.top }
    });
  };

  const handleNodeSelect = (node, position) => {
    console.log(`Selected node "${node.name}" at position:`, position);
    alert(`Added "${node.name}" to workspace!`);
  };

  const handleMouseDown = (e) => {
    // Don't start panning if right-clicking (for context menu)
    if (e.button === 2 || e.target !== e.currentTarget) return;
    setIsPanning(true);
    workspaceRef.current.style.cursor = 'grabbing';
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    workspaceRef.current.style.cursor = 'grab';
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    e.preventDefault();
    setPan(prev => ({
      x: prev.x + e.movementX,
      y: prev.y + e.movementY
    }));
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const newZoom = zoom - e.deltaY * 0.001;
    setZoom(Math.min(Math.max(newZoom, 0.2), 2));
  };

  const fitToScreen = () => {
    setZoom(0.7);
    setPan({ x: 100, y: 50 });
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white">
      <TopBar 
        agents={agents} 
        onGenerateReport={handleGenerateReport} 
        onFitToScreen={fitToScreen} 
      />
      <div className="flex-grow flex overflow-hidden">
        <NodeLibrary />
        <div
          ref={workspaceRef}
          className="flex-grow overflow-hidden relative cursor-grab bg-[radial-gradient(#2e3c51_1px,transparent_1px)] [background-size:32px_32px]"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          onWheel={handleWheel}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onContextMenu={handleContextMenu}
        >
          <Workspace 
            agents={agents} 
            tasks={tasks} 
            pan={pan} 
            zoom={zoom} 
            onToggleStatus={handleToggleAgentStatus}
            onAgentClick={setSelectedAgent}
            onNodeMove={handleNodeMove}
            onNodeConnect={handleNodeConnect}
          />
          
          {/* Render Connections */}
          <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 500 }}>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
              </marker>
            </defs>
            {connections.map(connection => {
              const sourceAgent = agents.find(a => a.id === connection.source);
              const targetAgent = agents.find(a => a.id === connection.target);
              
              if (!sourceAgent || !targetAgent) return null;
              
              const startX = sourceAgent.position.x + 200;
              const startY = sourceAgent.position.y + 50;
              const endX = targetAgent.position.x;
              const endY = targetAgent.position.y + 50;
              
              return (
                <line
                  key={connection.id}
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
          </svg>
        </div>
      </div>
      <SearchModal
        isOpen={searchModal.isOpen}
        onClose={() => setSearchModal({ isOpen: false, position: { x: 0, y: 0 } })}
        position={searchModal.position}
        onNodeSelect={handleNodeSelect}
      />
      {selectedAgent && (
        <AgentModal
          agent={selectedAgent}
          tasks={tasks[selectedAgent.id] || []}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
} 