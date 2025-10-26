import React from "react";
import {
  Shield,
  Award,
  FileCheck,
  UserCheck,
  Heart,
  Lock,
  Star,
} from "lucide-react";

const HealthcareWorkersSection: React.FC = () => {
  const verificationSteps = [
    {
      icon: FileCheck,
      title: "License Verification",
      description:
        "We verify all professional licenses and certifications with regulatory bodies to ensure authenticity.",
    },
    {
      icon: UserCheck,
      title: "Background Screening",
      description:
        "Comprehensive background checks including criminal records, employment history, and reference verification.",
    },
    {
      icon: Award,
      title: "Skills Assessment",
      description:
        "Rigorous evaluation of clinical skills, medical knowledge, and hands-on competency testing.",
    },
    {
      icon: Heart,
      title: "Ongoing Monitoring",
      description:
        "Continuous performance reviews, patient feedback analysis, and regular compliance audits.",
    },
  ];

  const safetyFeatures = [
    {
      icon: Shield,
      title: "100% Insured",
      stat: "Full Coverage",
      detail: "Every professional carries comprehensive liability insurance",
    },
    {
      icon: Star,
      title: "Highly Rated",
      stat: "4.9/5 Average",
      detail: "Based on thousands of verified patient reviews",
    },
    {
      icon: Lock,
      title: "Privacy Protected",
      stat: "HIPAA Compliant",
      detail: "Your health information is secure and confidential",
    },
  ];

  return (
    <section id="workers" className="lg:pb-20 md:pb-8 pb-5 bg-gray-50">
      <div className="w-full mx-auto px-4 md:px-8 lg:px-25">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Your Safety First</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Trust the Professionals You Invite Home
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We understand that inviting healthcare workers into your home
            requires complete trust. That's why we implement the most rigorous
            vetting process in the industry.
          </p>
        </div>

        {/* Main Statement */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12 border-2 border-blue-100">
          <div className="flex flex-col md:flex-row items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Every Healthcare Worker is Thoroughly Vetted
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Before any healthcare professional joins our platform, they
                undergo an extensive screening process that takes 2-3 weeks to
                complete. We don't just check boxes—we verify every credential,
                validate every claim, and ensure they meet our high standards
                for professionalism, competence, and care.
              </p>
            </div>
          </div>
        </div>

        {/* Verification Process */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Our 4-Stage Verification Process
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {verificationSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex flex-col items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold text-blue-600">
                          Stage {index + 1}
                        </span>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {step.title}
                        </h4>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Safety Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {safetyFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200"
              >
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  {feature.title}
                </h4>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {feature.stat}
                </div>
                <p className="text-sm text-gray-600">{feature.detail}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HealthcareWorkersSection;
