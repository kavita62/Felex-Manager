import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Activity, Brain, Zap, Target, Users, Clock, CheckCircle, AlertCircle, Play, Pause, Loader2 } from "lucide-react";

export default function AgentModal({ agent, tasks, onClose }) {
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

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-slate-900 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-700"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-600 rounded-lg">
                {getTypeIcon(agent.type)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{agent.name}</h2>
                <p className="text-gray-400">Agente {agent.type} - Monitoramento em Tempo Real</p>
              </div>
            </div>
            <button
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              onClick={onClose}
            >
              <X size={24} className="text-gray-400" />
            </button>
          </div>

          {/* Agent Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                {getStatusIcon(agent.status)}
                <span className={`font-semibold ${getStatusColor(agent.status)}`}>
                  {agent.status}
                </span>
              </div>
              <p className="text-sm text-gray-400">Status Atual</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-400">
                {agent.performance || 85}%
              </div>
              <p className="text-sm text-gray-400">Performance</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">
                {tasks.length}
              </div>
              <p className="text-sm text-gray-400">Tarefas Ativas</p>
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Activity size={20} />
              <span>Tarefas em Execução</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id || index}
                  className="bg-slate-800 rounded-lg p-4 border border-slate-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{task.name}</h4>
                    {getStatusIcon(task.status)}
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{task.description || 'Processando...'}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Última execução:</span>
                    <span>{task.last_run ? new Date(task.last_run).toLocaleTimeString() : 'Nunca'}</span>
                  </div>
                  {task.progress !== undefined && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progresso</span>
                        <span>{task.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Agent Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="font-semibold mb-4 flex items-center space-x-2">
                <Brain size={20} />
                <span>Configurações</span>
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Tipo:</span>
                  <span className="text-white capitalize">{agent.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Memória:</span>
                  <span className="text-white">{agent.memory || 'High'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ativo:</span>
                  <span className={`${agent.is_active ? 'text-green-400' : 'text-red-400'}`}>
                    {agent.is_active ? 'Sim' : 'Não'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Criado:</span>
                  <span className="text-white">
                    {agent.created_at ? new Date(agent.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="font-semibold mb-4 flex items-center space-x-2">
                <Clock size={20} />
                <span>Atividade Recente</span>
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3 p-2 bg-slate-700 rounded">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Processando dados de entrada...</span>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-slate-700 rounded">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>Aplicando regras de negócio...</span>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-slate-700 rounded">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span>Gerando saída otimizada...</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 