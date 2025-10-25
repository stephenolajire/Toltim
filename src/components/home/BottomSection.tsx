const BottomSection = () => {
  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Why Choose Toltimed */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Why Choose Toltimed?
            </h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 border-2 border-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Licensed Professionals
                  </h3>
                  <p className="text-gray-600">
                    All our nurses are licensed and verified healthcare
                    professionals.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 border-2 border-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Nationwide Coverage
                  </h3>
                  <p className="text-gray-600">
                    Serving communities across Nigeria with expanding coverage.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 border-2 border-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    24/7 Availability
                  </h3>
                  <p className="text-gray-600">
                    Healthcare support when you need it, day or night.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Card */}
          <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="mb-6 opacity-90">
              Join thousands of Nigerians who trust Toltimed for their
              healthcare needs.
            </p>
            <button className="w-full bg-white text-gray-900 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              Create Your Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomSection;
