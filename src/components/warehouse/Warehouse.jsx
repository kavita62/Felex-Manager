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
      name: 'Content Creator Agent',
      type: 'content',
      status: 'active',
      progress: 75,
      task: 'Generating Instagram post',
      memory: 'High',
      rules: ['Creative', 'Brand Consistent'],
      lastActivity: '2 minutes ago',
      performance: 92,
      is_active: true,
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      name: 'Video Editor Agent',
      type: 'video',
      status: 'idle',
      progress: 0,
      task: 'Waiting for input',
      memory: 'Medium',
      rules: ['Quality Focus', 'Fast Processing'],
      lastActivity: '5 minutes ago',
      performance: 88,
      is_active: false,
      created_at: '2024-01-14T15:30:00Z'
    },
    {
      id: 3,
      name: 'Analytics Agent',
      type: 'analytics',
      status: 'processing',
      progress: 45,
      task: 'Analyzing engagement data',
      memory: 'High',
      rules: ['Data Driven', 'Real-time'],
      lastActivity: '1 minute ago',
      performance: 95,
      is_active: true,
      created_at: '2024-01-13T09:15:00Z'
    },
    {
      id: 4,
      name: 'Social Media Agent',
      type: 'social',
      status: 'error',
      progress: 30,
      task: 'Connection timeout',
      memory: 'Low',
      rules: ['Platform Aware', 'Scheduling'],
      lastActivity: '10 minutes ago',
      performance: 65,
      is_active: false,
      created_at: '2024-01-12T14:20:00Z'
    }
  ]);

  const [tasks, setTasks] = useState({
    1: [
      { id: 1, name: 'Generate Post Content', status: 'running', progress: 60, description: 'Criando conteúdo para Instagram', last_run: '2024-01-15T10:30:00Z' },
      { id: 2, name: 'Optimize Hashtags', status: 'success', progress: 100, description: 'Hashtags otimizados', last_run: '2024-01-15T10:25:00Z' },
      { id: 3, name: 'Schedule Post', status: 'idle', progress: 0, description: 'Aguardando aprovação', last_run: null }
    ],
    2: [
      { id: 4, name: 'Process Video', status: 'idle', progress: 0, description: 'Aguardando arquivo', last_run: null },
      { id: 5, name: 'Apply Effects', status: 'idle', progress: 0, description: 'Efeitos pendentes', last_run: null }
    ],
    3: [
      { id: 6, name: 'Collect Data', status: 'running', progress: 80, description: 'Coletando métricas', last_run: '2024-01-15T10:28:00Z' },
      { id: 7, name: 'Analyze Trends', status: 'processing', progress: 45, description: 'Analisando tendências', last_run: '2024-01-15T10:29:00Z' },
      { id: 8, name: 'Generate Report', status: 'idle', progress: 0, description: 'Relatório pendente', last_run: null }
    ],
    4: [
      { id: 9, name: 'Connect to API', status: 'error', progress: 30, description: 'Timeout na conexão', last_run: '2024-01-15T10:20:00Z' },
      { id: 10, name: 'Sync Posts', status: 'error', progress: 0, description: 'Falha na sincronização', last_run: '2024-01-15T10:15:00Z' }
    ]
  });

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
        const statuses = ["idle", "running", "success", "error", "processing"];
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];

        newTasks[randomAgentId][randomTaskIndex].status = newStatus;
        newTasks[randomAgentId][randomTaskIndex].last_run = new Date().toISOString();
        
        // Update progress for running tasks
        if (newStatus === 'running' || newStatus === 'processing') {
          const currentProgress = newTasks[randomAgentId][randomTaskIndex].progress || 0;
          newTasks[randomAgentId][randomTaskIndex].progress = Math.min(currentProgress + Math.random() * 10, 100);
        }
        
        return newTasks;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleToggleAgentStatus = async (agentToToggle) => {
    try {
      setAgents(prevAgents => prevAgents.map(agent => 
        agent.id === agentToToggle.id ? { ...agent, is_active: !agent.is_active } : agent
      ));
    } catch (error) {
      console.error("Error toggling agent status:", error);
    }
  };
  
  const handleGenerateReport = async () => {
    console.log("Generating report...");
    alert("Relatório gerado e salvo!");
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
      console.log(`Dropped node "${nodeName}" of type "${nodeType}"`);
      alert(`Agente "${nodeName}" adicionado ao workspace!`);
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    const rect = workspaceRef.current.getBoundingClientRect();
    setSearchModal({
      isOpen: true,
      position: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    });
  };

  const handleNodeSelect = (node, position) => {
    console.log(`Selected node "${node.name}" at position:`, position);
    alert(`Agente "${node.name}" adicionado ao workspace!`);
  };

  const handleMouseDown = (e) => {
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
    setPan(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const newZoom = zoom - e.deltaY * 0.001;
    setZoom(Math.min(Math.max(newZoom, 0.2), 2));
  };

  const fitToScreen = () => {
    setZoom(0.8);
    setPan({x: 100, y: 50});
  };
  
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white">
      <TopBar agents={agents} onGenerateReport={handleGenerateReport} onFitToScreen={fitToScreen} />

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
          />
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