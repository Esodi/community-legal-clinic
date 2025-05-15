"use client"

import { Handle, Position } from 'reactflow'
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

export default function HelpNode({ data }: { data: any }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white dark:bg-[#1F1F23] rounded-lg shadow-lg border border-gray-200 dark:border-[#3D3D43] w-[300px]">
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-3 !h-3 !bg-blue-500" 
        style={{ top: '50%' }}
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-3 !h-3 !bg-blue-500" 
        style={{ top: '50%' }}
      />
      
      <div className="p-4">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {data.title}
            </h3>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          )}
        </div>

        {isExpanded && (
          <div className="mt-4 p-3 bg-purple-50 dark:bg-[#2D2D33] rounded-md">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {data.content}
            </p>
            <div className="mt-3 pt-3 border-t border-purple-100 dark:border-[#3D3D43]">
              <a
                href="#"
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
              >
                View Full Documentation →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 