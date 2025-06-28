import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero: React.FC = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Delay between each child animation
        delayChildren: 0.2, // Initial delay before children start animating
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gray-100 h-[60vh] flex flex-col items-center justify-center text-center w-full"
    >
      <motion.h1
        variants={itemVariants}
        className="text-gray-900 text-4xl md:text-5xl lg:text-6xl font-bold"
      >
        Healthcare at Your{" "}
        <motion.span
          className="text-green-600"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" as const }}
        >
          Doorstep
        </motion.span>
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="text-gray-500 text-lg px-2 md:px-0 sm:text-lg md:text-xl mt-4 max-w-2xl mx-auto"
      >
        Connect with licensed nurses across Nigerian communities. Get
        professional healthcare services delivered to your home with our smart
        assessment and matching system.
      </motion.p>

      <Link to='/register'>
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-900 transition duration-300 capitalize"
        >
          Start your health journey
        </motion.button>
      </Link>
    </motion.section>
  );
};

export default Hero;
