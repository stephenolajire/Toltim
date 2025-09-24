import React from 'react'
import { AlertCircle } from "lucide-react";

const Error:React.FC = () => {
  return (
    <div className="mx-auto bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="h-8 w-8 text-red-600 mx-auto" />
        <p className="mt-2 text-red-600">Failed to load profile data</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export default Error
