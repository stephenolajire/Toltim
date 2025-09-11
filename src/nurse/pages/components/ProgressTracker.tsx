import React from "react";
import { CheckCircle } from "lucide-react";
import { type KycStage } from "../../../types/kyctypes";

interface ProgressTrackerProps {
  stages: KycStage[];
  currentStage: number;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  stages,
  currentStage,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <h2 className="text-lg font-semibold text-green-600 mb-4">
        Verification Stages
      </h2>
      <p className="text-gray-600 mb-6">
        Track your application progress through our verification process
      </p>

      <div className="space-y-4">
        {stages.map((stage, index) => {
          const isCompleted = index < currentStage;
          const isCurrent = index === currentStage;

          return (
            <div key={stage.id} className="flex items-center space-x-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? "bg-green-100 text-green-600"
                    : isCurrent
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {isCompleted ? <CheckCircle className="w-5 h-5" /> : stage.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3
                    className={`font-medium ${
                      isCurrent
                        ? "text-blue-600"
                        : isCompleted
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {stage.title}
                  </h3>
                  {isCurrent && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{stage.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};