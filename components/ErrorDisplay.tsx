'use client';

import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

export default function ErrorDisplay({ message }: ErrorDisplayProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
        <p className="text-gray-700">{message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    </div>
  );
} 