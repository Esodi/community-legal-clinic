"use client"

import { useState } from 'react'
import { Handle, Position } from 'reactflow'
import ReactMarkdown from 'react-markdown'
import { Edit2, Save, X } from 'lucide-react'

export default function NotesNode({ data }: { data: any }) {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(data.content)
  const [tempContent, setTempContent] = useState(data.content)

  const handleSave = () => {
    setContent(tempContent)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempContent(content)
    setIsEditing(false)
  }

  return (
    <div className="bg-white dark:bg-[#1F1F23] rounded-lg shadow-lg border border-gray-200 dark:border-[#3D3D43] w-[400px]">
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-3 !h-3 !bg-blue-500" 
        style={{ top: '50%' }}
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-3 !h-3 !bg-blue-500" 
        style={{ top: '50%' }}
      />
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notes</h3>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="p-1 text-green-600 hover:text-green-700 rounded"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 text-red-600 hover:text-red-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {isEditing ? (
            <textarea
              value={tempContent}
              onChange={(e) => setTempContent(e.target.value)}
              className="w-full h-[300px] p-2 text-sm border rounded-md dark:bg-[#2D2D33] dark:border-[#3D3D43] dark:text-white"
              placeholder="Enter markdown content..."
            />
          ) : (
            <div className="prose dark:prose-invert prose-sm max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 