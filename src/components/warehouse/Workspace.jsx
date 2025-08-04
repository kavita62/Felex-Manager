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
  'on-trigger': { 
    icon: ExternalLink, 
    color: 'bg-blue-500', 
    inputs: 0, 
    outputs: 1,
    outputTypes: ['trigger'],
    flowType: 'exec'
  },
  'on-schedule': { 
    icon: Calendar, 
    color: 'bg-indigo-500', 
    inputs: 0, 
    outputs: 1,
    outputTypes: ['trigger'],
    flowType: 'exec'
  },
  'check-status': { 
    icon: Search, 
    color: 'bg-green-500', 
    inputs: 1, 
    outputs: 1,
    inputTypes: ['trigger', 'data'],
    outputTypes: ['status'],
    flowType: 'data'
  },
  'automate-task': { 
    icon: Zap, 
    color: 'bg-yellow-500', 
    inputs: 1, 
    outputs: 1,
    inputTypes: ['trigger', 'data'],
    outputTypes: ['result'],
    flowType: 'exec'
  },
  'generate-text': { 
    icon: FileText, 
    color: 'bg-purple-500', 
    inputs: 1, 
    outputs: 1,
    inputTypes: ['trigger', 'data'],
    outputTypes: ['text'],
    flowType: 'data'
  },
  'generate-image': { 
    icon: Image, 
    color: 'bg-pink-500', 
    inputs: 1, 
    outputs: 1,
    inputTypes: ['trigger', 'data'],
    outputTypes: ['image'],
    flowType: 'data'
  },
  'generate-video': { 
    icon: Video, 
    color: 'bg-red-500', 
    inputs: 1, 
    outputs: 1,
    inputTypes: ['trigger', 'data'],
    outputTypes: ['video'],
    flowType: 'data'
  },
  'send-for-approval': { 
    icon: UserCheck, 
    color: 'bg-cyan-500', 
    inputs: 1, 
    outputs: 1,
    inputTypes: ['trigger', 'data', 'text', 'image', 'video'],
    outputTypes: ['approval'],
    flowType: 'exec'
  },
  'check-memory': { 
    icon: Database, 
    color: 'bg-teal-500', 
    inputs: 0, 
    outputs: 1,
    outputTypes: ['data'],
    flowType: 'data'
  },
  'check-task-list': { 
    icon: List, 
    color: 'bg-gray-500', 
    inputs: 0, 
    outputs: 1,
    outputTypes: ['data'],
    flowType: 'data'
  }
};

export default function Workspace({ agents, tasks, pan, zoom, onToggleStatus, onAgentClick, onNodeMove, onNodeConnect }) {
  const [draggedNode, setDraggedNode] = useState(null);
  const [draggedPin, setDraggedPin] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDraggingConnection, setIsDraggingConnection] = useState(false);
  const [hoveredPin, setHoveredPin] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
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

  const getPinColor = (type) => {
    switch (type) {
      case 'trigger': return 'bg-orange-500';
      case 'data': return 'bg-blue-500';
      case 'text': return 'bg-purple-500';
      case 'image': return 'bg-pink-500';
      case 'video': return 'bg-red-500';
      case 'status': return 'bg-green-500';
      case 'result': return 'bg-yellow-500';
      case 'approval': return 'bg-cyan-500';
      default: return 'bg-gray-500';
    }
  };

  const isCompatibleConnection = (sourceType, targetType, sourceIsOutput, targetIsOutput) => {
    // Prevent invalid connections
    if (sourceIsOutput === targetIsOutput) return false; // Can't connect output->output or input->input
    if (!sourceIsOutput) return false; // Can only start from output
    
    // Check type compatibility
    if (sourceType === targetType) return true;
    if (targetType === 'data') return true; // Data accepts any type
    if (sourceType === 'trigger') return true; // Trigger can start any flow
    
    return false;
  };

  const getConnectionStyle = (flowType, dataType) => {
    if (flowType === 'exec') {
      return {
        stroke: '#ffffff',
        strokeWidth: 2,
        strokeDasharray: '5,5'
      };
    } else {
      return {
        stroke: getPinColor(dataType).replace('bg-', '#'),
        strokeWidth: 3
      };
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
    if (isDraggingConnection) {
      setIsDraggingConnection(false);
      setDraggedPin(null);
      setConnectionError(null);
    }
  };

  const handlePinMouseDown = (e, nodeId, pinType, pinIndex, isOutput) => {
    e.stopPropagation();
    setIsDraggingConnection(true);
    setDraggedPin({ nodeId, pinType, pinIndex, isOutput });
    setConnectionError(null);
  };

  const handlePinMouseUp = (e, targetNodeId, targetPinType, targetPinIndex, targetIsOutput) => {
    e.stopPropagation();
    
    if (draggedPin && draggedPin.nodeId !== targetNodeId) {
      // Validate connection
      const sourceNode = agents.find(a => a.id === draggedPin.nodeId);
      const targetNode = agents.find(a => a.id === targetNodeId);
      
      if (sourceNode && targetNode) {
        const sourceNodeType = NODE_TYPES[sourceNode.type];
        const targetNodeType = NODE_TYPES[targetNode.type];
        
        const sourceOutputType = sourceNodeType.outputTypes[draggedPin.pinIndex];
        const targetInputType = targetNodeType.inputTypes[targetPinIndex];
        
        const isValid = isCompatibleConnection(
          sourceOutputType, 
          targetInputType, 
          draggedPin.isOutput, 
          targetIsOutput
        );
        
        if (isValid) {
          onNodeConnect(draggedPin.nodeId, targetNodeId, {
            sourcePin: draggedPin.pinIndex,
            targetPin: targetPinIndex,
            sourceType: sourceOutputType,
            targetType: targetInputType,
            flowType: sourceNodeType.flowType
          });
          setConnectionError(null);
        } else {
          setConnectionError('Invalid connection: Incompatible types or invalid pin combination');
          setTimeout(() => setConnectionError(null), 3000);
        }
      }
    }
    
    setIsDraggingConnection(false);
    setDraggedPin(null);
  };

  const handlePinMouseEnter = (nodeId, pinType, pinIndex, isOutput) => {
    if (isDraggingConnection && draggedPin) {
      const sourceNode = agents.find(a => a.id === draggedPin.nodeId);
      const targetNode = agents.find(a => a.id === nodeId);
      
      if (sourceNode && targetNode) {
        const sourceNodeType = NODE_TYPES[sourceNode.type];
        const targetNodeType = NODE_TYPES[targetNode.type];
        
        const sourceOutputType = sourceNodeType.outputTypes[draggedPin.pinIndex];
        const targetInputType = targetNodeType.inputTypes[pinIndex];
        
        const isValid = isCompatibleConnection(
          sourceOutputType, 
          targetInputType, 
          draggedPin.isOutput, 
          isOutput
        );
        
        setHoveredPin({ nodeId, pinType, pinIndex, isOutput, isValid });
      }
    }
  };

  const handlePinMouseLeave = () => {
    setHoveredPin(null);
  };

  const renderConnectionLine = () => {
    if (!isDraggingConnection || !draggedPin) return null;
    
    const sourceNode = agents.find(a => a.id === draggedPin.nodeId);
    if (!sourceNode) return null;

    const nodeType = NODE_TYPES[sourceNode.type];
    const startX = sourceNode.position.x + 220;
    const startY = sourceNode.position.y + 60 + (draggedPin.pinIndex * 20);
    const endX = mousePos.x;
    const endY = mousePos.y;

    // Calculate control points for Bezier curve
    const controlPoint1X = startX + 100;
    const controlPoint1Y = startY;
    const controlPoint2X = endX - 100;
    const controlPoint2Y = endY;

    const connectionStyle = getConnectionStyle(nodeType.flowType, draggedPin.pinType);
    const strokeColor = hoveredPin && !hoveredPin.isValid ? '#ef4444' : connectionStyle.stroke;

    return (
      <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1000 }}>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={strokeColor} />
          </marker>
        </defs>
        <path
          d={`M ${startX} ${startY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${endX} ${endY}`}
          stroke={strokeColor}
          strokeWidth={connectionStyle.strokeWidth}
          strokeDasharray={connectionStyle.strokeDasharray}
          fill="none"
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

        {/* Input Pins */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-center space-y-2 pointer-events-none">
          {Array.from({ length: nodeType.inputs }, (_, i) => {
            const inputType = nodeType.inputTypes[i];
            const isHovered = hoveredPin && hoveredPin.nodeId === agent.id && hoveredPin.pinIndex === i && !hoveredPin.isOutput;
            const isValidTarget = hoveredPin && hoveredPin.isValid;
            
            return (
              <div
                key={`input-${i}`}
                className={`w-3 h-3 ${getPinColor(inputType)} border-2 rounded-full cursor-pointer pointer-events-auto hover:scale-125 transition-transform ${
                  isHovered ? (isValidTarget ? 'border-green-400 scale-150' : 'border-red-400 scale-150') : 'border-white'
                }`}
                style={{ top: `${30 + i * 20}%` }}
                onMouseDown={(e) => handlePinMouseDown(e, agent.id, inputType, i, false)}
                onMouseUp={(e) => handlePinMouseUp(e, agent.id, inputType, i, false)}
                onMouseEnter={() => handlePinMouseEnter(agent.id, inputType, i, false)}
                onMouseLeave={handlePinMouseLeave}
                title={`Input: ${inputType}`}
              />
            );
          })}
        </div>
        
        {/* Output Pins */}
        <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center space-y-2 pointer-events-none">
          {Array.from({ length: nodeType.outputs }, (_, i) => {
            const outputType = nodeType.outputTypes[i];
            const isHovered = hoveredPin && hoveredPin.nodeId === agent.id && hoveredPin.pinIndex === i && hoveredPin.isOutput;
            
            return (
              <div
                key={`output-${i}`}
                className={`w-3 h-3 ${getPinColor(outputType)} border-2 rounded-full cursor-pointer pointer-events-auto hover:scale-125 transition-transform ${
                  isHovered ? 'border-green-400 scale-150' : 'border-white'
                }`}
                style={{ top: `${30 + i * 20}%` }}
                onMouseDown={(e) => handlePinMouseDown(e, agent.id, outputType, i, true)}
                onMouseUp={(e) => handlePinMouseUp(e, agent.id, outputType, i, true)}
                onMouseEnter={() => handlePinMouseEnter(agent.id, outputType, i, true)}
                onMouseLeave={handlePinMouseLeave}
                title={`Output: ${outputType}`}
              />
            );
          })}
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

      {/* Error Message */}
      {connectionError && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {connectionError}
        </div>
      )}

      {/* Nodes */}
      {agents.map((agent) => renderNode(agent))}
    </div>
  );
} 