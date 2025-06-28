import React, { type ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
  title: string;
  description: string;
  id: number;
  icon: ReactNode;
  variant?: "green" | "blue" | "pink";
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  icon,
  variant = "green",
}) => {
  const colorClasses = {
    green: {
      border: "hover:border-green-200",
      text: "text-green-700",
      bg: "bg-green-100",
    },
    blue: {
      border: "hover:border-blue-200",
      text: "text-blue-700",
      bg: "bg-blue-200",
    },
    pink: {
      border: "hover:border-pink-200",
      text: "text-pink-700",
      bg: "bg-pink-200",
    },
  } as const;

  const colors = colorClasses[variant] || colorClasses.green;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      className={`w-full h-auto bg-white border-2 border-gray-100 rounded-lg p-4 flex flex-col items-center justify-center ${colors.border} transition duration-300`}
    >
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        viewport={{ once: false}}
        className={`mb-5 h-15 w-15 rounded-full flex items-center justify-center ${colors.text} ${colors.bg} transition duration-300`}
      >
        <div className="text-3xl">{icon}</div>
      </motion.div>
      <h3 className="text-xl text-black/80 font-medium mb-5">{title}</h3>
      <p className="text-gray-500 text-center text-lg md:text-lg">
        {description}
      </p>
    </motion.div>
  );
};

export default Card;
