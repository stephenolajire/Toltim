import React from "react";
import Card from "./Card";
import { BiCheckCircle} from "react-icons/bi";
import { LuUsers, LuClock4 } from "react-icons/lu";


const cardData: Array<{
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  variant: "green" | "blue" | "pink";
}> = [
  {
    id: 1,
    title: "Health Assessment",
    description:
      "Complete our smart health assessment form to get personalized test recommendations and care guidance.",
    icon: <BiCheckCircle />,
    variant: "green",
  },
  {
    id: 2,
    title: "Nurse Matching",
    description:
      "Get matched with qualified, licensed nurses in your area based on your specific healthcare needs.",
    icon: <LuUsers />,
    variant: "blue",
  },
  {
    id: 3,
    title: "Home Treatment",
    description:
      "Receive professional medical care in the comfort of your home with scheduled treatment sessions.",
    icon: <LuClock4 />,
    variant: "pink",
  },
];

const HowItWorks: React.FC = () => {
  return (
    <div className="py-12 w-full">
      <h2 className="text-3xl text-gray-900 font-bold text-center mb-12">
        How Toltimed Works
      </h2>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-4 md:px-20 lg:px-50">
        {cardData.map((data) => {
          return (
            <Card
              key={data.id}
              title={data.title}
              description={data.description}
              id={data.id}
              icon={data.icon}
              variant={data.variant}
            />
          );
        })}
      </div>
    </div>
  );
};

export default HowItWorks;
