import React from 'react'

export default function DashBoard(){
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">Coming Soon</h1>
        <p className="text-xl text-gray-600 mb-8">We're working on something amazing!</p>
        <div className="w-16 h-1 bg-purple-500 mx-auto rounded-full"></div>
      </div>
    </div>
  )
}

