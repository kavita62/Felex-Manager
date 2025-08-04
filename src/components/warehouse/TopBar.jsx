import React from "react";
import { 
  Warehouse, 
  Activity, 
  FileText, 
  Maximize2, 
  Search, 
  Settings,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

export default function TopBar({ agents, onGenerateReport, onFitToScreen }) {
  const activeAgents = agents.filter(agent => agent.is_active).length;
  const totalAgents = agents.length;
  const processingAgents = agents.filter(agent => agent.status === 'processing').length;
  const errorAgents = agents.filter(agent => agent.status === 'error').length;

  return (
    <div className="bg-slate-900 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Warehouse size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Warehouse</h1>
              <p className="text-sm text-gray-400">Monitoramento de Agentes em Tempo Real</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-300">
                {activeAgents}/{totalAgents} Ativos
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">
                {processingAgents} Processando
              </span>
            </div>
            {errorAgents > 0 && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-sm text-gray-300">
                  {errorAgents} Erros
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Search */}
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <Search size={20} className="text-gray-400" />
          </button>

          {/* Settings */}
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <Settings size={20} className="text-gray-400" />
          </button>

          {/* Fit to Screen */}
          <button 
            onClick={onFitToScreen}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            title="Ajustar à tela"
          >
            <Maximize2 size={20} className="text-gray-400" />
          </button>

          {/* Generate Report */}
          <button 
            onClick={onGenerateReport}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors"
          >
            <FileText size={16} />
            <span className="text-sm">Gerar Relatório</span>
          </button>

          {/* Global Controls */}
          <div className="flex items-center space-x-1 border-l border-slate-700 pl-3">
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors" title="Iniciar Todos">
              <Play size={16} className="text-green-400" />
            </button>
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors" title="Pausar Todos">
              <Pause size={16} className="text-yellow-400" />
            </button>
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors" title="Reiniciar Todos">
              <RotateCcw size={16} className="text-blue-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 