import React from 'react'
import { Loader } from "lucide-react";

const Loading:React.FC = () => {
  return (
    <div className="mx-auto bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader className="animate-spin h-8 w-8 text-green-600 mx-auto" />
        <p className="mt-2 text-gray-600">Loading profile...</p>
      </div>
    </div>
  );
}

export default Loading
