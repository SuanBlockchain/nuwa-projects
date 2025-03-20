"use client";

import React from "react";
import { motion } from "framer-motion";
import { UploadIcon, ReaderIcon, BarChartIcon, BlendingModeIcon } from "@radix-ui/react-icons";

const containerVariants = {
  hidden: { opacity: 0},
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1 },
};

export default function WorkflowSection() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="py-12 bg-stone-100 dark:bg-stone-900"
    >
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <motion.div variants={itemVariants} className="my-12 text-center">
          <h2 className="text-3xl font-semibold leading-tight text-gray-800 dark:text-gray-100">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            From Land Analysis to Carbon Credit Quantification
          </p>
          <p className="mt-2 max-w-3xl mx-auto text-gray-500 dark:text-gray-300">
            Our platform simplifies the carbon offset process by helping you
            assess land feasibility, analyze potential, and calculate verified carbon credits.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 xl:gap-16 text-center">
          {[
            {
              IconComponent: UploadIcon,
              width: 30,
              height: 30,
              title: "Upload or Select Land",
              description:
                "Provide your land data or select a location to start the carbon analysis process.",
            },
            {
              IconComponent: ReaderIcon,
              width: 30,
              height: 30,
              title: "Get Feasibility Report",
              description:
                "Receive an automated feasibility report with quick estimation",
            },
            {
              IconComponent: BarChartIcon,
              width: 30,
              height: 30,
              title: "Review Project Insights",
              description:
                "Analyze project potential, environmental data, and carbon credit estimates.",
            },
            {
              IconComponent: BlendingModeIcon,
              width: 30,
              height: 30,
              title: "Participate & Monetize",
              description:
                "Join carbon projects, integrate your land assets, receive participation tokens.",
            },
          ].map((card, index) => (
            <motion.div key={index} variants={itemVariants}>
              <WorkFlowCard {...card} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const WorkFlowCard = ({
  IconComponent,
  width,
  height,
  title,
  description,
}: {
  IconComponent: React.ComponentType<{ width?: number; height?: number }>;
  width?: number;
  height?: number;
  title: string;
  description: string;
}) => (
  <div className="px-4 py-12 shadow-lg rounded-lg md:h-72 bg-primary-50 dark:bg-primary-900">
    <div className= "p-[0.6rem] rounded-full mb-4 h-10 w-10 mx-auto flex items-center justify-center">
      <IconComponent width={width} height={height} />
    </div>
    <h4 className="mt-4 text-xl font-medium text-gray-800 dark:text-gray-400">{title}</h4>
    <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">{description}</p>
  </div>
);
