"use client"

import { Handle, Position } from 'reactflow'
import { FileText, Download } from 'lucide-react'

export default function DocumentNode({ data }: { data: any }) {
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
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {data.title}
          </h3>
        </div>

        <div className="space-y-2">
          {data.documents.map((doc: any, index: any) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-[#2D2D33] rounded-md"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {doc.name}
              </span>
              <button
                onClick={() => window.open(doc.url, '_blank')}
                className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 