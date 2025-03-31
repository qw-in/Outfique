"use client";
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';

const LoadingPage = () => {
  // Logo animation variants
  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.8,
        ease: "easeOut" 
      }
    }
  };

  // Loading bar animation variants
  const loadingBarVariants = {
    hidden: { width: "0%" },
    visible: { 
      width: "100%",
      transition: { 
        duration: 2.5,
        ease: "easeInOut" 
      }
    }
  };

  // Dots animation variants
  const dotsVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const dotVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: [0, 1, 0],
      y: [10, 0, 10],
      transition: {
        repeat: Infinity,
        duration: 1.5
      }
    }
  };

  // Simulate loading completion (you would replace this with actual loading logic)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Navigate to main page or update loading state
      // This is where you would typically redirect or update your app state
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white h-screen w-screen flex flex-col items-center justify-center">
      <Head>
        <title>Outfique | Loading...</title>
      </Head>
      
      {/* Logo */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={logoVariants}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="text-gray-800">out</span>
          <span className="text-purple-600">fique</span>
        </h1>
      </motion.div>
      
      {/* Loading bar */}
      <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full bg-purple-600"
          initial="hidden"
          animate="visible"
          variants={loadingBarVariants}
        />
      </div>
      
      {/* Loading text with animated dots */}
      <div className="flex items-center text-gray-600">
        <span>Loading</span>
        <motion.div 
          className="flex ml-1"
          variants={dotsVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.span variants={dotVariant} className="mx-0.5">.</motion.span>
          <motion.span variants={dotVariant} className="mx-0.5">.</motion.span>
          <motion.span variants={dotVariant} className="mx-0.5">.</motion.span>
        </motion.div>
      </div>
      
      {/* Fashion-related tagline */}
      <motion.p 
        className="mt-8 text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        Discover your unique style
      </motion.p>
    </div>
  );
};

export default LoadingPage;