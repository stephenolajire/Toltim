import React from "react";
import {
  Star,
  Heart,
  Shield,
  ThumbsUp,
} from "lucide-react";

const TestimonialsSection: React.FC = () => {

  const testimonials = [
    {
      id: 1,
      name: "Mrs. Adebayo Folake",
      role: "Elderly Care Patient",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      rating: 5,
      testimony:
        "After my hip surgery, I was worried about recovery at home. Toltimed connected me with Sarah, an amazing nurse who provided exceptional post-surgery care. She was professional, caring, and made my recovery so much easier. I'm forever grateful!",
      service: "Post-Surgery Care",
      location: "Port Harcourt",
    },
    {
      id: 2,
      name: "Mr. Chukwu Emmanuel",
      role: "Diabetes Patient",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      rating: 5,
      testimony:
        "Living with diabetes was challenging until I found Toltimed. The community health worker they assigned to me has been incredible - helping me manage my diet, monitor my blood sugar, and stay on track. My health has improved dramatically!",
      service: "Chronic Disease Management",
      location: "Lagos",
    },
    {
      id: 3,
      name: "Mrs. Okafor Grace",
      role: "New Mother",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
      rating: 5,
      testimony:
        "As a first-time mother, I was overwhelmed. The pediatric nurse from Toltimed was a lifesaver! She guided me through newborn care, breastfeeding, and answered all my questions with patience and expertise. Highly recommended!",
      service: "Pediatric Care",
      location: "Abuja",
    },
    {
      id: 4,
      name: "Dr. Bello Ahmed",
      role: "Family Caregiver",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      rating: 5,
      testimony:
        "My elderly father needed daily care while I was at work. Toltimed provided us with a compassionate nurse who treats him like family. The booking process was simple, and the quality of care exceeded our expectations.",
      service: "Elderly Care",
      location: "Port Harcourt",
    },
    {
      id: 5,
      name: "Miss Nwankwo Chioma",
      role: "Working Professional",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
      rating: 5,
      testimony:
        "I needed regular blood pressure monitoring due to my hypertension. The health worker assigned to me is professional, punctual, and very knowledgeable. I feel secure knowing I'm in good hands. Thank you, Toltimed!",
      service: "Health Monitoring",
      location: "Enugu",
    },
    {
      id: 6,
      name: "Mr. Yusuf Ibrahim",
      role: "Post-Accident Recovery",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
      rating: 5,
      testimony:
        "After my accident, I needed intensive home care. Toltimed's nurse was exceptional - professional wound care, physical therapy assistance, and emotional support. The platform made it so easy to get quality healthcare at home.",
      service: "Post-Surgery Care",
      location: "Lagos",
    },
  ];

  const impactStats = [
    {
      icon: Heart,
      value: "10,000+",
      label: "Happy Families",
      color: "red",
    },
    {
      icon: Star,
      value: "2,500+",
      label: "5-Star Reviews",
      color: "yellow",
    },
    {
      icon: ThumbsUp,
      value: "98%",
      label: "Satisfaction Rate",
      color: "blue",
    },
    {
      icon: Shield,
      value: "100%",
      label: "Verified Care",
      color: "green",
    },
  ];


  return (
    <section
      id="testimonials"
      className="w-full lg:pb-20 lg:px-25 md:pb-8 md:px-8 px-4 pb-5 "
    >
      <div className="container-custom w-full">
        {/* Section Header */}
        <div className="text-center mb-10 w-full">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-4">
            <Heart className="w-full max-w-4 h-4" />
            <span className="text-body-sm font-medium">Patient Stories</span>
          </div>
          <h2 className="text-h2 text-gray-900 mb-4">What Our Patients Say</h2>
          <p className="text-body-lg text-gray-600 max-w-3xl mx-auto w-full">
            Real experiences from real families who have trusted us with their
            healthcare needs. Your wellbeing is our mission, and these stories
            inspire us every day.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 w-full">
          {impactStats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClass = {
              red: "bg-red-50 text-red-600",
              yellow: "bg-yellow-50 text-yellow-600",
              blue: "bg-blue-50 text-blue-600",
              green: "bg-green-50 text-green-600",
            }[stat.color];

            return (
              <div
                key={index}
                className="w-full bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100"
              >
                <div
                  className={`w-full max-w-12 h-12 ${colorClass} rounded-xl flex items-center justify-center mx-auto mb-3`}
                >
                  <Icon className="w-full max-w-6 h-6" />
                </div>
                <div className="text-h4 font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-body-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Additional Testimonials Grid */}
        <div className="w-full mb-16">
          <h3 className="text-h4 text-gray-900 mb-8 text-center">
            Stories from Our Community
          </h3>
          <div className="grid md:grid-cols-3 gap-6 w-full">
            {testimonials.slice(0, 3).map((testimonial) => (
              <div
                key={testimonial.id}
                className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
              >
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-full max-w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-body-sm text-gray-700 mb-6 w-full line-clamp-4">
                  "{testimonial.testimony}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 w-full">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full max-w-12 h-12 rounded-full object-cover"
                  />
                  <div className="w-full">
                    <div className="text-body-base font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-body-xs text-gray-600">
                      {testimonial.service}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
