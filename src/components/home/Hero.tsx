import { Link } from "react-router-dom";
import { Stethoscope, CalendarCheck, Hospital } from "lucide-react";

const Hero = () => {
  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Healthcare at Your <span className="text-green-500">Doorstep</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Connect with licensed nurses across Nigerian communities. Get
            professional healthcare services delivered to your home with our
            smart assessment and matching system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register">
              <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 w-full sm:w-auto">
                Start Your Health Journey
              </button>
            </Link>
            {/* <Link to="/about">
                <button className="border-2 border-gray-300 hover:border-green-500 text-gray-700 font-semibold px-8 py-3 rounded-lg transition-colors duration-200 w-full sm:w-auto">
                  Learn More
                </button>
              </Link> */}
          </div>
        </div>

        {/* Visual Mockup */}
        <div className="relative">
          {/* Main Frame */}
          <div className="bg-white rounded-2xl shadow-xl p-6 relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="h-4 w-32 bg-gray-100 rounded"></div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>

              {/* Appointment Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <CalendarCheck className="w-6 h-6 text-blue-500 mb-2" />
                  <div className="h-3 w-20 bg-gray-200 rounded mb-2"></div>
                  <div className="h-2 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <Hospital className="w-6 h-6 text-purple-500 mb-2" />
                  <div className="h-3 w-20 bg-gray-200 rounded mb-2"></div>
                  <div className="h-2 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-green-500 rounded-full"></div>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-10 -right-6 w-24 h-24 bg-green-100 rounded-full -z-10"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-100 rounded-full -z-10"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
