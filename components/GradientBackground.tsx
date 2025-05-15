"use client"

export default function GradientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 via-transparent to-amber-100/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(172,109,8,0.1),transparent_70%)]" />
    </div>
  )
} 