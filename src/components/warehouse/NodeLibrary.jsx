import React from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Clock,
  Play,
  CheckCircle,
  FileText,
  Image,
  Video,
  Send,
  Database,
  List,
  Brain,
  Activity,
  UserCheck,
  ArrowRight,
  Calendar,
  ExternalLink,
  Search,
  MessageSquare
} from "lucide-react";

const CATEGORIES = [
  {
    name: "Events",
    nodes: [
      {
        id: "on-trigger",
        name: "On Trigger",
        icon: ExternalLink,
        description: "Starts workflow from an external call.",
        color: "bg-blue-500"
      },
      {
        id: "on-schedule",
        name: "On Schedule",
        icon: Calendar,
        description: "Runs workflow at a specific time.",
        color: "bg-indigo-500"
      }
    ]
  },
  {
    name: "Actions",
    nodes: [
      {
        id: "check-status",
        name: "Check Status",
        icon: Search,
        description: "Checks the status of a service or agent.",
        color: "bg-green-500"
      },
      {
        id: "automate-task",
        name: "Automate Task",
        icon: Zap,
        description: "Performs a pre-defined automated action.",
        color: "bg-yellow-500"
      },
      {
        id: "generate-text",
        name: "Generate Text",
        icon: FileText,
        description: "Uses an AI model to generate text content.",
        color: "bg-purple-500"
      },
      {
        id: "generate-image",
        name: "Generate Image",
        icon: Image,
        description: "Uses an AI model to generate an image.",
        color: "bg-pink-500"
      },
      {
        id: "generate-video",
        name: "Generate Video",
        icon: Video,
        description: "Uses an AI model to generate a video.",
        color: "bg-red-500"
      },
      {
        id: "send-for-approval",
        name: "Send for Approval",
        icon: UserCheck,
        description: "Sends generated content for human approval.",
        color: "bg-cyan-500"
      }
    ]
  },
  {
    name: "Logic",
    nodes: [
      {
        id: "check-memory",
        name: "Check Memory",
        icon: Database,
        description: "Retrieves data from Supabase memory.",
        color: "bg-teal-500"
      },
      {
        id: "check-task-list",
        name: "Check Task List",
        icon: List,
        description: "Gets the next task from a list.",
        color: "bg-gray-500"
      }
    ]
  }
];

export default function NodeLibrary() {
  const handleDragStart = (e, nodeType) => {
    e.dataTransfer.setData('application/node-type', nodeType.id);
    e.dataTransfer.setData('application/node-name', nodeType.name);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-80 bg-slate-900 border-r border-slate-700 p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">Node Library</h2>
        <p className="text-sm text-gray-400">Drag nodes to build workflows</p>
      </div>
      {CATEGORIES.map(category => (
        <div key={category.name} className="mb-8">
          <h3 className="text-sm font-bold text-indigo-300 mb-3 uppercase tracking-wider">{category.name}</h3>
          <div className="space-y-3">
            {category.nodes.map(nodeType => (
              <motion.div
                key={nodeType.id}
                className="bg-slate-800 rounded-lg p-4 border border-slate-700 cursor-move hover:border-indigo-500 transition-all duration-200"
                draggable
                onDragStart={e => handleDragStart(e, nodeType)}
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
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 