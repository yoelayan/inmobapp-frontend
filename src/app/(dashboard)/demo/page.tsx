'use client'

import React from 'react'

export default function DemoPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Demo Page</h1>
      <p className="text-lg text-gray-600 mb-8">
        Esta es una página de demostración.
      </p>
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-md flex flex-col items-center">
        <span className="text-blue-500 text-5xl mb-4">
          <i className="tabler-info-circle" />
        </span>
        <p className="text-center text-gray-700">
          Puedes usar esta página para probar componentes, layouts o cualquier funcionalidad nueva.
        </p>
      </div>
    </div>
  )
}
