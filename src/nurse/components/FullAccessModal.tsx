import React from 'react';
import { X, User, Stethoscope, Activity, Download, Image, Calendar } from 'lucide-react';

interface TestResult {
  name: string;
  date: string;
  result: string;
  normalRange: string;
  status: 'normal' | 'elevated' | 'low';
}

interface PatientAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PatientAssessmentModal: React.FC<PatientAssessmentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const patientInfo = {
    name: 'Sarah Johnson',
    age: '34 years',
    primaryCondition: 'Post-surgical wound care',
    location: 'Victoria Island, Lagos',
    medicalHistory: 'Diabetes Type 2, Hypertension',
    knownAllergies: 'Penicillin, Shellfish',
    currentMedications: 'Metformin 500mg, Lisinopril 10mg'
  };

  const doctorRecommendations = {
    doctor: 'Dr. Michael Adeyemi (General Practitioner)',
    assessmentDate: '2024-06-27',
    careInstructions: [
      'Daily blood glucose monitoring',
      'Blood pressure check twice daily',
      'Medication adherence supervision',
      'Dietary guidance and monitoring',
      'Regular wound care assessment'
    ],
    specialNotes: 'Patient requires close monitoring for diabetes management. Ensure proper medication timing and document all vital signs. Report any unusual readings immediately.'
  };

  const testResults: TestResult[] = [
    {
      name: 'Blood Glucose (Fasting)',
      date: '2024-06-26',
      result: '145 mg/dL',
      normalRange: '70-100 mg/dL',
      status: 'elevated'
    },
    {
      name: 'Blood Pressure',  
      date: '2024-06-26',
      result: '150/95 mmHg',
      normalRange: '120/80 mmHg',
      status: 'elevated'
    },
    {
      name: 'HbA1c',
      date: '2024-06-25',
      result: '8.2%',
      normalRange: '< 7%',
      status: 'elevated'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'elevated':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'normal':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Patient Assessment & Treatment Plan
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Review patient information, doctor recommendations, and test results before starting treatment
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Patient Information */}
          <div className="border-l-4 border-blue-400 pl-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Patient Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Name</label>
                  <p className="font-medium text-gray-900">{patientInfo.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Primary Condition</label>
                  <p className="font-medium text-gray-900">{patientInfo.primaryCondition}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Medical History</label>
                  <p className="font-medium text-gray-900">{patientInfo.medicalHistory}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Known Allergies</label>
                  <p className="font-medium text-red-600">{patientInfo.knownAllergies}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Age</label>
                  <p className="font-medium text-gray-900">{patientInfo.age}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Location</label>
                  <p className="font-medium text-gray-900">{patientInfo.location}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Current Medications</label>
                  <p className="font-medium text-gray-900">{patientInfo.currentMedications}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Doctor's Recommendations */}
          <div className="border-l-4 border-green-400 pl-6">
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Doctor's Recommendations</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Recommendations by {doctorRecommendations.doctor}
            </p>
            
            <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Assessment Date: {doctorRecommendations.assessmentDate}</span>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Care Instructions:</h4>
              <ul className="space-y-2">
                {doctorRecommendations.careInstructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Special Notes:</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {doctorRecommendations.specialNotes}
              </p>
            </div>
          </div>

          {/* Recent Test Results */}
          <div className="border-l-4 border-purple-400 pl-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Recent Test Results</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Latest laboratory and vital sign results
            </p>

            <div className="space-y-4">
              {testResults.map((test, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{test.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(test.status)}`}>
                      {test.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Date: {test.date}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 block">Result</label>
                      <p className="font-medium text-gray-900">{test.result}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block">Normal Range</label>
                      <p className="font-medium text-gray-700">{test.normalRange}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-6">
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                <Download className="h-4 w-4" />
                <span>Download Full Report</span>
              </button>
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                <Image className="h-4 w-4" />
                <span>View Lab Images</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors">
            Start Treatment Plan
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-medium transition-colors">
            Request Additional Information
          </button>
          <button 
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-medium transition-colors"
          >
            Close Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientAssessmentModal

// Example usage component
// const AssessmentDemo: React.FC = () => {
//   const [isModalOpen, setIsModalOpen] = React.useState(false);

//   return (
//     <div className="p-8">
//       <button
//         onClick={() => setIsModalOpen(true)}
//         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
//       >
//         View Full Assessment
//       </button>
      
//       <PatientAssessmentModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//       />
//     </div>
//   );
// };

// export default AssessmentDemo;