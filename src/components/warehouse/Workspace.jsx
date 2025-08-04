import React, { useState, useRef, useEffect } from "react";
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
  },
  'agent-selector': { 
    icon: Users, 
    color: 'bg-orange-500', 
    inputs: 0, 
    outputs: 1,
    outputTypes: ['agent'],
    flowType: 'data'
  }
};

export default function Workspace({ agents, tasks, pan, zoom, onToggleStatus, onAgentClick, onNodeMove, onNodeConnect, onNodeDelete, selectedNode, onNodeSelect, connections }) {
  const [draggedNode, setDraggedNode] = useState(null);
  const [draggedPin, setDraggedPin] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDraggingConnection, setIsDraggingConnection] = useState(false);
  const [hoveredPin, setHoveredPin] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const [autoConnectTarget, setAutoConnectTarget] = useState(null);
  const [activeConnections, setActiveConnections] = useState(new Set());
  const workspaceRef = useRef(null);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && selectedNode) {
        onNodeDelete(selectedNode);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode, onNodeDelete]);

  // Simulate active connections
  useEffect(() => {
    const interval = setInterval(() => {
      if (connections && connections.length > 0) {
        const randomConnection = connections[Math.floor(Math.random() * connections.length)];
        setActiveConnections(prev => {
          const newSet = new Set(prev);
          newSet.add(randomConnection.id);
          setTimeout(() => {
            setActiveConnections(current => {
              const updated = new Set(current);
              updated.delete(randomConnection.id);
              return updated;
            });
          }, 1000);
          return newSet;
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [connections]);

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
      case 'agent': return 'bg-orange-500';
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
    if (sourceType === 'agent' && targetType === 'data') return true; // Agent can connect to data
    
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
      const colorMap = {
        'trigger': '#f97316',
        'data': '#3b82f6',
        'text': '#a855f7',
        'image': '#ec4899',
        'video': '#ef4444',
        'status': '#22c55e',
        'result': '#eab308',
        'approval': '#06b6d4',
        'agent': '#f97316'
      };
      return {
        stroke: colorMap[dataType] || '#6b7280',
        strokeWidth: 3
      };
    }
  };

  const handleNodeMouseDown = (e, node) => {
    e.stopPropagation();
    setDraggedNode(node);
    onNodeSelect(node);
  };

  const handleMouseMove = (e) => {
    if (draggedNode) {
      const rect = workspaceRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      
      // Check for auto-connect when dragging over other nodes
      const overlappingNode = agents.find(agent => {
        if (agent.id === draggedNode.id) return false;
        const distance = Math.sqrt(
          Math.pow(x - agent.position.x, 2) + Math.pow(y - agent.position.y, 2)
        );
        return distance < 150; // Auto-connect threshold
      });

      if (overlappingNode) {
        setAutoConnectTarget(overlappingNode);
      } else {
        setAutoConnectTarget(null);
      }

      onNodeMove(draggedNode.id, { x, y });
    }
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    if (draggedNode && autoConnectTarget) {
      // Auto-connect the nodes
      const sourceNodeType = NODE_TYPES[draggedNode.type];
      const targetNodeType = NODE_TYPES[autoConnectTarget.type];
      
      if (sourceNodeType.outputs.length > 0 && targetNodeType.inputs.length > 0) {
        const sourceOutputType = sourceNodeType.outputTypes[0];
        const targetInputType = targetNodeType.inputTypes[0];
        
        if (isCompatibleConnection(sourceOutputType, targetInputType, true, false)) {
          onNodeConnect(draggedNode.id, autoConnectTarget.id, {
            sourcePin: 0,
            targetPin: 0,
            sourceType: sourceOutputType,
            targetType: targetInputType,
            flowType: sourceNodeType.flowType
          });
        }
      }
    }
    
    setDraggedNode(null);
    setAutoConnectTarget(null);
    
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

  const renderExistingConnections = () => {
    if (!connections || connections.length === 0) return null;
    
    return connections.map(connection => {
      const sourceAgent = agents.find(a => a.id === connection.source);
      const targetAgent = agents.find(a => a.id === connection.target);
      
      if (!sourceAgent || !targetAgent) return null;
      
      const startX = sourceAgent.position.x + 220;
      const startY = sourceAgent.position.y + 60 + (connection.sourcePin * 20);
      const endX = targetAgent.position.x;
      const endY = targetAgent.position.y + 60 + (connection.targetPin * 20);
      
      // Calculate control points for Bezier curve
      const controlPoint1X = startX + 100;
      const controlPoint1Y = startY;
      const controlPoint2X = endX - 100;
      const controlPoint2Y = endY;
      
      const connectionStyle = getConnectionStyle(connection.flowType, connection.sourceType);
      const isActive = activeConnections.has(connection.id);
      
      return (
        <g key={connection.id}>
          <defs>
            <marker id={`arrowhead-${connection.id}`} markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill={connectionStyle.stroke} />
            </marker>
          </defs>
          {/* Main connection line */}
          <path
            d={`M ${startX} ${startY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${endX} ${endY}`}
            stroke={connectionStyle.stroke}
            strokeWidth={connectionStyle.strokeWidth}
            strokeDasharray={connectionStyle.strokeDasharray}
            fill="none"
            markerEnd={`url(#arrowhead-${connection.id})`}
            className="drop-shadow-lg"
          />
          {/* Active connection indicator */}
          {isActive && (
            <path
              d={`M ${startX} ${startY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${endX} ${endY}`}
              stroke="#ffffff"
              strokeWidth="4"
              strokeDasharray="5,5"
              fill="none"
              className="animate-pulse"
            />
          )}
          {/* Connection points */}
          <circle
            cx={startX}
            cy={startY}
            r="4"
            fill={connectionStyle.stroke}
            className="drop-shadow-md"
          />
          <circle
            cx={endX}
            cy={endY}
            r="4"
            fill={connectionStyle.stroke}
            className="drop-shadow-md"
          />
        </g>
      );
    });
  };

  const renderNode = (agent) => {
    const nodeType = NODE_TYPES[agent.type] || { icon: Brain, color: 'bg-gray-500', inputs: 0, outputs: 1 };
    const IconComponent = nodeType.icon;
    const agentTasks = tasks[agent.id] || [];
    const activeTasks = agentTasks.filter(task => task.status === 'running' || task.status === 'processing');
    const isSelected = selectedNode && selectedNode.id === agent.id;
    const isAutoConnectTarget = autoConnectTarget && autoConnectTarget.id === agent.id;

    // Check if this node has connections
    const hasInputConnections = connections && connections.some(conn => conn.target === agent.id);
    const hasOutputConnections = connections && connections.some(conn => conn.source === agent.id);

    return (
      <motion.div
        key={agent.id}
        className={`absolute bg-slate-800 border-2 rounded-lg p-4 min-w-[200px] cursor-move transition-all duration-200 ${
          getStatusColor(agent.status)
        } ${
          isSelected ? 'border-yellow-400 shadow-lg shadow-yellow-400/50' : 'border-slate-700'
        } ${
          isAutoConnectTarget ? 'ring-2 ring-green-400 ring-opacity-50' : ''
        } ${
          hasInputConnections || hasOutputConnections ? 'ring-1 ring-blue-400 ring-opacity-30' : ''
        }`}
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

        {/* Connection indicators */}
        {(hasInputConnections || hasOutputConnections) && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {connections.filter(conn => conn.source === agent.id || conn.target === agent.id).length}
            </span>
          </div>
        )}

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
            <CheckCircle size={12} className="text-black" />
          </div>
        )}

        {/* Input Pins */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-center space-y-2 pointer-events-none">
          {Array.from({ length: nodeType.inputs }, (_, i) => {
            const inputType = nodeType.inputTypes[i];
            const isHovered = hoveredPin && hoveredPin.nodeId === agent.id && hoveredPin.pinIndex === i && !hoveredPin.isOutput;
            const isValidTarget = hoveredPin && hoveredPin.isValid;
            const isConnected = connections && connections.some(conn => conn.target === agent.id && conn.targetPin === i);
            
            return (
              <div
                key={`input-${i}`}
                className={`w-3 h-3 ${getPinColor(inputType)} border-2 rounded-full cursor-pointer pointer-events-auto hover:scale-125 transition-transform ${
                  isHovered ? (isValidTarget ? 'border-green-400 scale-150' : 'border-red-400 scale-150') : 'border-white'
                } ${
                  isConnected ? 'ring-2 ring-blue-400 ring-opacity-75' : ''
                }`}
                style={{ top: `${30 + i * 20}%` }}
                onMouseDown={(e) => handlePinMouseDown(e, agent.id, inputType, i, false)}
                onMouseUp={(e) => handlePinMouseUp(e, agent.id, inputType, i, false)}
                onMouseEnter={() => handlePinMouseEnter(agent.id, inputType, i, false)}
                onMouseLeave={handlePinMouseLeave}
                title={`Input: ${inputType}${isConnected ? ' (Connected)' : ''}`}
              />
            );
          })}
        </div>
        
        {/* Output Pins */}
        <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-center space-y-2 pointer-events-none">
          {Array.from({ length: nodeType.outputs }, (_, i) => {
            const outputType = nodeType.outputTypes[i];
            const isHovered = hoveredPin && hoveredPin.nodeId === agent.id && hoveredPin.pinIndex === i && hoveredPin.isOutput;
            const isConnected = connections && connections.some(conn => conn.source === agent.id && conn.sourcePin === i);
            
            return (
              <div
                key={`output-${i}`}
                className={`w-3 h-3 ${getPinColor(outputType)} border-2 rounded-full cursor-pointer pointer-events-auto hover:scale-125 transition-transform ${
                  isHovered ? 'border-green-400 scale-150' : 'border-white'
                } ${
                  isConnected ? 'ring-2 ring-blue-400 ring-opacity-75' : ''
                }`}
                style={{ top: `${30 + i * 20}%` }}
                onMouseDown={(e) => handlePinMouseDown(e, agent.id, outputType, i, true)}
                onMouseUp={(e) => handlePinMouseUp(e, agent.id, outputType, i, true)}
                onMouseEnter={() => handlePinMouseEnter(agent.id, outputType, i, true)}
                onMouseLeave={handlePinMouseLeave}
                title={`Output: ${outputType}${isConnected ? ' (Connected)' : ''}`}
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

      {/* Existing Connections */}
      <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 400 }}>
        {renderExistingConnections()}
      </svg>

      {/* Connection Lines */}
      {renderConnectionLine()}

      {/* Error Message */}
      {connectionError && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {connectionError}
        </div>
      )}

      {/* Auto-connect indicator */}
      {autoConnectTarget && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Auto-connecting to {autoConnectTarget.name}...
        </div>
      )}

      {/* Nodes */}
      {agents.map((agent) => renderNode(agent))}
    </div>
  );
} 