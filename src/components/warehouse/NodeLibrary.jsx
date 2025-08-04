import React from "react";
import { motion } from "framer-motion";
import { 
  Brain, 
  Zap, 
  Target, 
  Users, 
  Activity, 
  Plus,
  Settings,
  Database,
  MessageSquare,
  Image,
  Video,
  FileText
} from "lucide-react";

export default function NodeLibrary() {
  const nodeTypes = [
    {
      id: 'content-creator',
      name: 'Content Creator',
      type: 'content',
      icon: Brain,
      description: 'Gera conteúdo criativo',
      color: 'bg-purple-500'
    },
    {
      id: 'video-editor',
      name: 'Video Editor',
      type: 'video',
      icon: Video,
      description: 'Edita e processa vídeos',
      color: 'bg-blue-500'
    },
    {
      id: 'analytics-agent',
      name: 'Analytics Agent',
      type: 'analytics',
      icon: Target,
      description: 'Analisa dados e métricas',
      color: 'bg-green-500'
    },
    {
      id: 'social-media',
      name: 'Social Media',
      type: 'social',
      icon: Users,
      description: 'Gerencia redes sociais',
      color: 'bg-pink-500'
    },
    {
      id: 'data-processor',
      name: 'Data Processor',
      type: 'data',
      icon: Database,
      description: 'Processa dados em lote',
      color: 'bg-indigo-500'
    },
    {
      id: 'chat-agent',
      name: 'Chat Agent',
      type: 'chat',
      icon: MessageSquare,
      description: 'Atende conversas',
      color: 'bg-yellow-500'
    },
    {
      id: 'image-generator',
      name: 'Image Generator',
      type: 'image',
      icon: Image,
      description: 'Gera imagens AI',
      color: 'bg-red-500'
    },
    {
      id: 'document-processor',
      name: 'Document Processor',
      type: 'document',
      icon: FileText,
      description: 'Processa documentos',
      color: 'bg-gray-500'
    }
  ];

  const handleDragStart = (e, nodeType) => {
    e.dataTransfer.setData('application/node-type', nodeType.id);
    e.dataTransfer.setData('application/node-name', nodeType.name);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-80 bg-slate-900 border-r border-slate-700 p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">Biblioteca de Agentes</h2>
        <p className="text-sm text-gray-400">Arraste agentes para o workspace</p>
      </div>

      <div className="space-y-3">
        {nodeTypes.map((nodeType) => (
          <motion.div
            key={nodeType.id}
            className="bg-slate-800 rounded-lg p-4 border border-slate-700 cursor-move hover:border-indigo-500 transition-all duration-200"
            draggable
            onDragStart={(e) => handleDragStart(e, nodeType)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${nodeType.color}`}>
                <nodeType.icon size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-sm">{nodeType.name}</h3>
                <p className="text-xs text-gray-400">{nodeType.description}</p>
              </div>
              <Plus size={16} className="text-gray-400" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 pt-6 border-t border-slate-700">
        <h3 className="text-sm font-semibold text-white mb-3">Ações Rápidas</h3>
        <div className="space-y-2">
          <button className="w-full flex items-center space-x-2 p-2 hover:bg-slate-800 rounded-lg transition-colors text-sm text-gray-300">
            <Settings size={16} />
            <span>Configurar Agente</span>
          </button>
          <button className="w-full flex items-center space-x-2 p-2 hover:bg-slate-800 rounded-lg transition-colors text-sm text-gray-300">
            <Activity size={16} />
            <span>Monitorar Performance</span>
          </button>
          <button className="w-full flex items-center space-x-2 p-2 hover:bg-slate-800 rounded-lg transition-colors text-sm text-gray-300">
            <Plus size={16} />
            <span>Criar Novo Agente</span>
          </button>
        </div>
      </div>

      {/* Recent Agents */}
      <div className="mt-8 pt-6 border-t border-slate-700">
        <h3 className="text-sm font-semibold text-white mb-3">Agentes Recentes</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 p-2 bg-slate-800 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs text-gray-300">Content Creator Agent</span>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-slate-800 rounded-lg">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-300">Video Editor Agent</span>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-slate-800 rounded-lg">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span className="text-xs text-gray-300">Analytics Agent</span>
          </div>
        </div>
      </div>
    </div>
  );
} 