import React from "react";
import {
  ArrowRight,
  CheckCircle,
  Star,
  Shield,
  Clock,
  Users,
  MapPin,
  Calendar,
  // Phone,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection: React.FC = () => {
  return (
    <section
      id="home"
      className="relative overflow-hidden w-full bg-gray-50 lg:px-25 md:px-8 px-4 -mt-15 lg:-mt-25"
    >
      <div className="container-custom relative z-10 w-full">
        <div className="min-h-screen flex items-center">
          <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
            {/* Left Content */}
            <div className="space-y-8 w-full">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-primary-100">
                <CheckCircle className="w-full max-w-5 h-5 text-primary-600" />
                <span className="text-body-sm font-medium text-gray-700">
                  Trusted by 10,000+ Families Nationwide
                </span>
              </div>

              {/* Main Heading */}
              <div className="space-y-6 w-full">
                <h1 className="text-3xl font-bold md:text-[3.5rem] leading-tight text-gray-900">
                  Book{" "}
                  <span className="text-primary-600">Verified Healthcare</span>{" "}
                  Workers Instantly
                </h1>
                <p className="text-body-lg text-gray-600 leading-relaxed w-full max-w-xl">
                  <strong>ToltimMed</strong> connects you with certified nurses
                  and community health workers for compassionate, professional
                  care. Find and book the right professional for elderly care,
                  post-surgery support, or routine health monitoring in just a
                  few clicks.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col flex-wrap md:grid grid-cols-2 gap-4 w-full">
                <Link
                  to="/register"
                  className="btn-primary flex items-center gap-2 text-body-base w-full"
                >
                  Get Started Now
                  <ArrowRight className="w-full max-w-5 h-5" />
                </Link>
                <a
                  href="#how-it-works"
                  className="btn-secondary flex items-center gap-2 text-body-base w-full"
                >
                  Learn How It Works
                </a>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-3 gap-6 pt-4 w-full">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-full max-w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-full max-w-6 h-6 text-primary-600" />
                  </div>
                  <div className="text-body-sm font-semibold text-gray-900">
                    Vetted Pros
                  </div>
                </div>

                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-full max-w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-full max-w-6 h-6 text-primary-600" />
                  </div>
                  <div className="text-body-sm font-semibold text-gray-900">
                    24/7 Booking
                  </div>
                </div>

                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-full max-w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Users className="w-full max-w-6 h-6 text-primary-600" />
                  </div>
                  <div className="text-body-sm font-semibold text-gray-900">
                    Fast Match
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Platform UI Mockup */}
            <div className="relative hidden lg:block w-full">
              <div className="relative w-full">
                {/* Main Card - Patient/Booking Details */}
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full transform hover:scale-[1.02] transition-transform duration-300 border border-gray-100">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6 w-full">
                    <h3 className="text-body-lg font-bold text-gray-900">
                      Available Nurses
                    </h3>
                    <span className="badge-available">3 Available Now</span>
                  </div>

                  {/* Healthcare Worker Card 1 */}
                  <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-5 mb-4 w-full border border-primary-100">
                    <div className="flex items-start gap-4 w-full">
                      <div className="relative">
                        <img
                          src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop"
                          alt="Nurse Sarah"
                          className="w-full max-w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-full max-w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                          <CheckCircle className="w-full max-w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 w-full">
                        <div className="flex items-start justify-between mb-2 w-full">
                          <div className="w-full">
                            <h4 className="text-body-base font-bold text-gray-900">
                              Sarah Johnson
                            </h4>
                            <p className="text-body-xs text-gray-600">
                              Registered Nurse • 8 years exp
                            </p>
                          </div>
                          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg">
                            <Star className="w-full max-w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-body-xs font-bold text-gray-900">
                              4.9
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-body-xs text-gray-600 mb-3">
                          <MapPin className="w-full max-w-3 h-3" />
                          <span>Port Harcourt</span>
                          <span className="w-full max-w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span>340+ services</span>
                        </div>
                        <div className="flex flex-wrap gap-2 w-full">
                          <span className="px-3 py-1 bg-white text-primary-700 rounded-full text-body-xs font-medium">
                            Elderly Care
                          </span>
                          <span className="px-3 py-1 bg-white text-primary-700 rounded-full text-body-xs font-medium">
                            Post-Surgery
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Healthcare Worker Card 2 */}
                  <div className="bg-gray-50 rounded-2xl p-5 mb-6 w-full border border-gray-200">
                    <div className="flex items-start gap-4 w-full">
                      <div className="relative">
                        <img
                          src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=80&h=80&fit=crop"
                          alt="Nurse Aisha"
                          className="w-full max-w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-full max-w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                          <CheckCircle className="w-full max-w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 w-full">
                        <div className="flex items-start justify-between mb-2 w-full">
                          <div className="w-full">
                            <h4 className="text-body-base font-bold text-gray-900">
                              Aisha Mohammed
                            </h4>
                            <p className="text-body-xs text-gray-600">
                              Registered Nurse • 10 years exp
                            </p>
                          </div>
                          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg">
                            <Star className="w-full max-w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-body-xs font-bold text-gray-900">
                              5.0
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-body-xs text-gray-600 mb-3">
                          <MapPin className="w-full max-w-3 h-3" />
                          <span>Abuja</span>
                          <span className="w-full max-w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span>420+ services</span>
                        </div>
                        <div className="flex flex-wrap gap-2 w-full">
                          <span className="px-3 py-1 bg-white text-gray-700 rounded-full text-body-xs font-medium">
                            Pediatric Care
                          </span>
                          <span className="px-3 py-1 bg-white text-gray-700 rounded-full text-body-xs font-medium">
                            Maternal Health
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-primary-500 text-white py-4 rounded-xl font-semibold hover:bg-primary-600 transition-colors flex items-center  justify-center gap-2">
                    View All Available Nurses
                    <ArrowRight className="w-full max-w-5 h-5" />
                  </button>
                </div>

                {/* Floating Stats Card - Top Right */}
                <div className="absolute -top-8 -right-8 bg-white rounded-2xl shadow-xl p-5 w-full max-w-52 animate-float border border-gray-100">
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-full max-w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Heart className="w-full max-w-6 h-6 text-green-600" />
                    </div>
                    <div className="w-full">
                      <div className="text-h5 font-bold text-gray-900">
                        500+
                      </div>
                      <div className="text-body-xs text-gray-600">
                        Verified Professionals
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Booking Card - Bottom Left */}
                <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-xl p-5 w-full max-w-64 animate-float-delayed border border-gray-100">
                  <div className="w-full">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-full max-w-5 h-5 text-primary-600" />
                      <span className="text-body-sm font-bold text-gray-900">
                        Quick Booking
                      </span>
                    </div>
                    <div className="space-y-2 w-full">
                      <div className="flex items-center justify-between text-body-xs w-full">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-semibold text-gray-900">
                          Today, 3:00 PM
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-body-xs w-full">
                        <span className="text-gray-600">Service:</span>
                        <span className="font-semibold text-gray-900">
                          BedSide
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-3">
                        <div className="h-full w-full max-w-[75%] bg-primary-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="text-body-xs text-gray-600">
                        Matching with nurse...
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Review Card - Right Side */}
                <div className="absolute top-1/2 -right-12 transform -translate-y-1/2 bg-white rounded-2xl shadow-xl p-4 w-full max-w-56 animate-float border border-gray-100">
                  <div className="flex items-center gap-2 mb-2 w-full">
                    <img
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop"
                      alt="Patient"
                      className="w-full max-w-10 h-10 rounded-full object-cover"
                    />
                    <div className="w-full">
                      <div className="text-body-sm font-bold text-gray-900">
                        Mrs. Adebayo
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-full max-w-3 h-3 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-body-xs text-gray-600 italic">
                    "Excellent care for my mother. Very professional!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(var(--tw-translate-x), var(--tw-translate-y)) translateY(0px); }
          50% { transform: translate(var(--tw-translate-x), var(--tw-translate-y)) translateY(-15px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
