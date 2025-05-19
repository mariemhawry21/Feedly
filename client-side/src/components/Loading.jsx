"use client";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";

function LoadingThreeDotsJumping() {
  const dotVariants = {
    jump: {
      y: -30,
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      animate="jump"
      transition={{ staggerChildren: -0.2, staggerDirection: -1 }}
      className="container"
    >
      <motion.div className="dot" variants={dotVariants} />
      <motion.div className="dot" variants={dotVariants} />
      <motion.div className="dot" variants={dotVariants} />
      <StyleSheet />
    </motion.div>
  );
}

/**
 * ==============   Styles   ================
 */
function StyleSheet() {
  return (
    <style>
      {`
            .container {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 10px;
                height:100vh
            }

            .dot {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color: #1976d2;
                will-change: transform;
            }
            `}
    </style>
  );
}

export default LoadingThreeDotsJumping;
