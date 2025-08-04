import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Brain, 
  Zap, 
  Target, 
  Users, 
  Activity, 
  Play, 
  Pause, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  ArrowRight,
  Plus,
  X,
  Settings,
  Database,
  FileText,
  Image,
  Video,
  UserCheck,
  List,
  Search,
  Calendar,
  ExternalLink
} from "lucide-react";

const NODE_TYPES = {
  'on-trigger': { icon: ExternalLink, color: 'bg-blue-500', inputs: 0, outputs: 1 },
  'on-schedule': { icon: Calendar, color: 'bg-indigo-500', inputs: 0, outputs: 1 },
  'check-status': { icon: Search, color: 'bg-green-500', inputs: 1, outputs: 1 },
  'automate-task': { icon: Zap, color: 'bg-yellow-500', inputs: 1, outputs: 1 },
  'generate-text': { icon: FileText, color: 'bg-purple-500', inputs: 1, outputs: 1 },
  'generate-image': { icon: Image, color: 'bg-pink-500', inputs: 1, outputs: 1 },
  'generate-video': { icon: Video, color: 'bg-red-500', inputs: 1, outputs: 1 },
  'send-for-approval': { icon: UserCheck, color: 'bg-cyan-500', inputs: 1, outputs: 1 },
  'check-memory': { icon: Database, color: 'bg-teal-500', inputs: 0, outputs: 1 },
  'check-task-list': { icon: List, color: 'bg-gray-500', inputs: 0, outputs: 1 }
};

export default function Workspace({ agents, tasks, pan, zoom, onToggleStatus, onAgentClick, onNodeMove, onNodeConnect }) {
  const [draggedNode, setDraggedNode] = useState(null);
  const [connectionStart, setConnectionStart] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const workspaceRef = useRef(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return <Loader2 size={16} className="animate-spin text-blue-400" />;
      case 'success': return <CheckCircle size={16} className="text-green-400" />;
      case 'error': return <AlertCircle size={16} className="text-red-400" />;
      case 'idle': return <Pause size={16} className="text-gray-400" />;
      default: return <Activity size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'border-blue-400 bg-blue-900/20';
      case 'success': return 'border-green-400 bg-green-900/20';
      case 'error': return 'border-red-400 bg-red-900/20';
      case 'idle': return 'border-gray-400 bg-gray-900/20';
      default: return 'border-gray-400 bg-gray-900/20';
    }
  };

  const handleNodeMouseDown = (e, node) => {
    e.stopPropagation();
    setDraggedNode(node);
  };

  const handleMouseMove = (e) => {
    if (draggedNode) {
      const rect = workspaceRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      onNodeMove(draggedNode.id, { x, y });
    }
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  const handleConnectionStart = (e, nodeId, isOutput) => {
    e.stopPropagation();
    setConnectionStart({ nodeId, isOutput });
  };

  const handleConnectionEnd = (e, targetNodeId, isOutput) => {
    e.stopPropagation();
    if (connectionStart && connectionStart.nodeId !== targetNodeId) {
      const sourceNode = connectionStart.isOutput ? connectionStart.nodeId : targetNodeId;
      const targetNode = connectionStart.isOutput ? targetNodeId : connectionStart.nodeId;
      onNodeConnect(sourceNode, targetNode);
    }
    setConnectionStart(null);
  };

  const renderConnectionLine = () => {
    if (!connectionStart) return null;
    
    const startNode = agents.find(a => a.id === connectionStart.nodeId);
    if (!startNode) return null;

    const startX = startNode.position.x + 200; // Output position
    const startY = startNode.position.y + 50;
    const endX = mousePos.x;
    const endY = mousePos.y;

    return (
      <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1000 }}>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
          </marker>
        </defs>
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="#3b82f6"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
      </svg>
    );
  };

  const renderNode = (agent) => {
    const nodeType = NODE_TYPES[agent.type] || { icon: Brain, color: 'bg-gray-500', inputs: 0, outputs: 1 };
    const IconComponent = nodeType.icon;
    const agentTasks = tasks[agent.id] || [];
    const activeTasks = agentTasks.filter(task => task.status === 'running' || task.status === 'processing');

    return (
      <motion.div
        key={agent.id}
        className={`absolute bg-slate-800 border-2 rounded-lg p-4 min-w-[200px] cursor-move ${getStatusColor(agent.status)}`}
        style={{
          left: agent.position.x,
          top: agent.position.y,
          transform: `scale(${zoom})`,
          zIndex: draggedNode?.id === agent.id ? 1000 : 1
        }}
        onMouseDown={(e) => handleNodeMouseDown(e, agent)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Node Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg ${nodeType.color}`}>
              <IconComponent size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">{agent.name}</h3>
              <p className="text-xs text-gray-400">{agent.type}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {getStatusIcon(agent.status)}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(agent);
              }}
              className="p-1 hover:bg-slate-700 rounded"
            >
              {agent.is_active ? <Pause size={12} /> : <Play size={12} />}
            </button>
          </div>
        </div>

        {/* Node Content */}
        <div className="space-y-2">
          <div className="text-xs text-gray-300">
            {activeTasks.length > 0 ? (
              <div className="space-y-1">
                {activeTasks.slice(0, 2).map((task, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="truncate">{task.name}</span>
                  </div>
                ))}
                {activeTasks.length > 2 && (
                  <div className="text-gray-500">+{activeTasks.length - 2} more</div>
                )}
              </div>
            ) : (
              <div className="text-gray-500">No active tasks</div>
            )}
          </div>
        </div>

        {/* Connection Points */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Input Connections */}
          {Array.from({ length: nodeType.inputs }, (_, i) => (
            <div
              key={`input-${i}`}
              className="absolute left-0 w-3 h-3 bg-slate-600 border border-slate-500 rounded-full cursor-pointer pointer-events-auto hover:bg-slate-500"
              style={{ top: `${50 + i * 20}%` }}
              onMouseDown={(e) => handleConnectionStart(e, agent.id, false)}
              onMouseUp={(e) => handleConnectionEnd(e, agent.id, false)}
            />
          ))}
          
          {/* Output Connections */}
          {Array.from({ length: nodeType.outputs }, (_, i) => (
            <div
              key={`output-${i}`}
              className="absolute right-0 w-3 h-3 bg-blue-500 border border-blue-400 rounded-full cursor-pointer pointer-events-auto hover:bg-blue-400"
              style={{ top: `${50 + i * 20}%` }}
              onMouseDown={(e) => handleConnectionStart(e, agent.id, true)}
              onMouseUp={(e) => handleConnectionEnd(e, agent.id, true)}
            />
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div
      ref={workspaceRef}
      className="relative w-full h-full"
      style={{
        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        transformOrigin: '0 0'
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#2e3c51_1px,transparent_1px)] [background-size:32px_32px] opacity-30"></div>

      {/* Connection Lines */}
      {renderConnectionLine()}

      {/* Nodes */}
      {agents.map((agent) => renderNode(agent))}
    </div>
  );
} 