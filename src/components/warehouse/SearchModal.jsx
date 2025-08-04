import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Brain, Zap, Target, Users, Activity, Plus } from "lucide-react";

export default function SearchModal({ isOpen, onClose, position, onNodeSelect }) {
  const [searchTerm, setSearchTerm] = useState("");

  const nodeTypes = [
    {
      id: 'content-creator',
      name: 'Content Creator',
      type: 'content',
      icon: Brain,
      description: 'Gera conteúdo criativo',
      category: 'Content'
    },
    {
      id: 'video-editor',
      name: 'Video Editor',
      type: 'video',
      icon: Zap,
      description: 'Edita e processa vídeos',
      category: 'Media'
    },
    {
      id: 'analytics-agent',
      name: 'Analytics Agent',
      type: 'analytics',
      icon: Target,
      description: 'Analisa dados e métricas',
      category: 'Analytics'
    },
    {
      id: 'social-media',
      name: 'Social Media',
      type: 'social',
      icon: Users,
      description: 'Gerencia redes sociais',
      category: 'Social'
    },
    {
      id: 'data-processor',
      name: 'Data Processor',
      type: 'data',
      icon: Activity,
      description: 'Processa dados em lote',
      category: 'Data'
    }
  ];

  const filteredNodes = nodeTypes.filter(node =>
    node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNodeSelect = (node) => {
    onNodeSelect(node, position);
    onClose();
    setSearchTerm("");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="absolute bg-slate-900 rounded-lg border border-slate-700 shadow-2xl p-4 min-w-[400px] max-w-[500px]"
          style={{
            left: position.x,
            top: position.y,
            transform: 'translate(-50%, -100%)'
          }}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Adicionar Agente</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-800 rounded transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mb-4">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar agentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
              autoFocus
            />
          </div>

          {/* Results */}
          <div className="max-h-64 overflow-y-auto">
            {filteredNodes.length > 0 ? (
              <div className="space-y-2">
                {filteredNodes.map((node) => (
                  <motion.div
                    key={node.id}
                    className="flex items-center space-x-3 p-3 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                    onClick={() => handleNodeSelect(node)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="p-2 bg-indigo-600 rounded-lg">
                      <node.icon size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm">{node.name}</h4>
                      <p className="text-xs text-gray-400">{node.description}</p>
                      <span className="text-xs text-indigo-400 bg-indigo-900 px-2 py-1 rounded">
                        {node.category}
                      </span>
                    </div>
                    <Plus size={16} className="text-gray-400" />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Search size={48} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-400">Nenhum agente encontrado</p>
                <p className="text-sm text-gray-500">Tente uma busca diferente</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center space-x-2 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-sm">
                <Plus size={16} />
                <span>Criar Customizado</span>
              </button>
              <button className="flex items-center justify-center space-x-2 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-sm">
                <Activity size={16} />
                <span>Importar</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 