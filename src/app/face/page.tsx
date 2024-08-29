import React from 'react'

function Face() {
  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl mb-4 font-bold">Detection Face</h2>
      <div className="bg-gray-200 p-6 rounded-lg shadow-lg space-x-15">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Select Image File
          </label>
          <div className="flex items-center">
          <input type="file" accept="image/*"  className="file-input file-input-bordered file-input-sm w-full max-w-xs" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
           Select Video File
          </label>
          <div className="flex items-center">
          <input type="file" accept="video/*" className="file-input file-input-bordered file-input-sm w-full max-w-xs" />
          </div>
        </div>
      </div>
      <button 
        className="mt-4 bg-success text-white px-4 py-2 rounded-lg shadow">
        Check
      </button>
    </div>
  )
}

export default Face