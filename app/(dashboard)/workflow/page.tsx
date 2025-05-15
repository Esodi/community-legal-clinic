"use client"

import { useState, useCallback, useEffect } from 'react'
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  ConnectionMode,
  Panel,
  BackgroundVariant,
  MiniMap,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useTheme } from 'next-themes'

import NotesNode from '@/components/nodes/NotesNode'
import DocumentNode from '@/components/nodes/DocumentNode'
import HelpNode from '@/components/nodes/HelpNode'
import CustomEdge from '@/components/edges/CustomEdge'
import '@/styles/edges.css'
import LoadingSpinner from '@/components/LoadingSpinner'
type NodeData = {
  content?: string;
  title?: string;
  documents?: Array<{ name: string; url: string }>;
}

const nodeTypes = {
  notesNode: NotesNode,
  documentNode: DocumentNode,
  helpNode: HelpNode,
}

const edgeTypes = {
  custom: CustomEdge,
}

// Sample law case text for demonstration
const sampleLawCase = `# Smith vs. Johnson Corporation

## Case Summary
This case involves allegations of workplace discrimination and wrongful termination.

### Key Points
1. Plaintiff claims discrimination based on age
2. Evidence of systematic pattern of behavior
3. Multiple witnesses corroborate claims

## Legal Analysis
The case presents clear violations of employment law statutes...`

const initialNodes = [
  {
    id: '1',
    type: 'notesNode',
    position: { x: 50, y: 50 },
    data: { content: sampleLawCase }
  },
  {
    id: '2',
    type: 'documentNode',
    position: { x: 800, y: 50 },
    data: { 
      title: 'Case Documents',
      documents: [
        { name: 'Initial Filing.pdf', url: '#' },
        { name: 'Evidence A.pdf', url: '#' },
        { name: 'Witness Statements.pdf', url: '#' }
      ]
    }
  },
  {
    id: '3',
    type: 'helpNode',
    position: { x: 1225, y: 400 },
    data: { 
      title: 'Legal Guidelines',
      content: 'Reference materials for employment law cases and procedural requirements.'
    }
  },
]

const initialEdges = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2',
    type: 'custom',
    animated: true,
    style: { opacity: 0.8 }
  },
  { 
    id: 'e1-3', 
    source: '1', 
    target: '3',
    type: 'custom',
    animated: true,
    style: { opacity: 0.8 }
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'custom',
    animated: true,
    style: { opacity: 0.8 }
  }
]

export default function WorkflowPage() {
  const [nodes, setNodes] = useState<Node<NodeData>[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setMounted(true)
    setLoading(false)
  }, [])

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )

  // Default colors for initial render
  const nodeColor = mounted ? (theme === 'dark' ? '#4B5563' : '#9CA3AF') : '#9CA3AF'
  const maskColor = mounted ? (theme === 'dark' ? 'rgba(47, 47, 47, 0.7)' : 'rgba(240, 240, 240, 0.7)') : 'rgba(240, 240, 240, 0.7)'
  const bgColor = mounted ? (theme === 'dark' ? '#ffffff' : '#000000') : '#000000'

  if (loading) {
    return (
        <LoadingSpinner />
    )
  }

  return (
    <div className="h-[calc(100vh-4rem)] w-full bg-gray-50 dark:bg-[#1F1F23]">
      <div className="h-full w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={{
            type: 'custom',
            animated: true,
          }}
          connectionMode={ConnectionMode.Loose}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.2}
          maxZoom={4}
          fitView
          fitViewOptions={{ 
            padding: 0.2,
            minZoom: 0.2,
            maxZoom: 2,
          }}
          proOptions={{ hideAttribution: true }}
          className="dark:[&_.react-flow__controls]:bg-[#1F1F23] dark:[&_.react-flow__controls-button]:bg-[#1F1F23] dark:[&_.react-flow__minimap]:bg-[#1F1F23] dark:[&_.react-flow__minimap-mask]:fill-[#2D2D33]"
        >
          <Panel 
            position="top-left" 
            className="bg-white dark:bg-[#1F1F23] p-4 rounded-lg shadow-lg m-4 border border-gray-200 dark:border-gray-800"
          >
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Case Workflow
            </h1>
          </Panel>
          <Controls 
            className="bg-white dark:bg-[#1F1F23] border border-gray-200 dark:border-gray-800 [&>button]:border-gray-200 dark:[&>button]:border-gray-800 [&>button]:bg-white dark:[&>button]:bg-[#1F1F23] [&>button]:fill-gray-700 dark:[&>button]:fill-gray-200 [&>button]:hover:bg-gray-100 dark:[&>button]:hover:bg-[#2D2D33] [&>button]:transition-colors"
            showInteractive={false}
            position="bottom-left"
          />
          <MiniMap 
            className="bg-white dark:bg-[#1F1F23] border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg"
            style={{ backgroundColor: 'transparent' }}
            nodeColor={nodeColor}
            maskColor={maskColor}
            position="bottom-right"
          />
          <Background 
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color={bgColor}
            className="opacity-[0.15] dark:opacity-[0.15]"
          />
        </ReactFlow>
      </div>
    </div>
  )
} 