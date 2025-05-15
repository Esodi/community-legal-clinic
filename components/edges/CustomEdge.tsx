"use client"

import { BaseEdge, EdgeProps, getBezierPath } from 'reactflow'

export default function CustomEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.3 // Reduced curvature for smoother curves
  })

  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        ...style,
        strokeWidth: 1.5,
        stroke: '#6B7280',
        strokeDasharray: '4,4',
        animation: 'flow 20s linear infinite',
        opacity: 0.7
      }}
    />
  )
} 