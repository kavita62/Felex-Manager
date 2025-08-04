import React from "react";
import { motion } from "framer-motion";
import { Brain, Zap, Target, Users, Activity, Play, Pause, Loader2, AlertCircle, CheckCircle } from "lucide-react";

export default function Workspace({ agents, tasks, pan, zoom, onToggleStatus, onAgentClick }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Play size={16} className="text-green-400" />;
      case 'idle': return <Pause size={16} className="text-yellow-400" />;
      case 'processing': return <Loader2 size={16} className="text-blue-400 animate-spin" />;
      case 'error': return <AlertCircle size={16} className="text-red-400" />;
      case 'success': return <CheckCircle size={16} className="text-green-400" />;
      default: return <Activity size={16} className="text-gray-400" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'content': return <Brain size={20} />;
      case 'video': return <Zap size={20} />;
      case 'analytics': return <Target size={20} />;
      case 'social': return <Users size={20} />;
      default: return <Activity size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'idle': return 'text-yellow-400';
      case 'processing': return 'text-blue-400';
      case 'error': return 'text-red-400';
      case 'success': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getAgentPosition = (index) => {
    const positions = [
      { x: 100, y: 100 },
      { x: 400, y: 100 },
      { x: 700, y: 100 },
      { x: 100, y: 300 },
      { x: 400, y: 300 },
      { x: 700, y: 300 },
      { x: 100, y: 500 },
      { x: 400, y: 500 },
      { x: 700, y: 500 }
    ];
    return positions[index] || { x: 100 + (index * 300), y: 100 + (Math.floor(index / 3) * 200) };
  };

  return (
    <div
      className="relative w-full h-full"
      style={{
        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        transformOrigin: '0 0'
      }}
    >
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#2e3c51_1px,transparent_1px)] [background-size:32px_32px] opacity-30"></div>

      {/* Agents */}
      {agents.map((agent, index) => {
        const position = getAgentPosition(index);
        const agentTasks = tasks[agent.id] || [];
        const activeTasks = agentTasks.filter(task => task.status === 'running' || task.status === 'processing');
        
        return (
          <motion.div
            key={agent.id}
            className="absolute bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg cursor-pointer hover:border-indigo-500 transition-all duration-200 min-w-[280px]"
            style={{
              left: position.x,
              top: position.y,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onAgentClick(agent)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Agent Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-600 rounded-lg">
                  {getTypeIcon(agent.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">{agent.name}</h3>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(agent.status)}
                    <span className={`text-xs capitalize ${getStatusColor(agent.status)}`}>
                      {agent.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStatus(agent);
                  }}
                  className="p-1 hover:bg-slate-700 rounded transition-colors"
                >
                  {agent.is_active ? (
                    <Pause size={14} className="text-yellow-400" />
                  ) : (
                    <Play size={14} className="text-green-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Progresso</span>
                <span>{agent.progress || 0}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5">
                <div
                  className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${agent.progress || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Active Tasks */}
            <div className="space-y-2">
              <div className="text-xs text-gray-400 font-medium">Tarefas Ativas:</div>
              {activeTasks.slice(0, 2).map((task, taskIndex) => (
                <div key={task.id || taskIndex} className="flex items-center space-x-2 p-2 bg-slate-700 rounded text-xs">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></div>
                  <span className="text-white truncate">{task.name}</span>
                  {getStatusIcon(task.status)}
                </div>
              ))}
              {activeTasks.length > 2 && (
                <div className="text-xs text-gray-500 text-center">
                  +{activeTasks.length - 2} mais tarefas
                </div>
              )}
              {activeTasks.length === 0 && (
                <div className="text-xs text-gray-500 text-center py-2">
                  Nenhuma tarefa ativa
                </div>
              )}
            </div>

            {/* Agent Stats */}
            <div className="mt-3 pt-3 border-t border-slate-700">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-gray-400">
                  Performance: <span className="text-blue-400">{agent.performance || 85}%</span>
                </div>
                <div className="text-gray-400">
                  Memória: <span className="text-green-400">{agent.memory || 'High'}</span>
                </div>
              </div>
            </div>

            {/* Connection Lines (Visual) */}
            {index < agents.length - 1 && (
              <div
                className="absolute w-px bg-indigo-500/30"
                style={{
                  left: '50%',
                  top: '100%',
                  height: '50px',
                  transform: 'translateX(-50%)'
                }}
              ></div>
            )}
          </motion.div>
        );
      })}

      {/* Connection Lines between agents */}
      {agents.map((agent, index) => {
        if (index === agents.length - 1) return null;
        const currentPos = getAgentPosition(index);
        const nextPos = getAgentPosition(index + 1);
        
        return (
          <svg
            key={`connection-${index}`}
            className="absolute pointer-events-none"
            style={{
              left: 0,
              top: 0,
              width: '100%',
              height: '100%'
            }}
          >
            <line
              x1={currentPos.x + 140}
              y1={currentPos.y + 100}
              x2={nextPos.x + 140}
              y2={nextPos.y + 100}
              stroke="#6366f1"
              strokeWidth="1"
              strokeDasharray="5,5"
              opacity="0.3"
            />
          </svg>
        );
      })}
    </div>
  );
} 