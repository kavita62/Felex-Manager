import React, { useState, useEffect } from 'react';
import { 
    Warehouse, 
    Users, 
    Activity, 
    Play, 
    Pause, 
    StopCircle, 
    Settings, 
    Eye, 
    Plus,
    Brain,
    Zap,
    Target,
    Clock,
    CheckCircle,
    AlertCircle,
    Loader2,
    X
} from 'lucide-react';

const WarehouseSection = () => {
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
            performance: 92
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
            performance: 88
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
            performance: 95
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
            performance: 65
        }
    ]);

    const [selectedAgent, setSelectedAgent] = useState(null);
    const [showAgentOffice, setShowAgentOffice] = useState(false);

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'text-green-400';
            case 'idle': return 'text-yellow-400';
            case 'processing': return 'text-blue-400';
            case 'error': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return <Play size={16} />;
            case 'idle': return <Pause size={16} />;
            case 'processing': return <Loader2 size={16} className="animate-spin" />;
            case 'error': return <AlertCircle size={16} />;
            default: return <StopCircle size={16} />;
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

    const handleAgentClick = (agent) => {
        setSelectedAgent(agent);
        setShowAgentOffice(true);
    };

    const toggleAgentStatus = (agentId, newStatus) => {
        setAgents(agents.map(agent => 
            agent.id === agentId 
                ? { ...agent, status: newStatus }
                : agent
        ));
    };

    return (
        <div className="h-full bg-gray-900 text-white p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                    <div className="p-3 bg-indigo-600 rounded-lg">
                        <Warehouse size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">AI Warehouse</h1>
                        <p className="text-gray-400">Gerencie seus agentes AI e monitore suas atividades</p>
                    </div>
                </div>
                <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors">
                    <Plus size={20} />
                    <span>Novo Agente</span>
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Agentes Ativos</p>
                            <p className="text-2xl font-bold text-green-400">3</p>
                        </div>
                        <div className="p-2 bg-green-500/20 rounded-lg">
                            <Activity size={20} className="text-green-400" />
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Em Processamento</p>
                            <p className="text-2xl font-bold text-blue-400">2</p>
                        </div>
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Loader2 size={20} className="text-blue-400 animate-spin" />
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Performance Média</p>
                            <p className="text-2xl font-bold text-purple-400">85%</p>
                        </div>
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Target size={20} className="text-purple-400" />
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Tarefas Concluídas</p>
                            <p className="text-2xl font-bold text-indigo-400">127</p>
                        </div>
                        <div className="p-2 bg-indigo-500/20 rounded-lg">
                            <CheckCircle size={20} className="text-indigo-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Agents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent) => (
                    <div 
                        key={agent.id}
                        className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-indigo-500 transition-all cursor-pointer"
                        onClick={() => handleAgentClick(agent)}
                    >
                        {/* Agent Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-indigo-600 rounded-lg">
                                    {getTypeIcon(agent.type)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{agent.name}</h3>
                                    <div className="flex items-center space-x-2">
                                        <span className={`flex items-center space-x-1 ${getStatusColor(agent.status)}`}>
                                            {getStatusIcon(agent.status)}
                                            <span className="text-sm capitalize">{agent.status}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-1">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleAgentStatus(agent.id, 'active');
                                    }}
                                    className="p-1 hover:bg-green-500/20 rounded"
                                >
                                    <Play size={16} className="text-green-400" />
                                </button>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleAgentStatus(agent.id, 'idle');
                                    }}
                                    className="p-1 hover:bg-yellow-500/20 rounded"
                                >
                                    <Pause size={16} className="text-yellow-400" />
                                </button>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleAgentStatus(agent.id, 'error');
                                    }}
                                    className="p-1 hover:bg-red-500/20 rounded"
                                >
                                    <StopCircle size={16} className="text-red-400" />
                                </button>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-400 mb-1">
                                <span>Progresso</span>
                                <span>{agent.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div 
                                    className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${agent.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Agent Details */}
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Tarefa:</span>
                                <span className="text-white">{agent.task}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Memória:</span>
                                <span className="text-white">{agent.memory}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Performance:</span>
                                <span className="text-white">{agent.performance}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Última Atividade:</span>
                                <span className="text-white">{agent.lastActivity}</span>
                            </div>
                        </div>

                        {/* Rules Tags */}
                        <div className="mt-4 flex flex-wrap gap-1">
                            {agent.rules.map((rule, index) => (
                                <span 
                                    key={index}
                                    className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded"
                                >
                                    {rule}
                                </span>
                            ))}
                        </div>

                        {/* View Details Button */}
                        <button 
                            className="w-full mt-4 flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAgentClick(agent);
                            }}
                        >
                            <Eye size={16} />
                            <span>Ver Detalhes</span>
                        </button>
                    </div>
                ))}
            </div>

            {/* Agent Office Modal */}
            {showAgentOffice && selectedAgent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-indigo-600 rounded-lg">
                                    {getTypeIcon(selectedAgent.type)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{selectedAgent.name}</h2>
                                    <p className="text-gray-400">Agente Office - Monitoramento em Tempo Real</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setShowAgentOffice(false)}
                                className="p-2 hover:bg-gray-700 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Agent Office Content */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Real-time Activity */}
                            <div className="bg-gray-700 rounded-lg p-4">
                                <h3 className="font-semibold mb-4 flex items-center space-x-2">
                                    <Activity size={20} />
                                    <span>Atividade em Tempo Real</span>
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3 p-3 bg-gray-600 rounded">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-sm">Processando dados de entrada...</span>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 bg-gray-600 rounded">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                        <span className="text-sm">Aplicando regras de negócio...</span>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 bg-gray-600 rounded">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                                        <span className="text-sm">Gerando saída otimizada...</span>
                                    </div>
                                </div>
                            </div>

                            {/* Decision Making */}
                            <div className="bg-gray-700 rounded-lg p-4">
                                <h3 className="font-semibold mb-4 flex items-center space-x-2">
                                    <Brain size={20} />
                                    <span>Tomada de Decisões</span>
                                </h3>
                                <div className="space-y-3">
                                    <div className="p-3 bg-gray-600 rounded">
                                        <p className="text-sm font-medium">Análise de Contexto</p>
                                        <p className="text-xs text-gray-400">Analisando padrões de comportamento...</p>
                                    </div>
                                    <div className="p-3 bg-gray-600 rounded">
                                        <p className="text-sm font-medium">Aplicação de Regras</p>
                                        <p className="text-xs text-gray-400">Executando {selectedAgent.rules.join(', ')}</p>
                                    </div>
                                    <div className="p-3 bg-gray-600 rounded">
                                        <p className="text-sm font-medium">Otimização</p>
                                        <p className="text-xs text-gray-400">Ajustando parâmetros para melhor performance...</p>
                                    </div>
                                </div>
                            </div>

                            {/* Memory & Learning */}
                            <div className="bg-gray-700 rounded-lg p-4">
                                <h3 className="font-semibold mb-4 flex items-center space-x-2">
                                    <Clock size={20} />
                                    <span>Memória & Aprendizado</span>
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span>Memória Atual:</span>
                                        <span className="text-green-400">{selectedAgent.memory}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Performance:</span>
                                        <span className="text-blue-400">{selectedAgent.performance}%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Última Atividade:</span>
                                        <span className="text-gray-400">{selectedAgent.lastActivity}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Output Preview */}
                            <div className="bg-gray-700 rounded-lg p-4">
                                <h3 className="font-semibold mb-4 flex items-center space-x-2">
                                    <Zap size={20} />
                                    <span>Preview da Saída</span>
                                </h3>
                                <div className="bg-gray-600 rounded p-3">
                                    <p className="text-sm text-gray-300">
                                        {selectedAgent.type === 'content' && 'Gerando post otimizado para Instagram...'}
                                        {selectedAgent.type === 'video' && 'Processando vídeo com efeitos...'}
                                        {selectedAgent.type === 'analytics' && 'Analisando métricas de engajamento...'}
                                        {selectedAgent.type === 'social' && 'Agendando publicações...'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WarehouseSection; 