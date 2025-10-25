import { CheckCircle, Users, Clock } from "lucide-react";

const HowITWorks = () => {
  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          How Toltimed Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Health Assessment */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow duration-200">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Health Assessment
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Complete our smart health assessment form to get personalized test
              recommendations and care guidance.
            </p>
          </div>

          {/* Nurse Matching */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow duration-200">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Nurse Matching
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Get matched with qualified, licensed nurses in your area based on
              your specific healthcare needs.
            </p>
          </div>

          {/* Home Treatment */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow duration-200">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Home Treatment
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Receive professional medical care in the comfort of your home with
              scheduled treatment sessions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowITWorks;
